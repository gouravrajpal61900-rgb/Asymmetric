
import { NextResponse } from 'next/server';
import { getUsers, saveUser, User } from '@/lib/auth';

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json({ success: true, user: userWithoutPassword });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { email, password } = body;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
    };

    saveUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword });
}
