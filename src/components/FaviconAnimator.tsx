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
            const progress = (time - startTimeRef.current) / 800; // 0.8s duration

            // Value oscillates between 0 and 1
            const value = 0.5 + 0.5 * Math.sin(progress * 2 * Math.PI);

            // Intense pulsing parameters
            const scale = 1 + (0.3 * value);
            const opacity = 0.5 + (0.5 * value);
            const strokeWidth = 2 + (8 * value);

            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const color = isDark ? 'white' : 'black';

            const svg = `
                <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="${3 + 2 * value}" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <g transform="translate(32, 32) scale(${scale}) translate(-32, -32)">
                         <path d="M32 8 L56 56 L8 56 Z" fill="none" stroke="${color}" stroke-width="${strokeWidth}" filter="url(#glow)" opacity="${opacity}" />
                         <path d="M32 24 L44 48 L20 48 Z" fill="${color}" filter="url(#glow)" opacity="${1 - value}" />
                    </g>
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
