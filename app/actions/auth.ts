'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function changePassword(prevState: any, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { message: 'Unauthorized' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { message: 'All fields are required' };
    }

    if (newPassword !== confirmPassword) {
        return { message: 'New passwords do not match' };
    }

    // Get current admin user
    // Assuming single admin for now or get by session email/name if we stored it properly
    // For simplicity, we look up 'admin' or the logged in user's name
    const username = session.user?.name || 'admin';

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return { message: 'User not found' };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
        return { message: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    revalidatePath('/admin');
    return { success: true, message: 'Password updated successfully' };
}
