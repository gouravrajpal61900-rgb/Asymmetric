
import { NextResponse } from 'next/server';
import { getPosts, savePost, BlogPost } from '@/lib/data';

export async function GET() {
    const posts = getPosts();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation
        if (!body.title || !body.content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const newPost: BlogPost = {
            id: Math.random().toString(36).substr(2, 9),
            slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            date: new Date().toISOString(),
            ...body
        };

        savePost(newPost);
        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
