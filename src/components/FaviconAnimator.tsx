'use client';

import { useEffect, useRef } from 'react';

export function FaviconAnimator() {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        // Set a static favicon instead of running requestAnimationFrame infinitely
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/svg+xml';

        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const color = isDark ? 'white' : 'black';

        const svg = `
            <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <path d="M32 8 L56 56 L8 56 Z" fill="none" stroke="${color}" stroke-width="4" filter="url(#glow)" opacity="0.9" />
                <path d="M32 24 L44 48 L20 48 Z" fill="${color}" filter="url(#glow)" opacity="0.6" />
            </svg>
        `;

        const encoded = 'data:image/svg+xml;base64,' + btoa(svg);
        link.href = encoded;
    }, []);

    return null;
}
