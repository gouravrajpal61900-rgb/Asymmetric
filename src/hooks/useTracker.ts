
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TrackEventData {
    type: string;
    metadata?: Record<string, unknown>;
}

export function useTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTime = useRef(0);
    const maxScroll = useRef(0);

    useEffect(() => {
        // Reset metrics on path change
        startTime.current = Date.now();
        maxScroll.current = 0;

        // Basic details
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';
        const referrer = document.referrer || 'Direct';

        // Helper to send data (Beacon for exit, Fetch for events)
        const track = (data: TrackEventData) => {
            const payload = JSON.stringify({
                path: pathname,
                referrer,
                deviceType,
                ...data
            });

            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/track', payload);
            } else {
                fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true
                }).catch(e => console.error('Track error', e));
            }
        };

        // Scroll Tracker
        const handleScroll = () => {
            const percent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (percent > maxScroll.current) maxScroll.current = percent;
        };

        // Copy Tracker (Intent Signal)
        const handleCopy = () => {
            const selection = window.getSelection()?.toString();
            if (selection && selection.length > 5) {
                track({
                    type: 'copy',
                    metadata: { text: selection.substring(0, 50) } // Truncate for privacy/size
                });
            }
        };

        // Initial Page View
        track({ type: 'pageview' });

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('copy', handleCopy);

        // Track Exit / Page Unload
        const handleUnload = () => {
            const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
            track({
                type: 'exit',
                metadata: {
                    timeOnPage: timeSpent,
                    scrollDepth: maxScroll.current
                }
            });
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('copy', handleCopy);
            window.removeEventListener('beforeunload', handleUnload);
            // Also capture component unmount as exit (SPA navigation)
            handleUnload();
        };
    }, [pathname, searchParams]);
}
