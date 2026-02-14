
import { NextResponse } from 'next/server';
import { saveLead, getLeads } from '@/lib/data';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        saveLead(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const leads = getLeads();
    return NextResponse.json(leads);
}
