"use client";

import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo = ({ className = "", size = 100 }: LogoProps) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* CENTER GLOW (Re-positioned Lower) */}
            <motion.div
                className="absolute bg-white rounded-full"
                style={{
                    width: "65%",
                    height: "65%",
                    top: "22%",      // Shifted down to hit the bottom bar (Visual Center ~60%)
                    left: "17.5%",   // Centered horizontally (100 - 65) / 2
                    filter: "blur(25px)",
                    zIndex: 0,
                }}
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
                style={{ overflow: "visible" }}
            >
                {/* OUTER FRAME */}
                <path
                    d="M 50 5 L 95 90 L 5 90 Z M 50 32 L 80 82 L 20 82 Z"
                    fill="#FFFFFF"
                    fillRule="evenodd"
                />

                {/* INNER DELTA (Breathing) */}
                <motion.path
                    d="M 50 42 L 72 78 L 28 78 Z"
                    fill="#FFFFFF"
                    style={{
                        originX: "50px",
                        originY: "65px",
                    }}
                    animate={{
                        scale: [0.92, 1.0, 0.92],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </svg>
        </div>
    );
};
