'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Realistic Star Colors (Kelvin temperatures approximation)
const STAR_COLORS = [
    "255, 255, 255", // Pure White
    "240, 245, 255", // Blue-White (Hot)
    "255, 255, 255", // Pure White
];

class Star {
    x: number;
    y: number;
    size: number;
    twinkleSpeed: number;
    twinklePhase: number;
    color: string;

    constructor(width: number, height: number, isMobile: boolean) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        // Micro-sizing: 0.1px to 1.5px (Tiny but potent)
        this.size = Math.random() * 1.4 + 0.1;

        // Twinkle Speed
        this.twinkleSpeed = Math.random() * 0.04 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;

        this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    }

    draw(ctx: CanvasRenderingContext2D, time: number, isMobile: boolean) {
        // "Pop" Flicker Logic
        const sine = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        const normalized = (sine + 1) / 2;
        const intensity = Math.pow(normalized, 6);

        const opacity = intensity;

        // Skip drawing if very dim
        if (opacity < 0.05) return;

        // 1. Draw Core (Sharp)
        ctx.fillStyle = `rgba(${this.color}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 2. Heavy Effects (Desktop Only)
        if (!isMobile) {
            // Draw HALO (The "Shine") - ONLY for bright stars
            if (opacity > 0.5) {
                // Intense Glow
                ctx.shadowBlur = this.size * 15; // Massive blur relative to size
                ctx.shadowColor = `rgba(${this.color}, ${opacity})`;

                // Draw again to apply the shadow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2); // Draw smaller core for glow source
                ctx.fill();

                // Reset shadow
                ctx.shadowBlur = 0;
            }

            // 3. Peak Shine "Overexposure" (Double Draw for Super Brightness)
            if (opacity > 0.9) {
                ctx.fillStyle = `rgba(255, 255, 255, 0.8)`; // Pure white overlap
                ctx.shadowBlur = this.size * 25; // Even bigger outer glow
                ctx.shadowColor = `rgba(255, 255, 255, 0.5)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2); // Slightly larger bloom
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
}

export function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Initial check
        let isMobile = window.innerWidth < 768;

        const stars: Star[] = [];

        const initStars = () => {
            stars.length = 0;
            const starCount = isMobile ? 100 : 350; // Drastically reduce for mobile
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star(width, height, isMobile));
            }
        };

        initStars();

        let animationFrameId: number;
        let time = 0;

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);

            time += 1;

            // Global composite operation is expensive on mobile
            if (!isMobile) ctx.globalCompositeOperation = 'screen';

            stars.forEach(star => {
                star.draw(ctx, time, isMobile);
            });

            if (!isMobile) ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            if (canvas) {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                isMobile = window.innerWidth < 768;
                initStars();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
        />
    );
}
