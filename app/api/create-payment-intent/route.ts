import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any, // Use latest or let it default if typed
});

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Calculate total on server side to prevent manipulation
        let total = 0;
        const metadataItems = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: parseInt(item.id) }
            });

            if (!product) {
                console.warn(`Product ${item.id} not found`);
                continue;
            }

            // Simple calculation: Price * Quantity
            // In a real app we might handle different formats/prices logic if complex
            // schema implies 'price' is a single float.
            total += product.price * item.quantity;

            metadataItems.push(`${product.title} (x${item.quantity})`);
        }

        // Create PaymentIntent
        // Amount is in cents/lowest denomination
        const amount = Math.round(total * 100);

        // Minimum Stripe amount is usually ~$0.50
        if (amount < 50) {
            return NextResponse.json({ error: 'Amount too small' }, { status: 400 });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            // Restrict to card only as requested (no Klarna, EPS, etc.)
            payment_method_types: ['card'],
            metadata: {
                summary: metadataItems.join(', ').substring(0, 400) // Stripe metadata limit
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount: total
        });

    } catch (error) {
        console.error('Stripe Error:', error);
        return NextResponse.json(
            { error: 'Error creating payment intent' },
            { status: 500 }
        );
    }
}
