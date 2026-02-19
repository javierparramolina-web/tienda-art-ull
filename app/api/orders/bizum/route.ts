import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendBizumOrderEmails } from '@/lib/email';
import { z } from 'zod';

const OrderSchema = z.object({
    items: z.array(z.object({
        id: z.union([z.number(), z.string().transform((val) => Number(val))]),
        title: z.string(),
        price: z.number(),
        format: z.string(),
    })),
    total: z.number(),
    email: z.string().email(),
    customerName: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
    phone: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, total, email, customerName, address, city, zipCode, phone } = OrderSchema.parse(body);

        // Create Order in DB
        const order = await prisma.order.create({
            data: {
                total,
                status: 'PENDING_BIZUM',
                items: JSON.stringify(items),
                customerEmail: email,
                customerName,
                address,
                city,
                zipCode,
                phone,
            },
        });

        // Format items for email
        const itemsList = items
            .map((item) => `- ${item.title} (${item.format}): ${item.price}€`)
            .join('\n');

        // Send Emails (Soft Fail)
        try {
            await sendBizumOrderEmails(order.id, email, itemsList, total);
        } catch (emailError) {
            console.error('Failed to send emails:', emailError);
            // We continue even if email fails, so we don't lose the order
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Bizum Order Error:', error);
        return NextResponse.json(
            { message: 'Failed to process Bizum request' },
            { status: 500 }
        );
    }
}
