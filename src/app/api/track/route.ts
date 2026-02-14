
import { NextResponse } from 'next/server';
import { getAnalytics, trackEvent } from '@/lib/data';

export async function GET() {
    const analytics = getAnalytics();
    return NextResponse.json(analytics);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Extract IP from headers if possible (works in Vercel/proxies)
        // In localhost it might be ::1
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        trackEvent({
            ...body,
            ip,
            userAgent
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
