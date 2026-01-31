'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
    posthog.init('phc_13bk4juxSz6u8BGors6Rzy2tlqtWC7R60wxIGqoYKRi', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only', // Optimized for privacy/free tier
        capture_pageview: false // We handle this manually in Next.js 14 if needed, or let auto-capture work
    });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
