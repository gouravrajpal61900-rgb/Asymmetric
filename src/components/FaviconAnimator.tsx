'use client';

import { useEffect, useRef } from 'react';

export function FaviconAnimator() {
    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        // Find existing icon or create new one
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/svg+xml';

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = (time - startTimeRef.current) / 2000; // 2s duration

            // Value oscillates between 0 and 1
            const value = 0.5 + 0.5 * Math.sin(progress * 2 * Math.PI);

            // Opacity: 0.4 to 1.0
            const opacity = 0.4 + (0.6 * value);

            // Stroke Width: 4 to 6
            const strokeWidth = 4 + (2 * value);

            // Inner Opacity: 1 to 0.3 (Inverse)
            const innerOpacity = 1 - (0.7 * value);

            // Theme Detection
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const color = isDark ? 'white' : 'black';

            const svg = `
                <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <path d="M32 8 L56 56 L8 56 Z" fill="none" stroke="${color}" stroke-width="${strokeWidth}" filter="url(#glow)" opacity="${opacity}" />
                    <path d="M32 24 L44 48 L20 48 Z" fill="${color}" filter="url(#glow)" opacity="${innerOpacity}" />
                </svg>
            `;

            const encoded = 'data:image/svg+xml;base64,' + btoa(svg);
            link.href = encoded;

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return null;
}
