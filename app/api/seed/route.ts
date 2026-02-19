import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const username = 'admin';
        const password = 'admin123'; // Default password

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
            });
            return NextResponse.json({ message: `User '${username}' created successfully.` });
        } else {
            return NextResponse.json({ message: `User '${username}' already exists.` });
        }
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
