import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { name, address, source, inquiry } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            // Fallback for demo if API key is missing
            return NextResponse.json({
                message: `Hi ${name}! I'm Alex from the agency. I saw your inquiry on ${address} via ${source}. Are you looking to book a tour this weekend or would you like the virtual link first?`,
                simulated: true
            });
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are 'Alex', an expert ISA (Inside Sales Agent) for a high-end luxury real estate agency in Miami. Your goal is to respond to new leads within 10 seconds. You must sound human, professional, and helpful. Do not mention you are an AI. Keep messages under 160 characters (SMS length). Always end with a question to drive engagement."
                },
                {
                    role: "user",
                    content: `New Lead: ${name}\nSource: ${source}\nProperty: ${address}\nInquiry: ${inquiry}`
                }
            ],
            temperature: 0.7,
        });

        return NextResponse.json({
            message: completion.choices[0].message.content,
            simulated: false
        });

    } catch (error) {
        console.error('ISA API Error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
