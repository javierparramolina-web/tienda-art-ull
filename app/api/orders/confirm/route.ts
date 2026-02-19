import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendOrderEmails } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentIntentId, email } = body;

        if (!paymentIntentId) {
            return NextResponse.json({ error: 'Missing paymentIntentId' }, { status: 400 });
        }

        // 1. Verify Payment with Stripe & Get Details
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ['latest_charge']
        });

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
        }

        // Try to get email from various sources in the Stripe object
        let customerEmail = email;
        if (!customerEmail) {
            const charge = paymentIntent.latest_charge as Stripe.Charge;
            customerEmail = paymentIntent.receipt_email || charge?.billing_details?.email;
        }

        if (!customerEmail) {
            console.warn('No email found for order', paymentIntentId);
            customerEmail = 'unknown@example.com';
        }

        // 2. Extract Metadata & Shipping
        const summary = paymentIntent.metadata.summary || 'No details';
        const shipping = paymentIntent.shipping;
        const billing = paymentIntent.payment_method ? (paymentIntent.payment_method as any).billing_details : null;

        const customerName = shipping?.name || billing?.name;
        const phone = shipping?.phone || billing?.phone;
        const addressLine = shipping?.address?.line1 || billing?.address?.line1;
        const city = shipping?.address?.city || billing?.address?.city;
        const zipCode = shipping?.address?.postal_code || billing?.address?.postal_code;

        // 3. Save Order to Database
        // We use the PaymentIntent ID as the Order ID for simplicity
        const order = await prisma.order.create({
            data: {
                id: paymentIntentId,
                status: 'PAID',
                total: paymentIntent.amount / 100, // Convert cents to EUR
                items: summary,
                customerEmail: customerEmail,
                customerName: customerName,
                address: addressLine,
                city: city,
                zipCode: zipCode,
                phone: phone,
            },
        });

        // 4. Send Emails (Non-blocking)
        // 4. Send Emails (Non-blocking)
        sendOrderEmails({
            orderId: order.id,
            customerEmail,
            customerName: customerName || undefined,
            address: addressLine || undefined,
            city: city || undefined,
            zipCode: zipCode || undefined,
            phone: phone || undefined,
            items: summary,
            total: order.total
        }).catch(console.error);

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        // Check if order already exists (idempotency)
        if ((error as any).code === 'P2002') {
            return NextResponse.json({ success: true, message: 'Order already processed' });
        }

        console.error('Order Confirmation Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
