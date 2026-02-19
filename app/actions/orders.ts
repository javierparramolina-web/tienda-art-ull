'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({
            where: { id },
        });
        revalidatePath('/admin/orders');
    } catch (error) {
        console.error('Failed to delete order:', error);
        throw new Error('Failed to delete order');
    }
}

export async function updateOrderStatus(id: string, status: string) {
    try {
        await prisma.order.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/admin/orders');
    } catch (error) {
        console.error('Failed to update order status:', error);
        throw new Error('Failed to update order status');
    }
}
