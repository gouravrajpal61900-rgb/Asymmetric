'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

class Star {
    x: number;
    y: number;
    size: number;
    twinkleSpeed: number;
    twinklePhase: number;
    opacity: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.1;
        this.twinkleSpeed = Math.random() * 0.03 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.opacity = 0;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const sine = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
        const normalized = (sine + 1) / 2;
        this.opacity = Math.pow(normalized, 5);

        if (this.opacity < 0.03) return;

        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const isMobile = window.innerWidth < 768;
        const starCount = isMobile ? 80 : 200;

        const stars: Star[] = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star(width, height));
        }

        let animationFrameId: number;
        let time = 0;

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);
            time += 1;

            for (let i = 0; i < stars.length; i++) {
                stars[i].draw(ctx, time);
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            stars.length = 0;
            const newCount = window.innerWidth < 768 ? 80 : 200;
            for (let i = 0; i < newCount; i++) {
                stars.push(new Star(width, height));
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
            className="absolute inset-0 pointer-events-none z-0"
        />
    );
}
