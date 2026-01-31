'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Capabilities } from "@/components/Capabilities";
import { Partnership } from "@/components/Partnership";
import { Proof } from "@/components/Proof";
import { Philosophy } from "@/components/Philosophy";
import { Contact } from "@/components/Contact";
import { Menu, Search } from "lucide-react";

export default function HeroV2() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <main
            className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-white selection:bg-white selection:text-black group font-sans"
            onMouseMove={handleMouseMove}
        >

            {/* Background Ambience: CLEAN (No Grid) + Subtle Noise + Glow */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none fixed mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-80 pointer-events-none fixed" />

            <motion.div
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
                }}
            />

            {/* Tech Interface Navigation - V2 Layout (Left Hamburger, Right Search) */}
            <nav className="absolute top-0 w-full p-8 flex justify-between items-start z-50">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors cursor-pointer group/search backdrop-blur-md"
                >
                    <Search className="text-white/40 group-hover/search:text-white/70 transition-colors" size={16} />
                    {/* Empty search pill input simulation or just the icon in a long pill as per design? 
              The image shows a long pill. Keeping it simple. */}
                    <div className="w-24 bg-white/5 h-1.5 rounded-full ml-1" />
                </motion.div>
            </nav>

            {/* Hero Content - V2 Clean Glow */}
            <section className="min-h-screen w-full flex flex-col items-center justify-between relative z-20 text-center px-6 pt-32 pb-12">

                {/* UPPER SPACER (Optional, or just let the flex-1 center the content) */}
                <div className="flex-none" />

                {/* CENTERED CONTENT (Title + Tagline) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">

                    {/* GLOWING BRAND TITLE */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white relative z-20 font-sans"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                            textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.2)"
                        }}
                    >
                        ASYMMETRIC.
                    </motion.h1>

                    {/* Tagline */}
                    <motion.h2
                        className="mt-8 text-lg md:text-xl font-normal text-neutral-400 tracking-wide font-sans max-w-lg leading-relaxed mix-blend-plus-lighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        The silent infrastructure behind your loudest wins.
                    </motion.h2>
                </div>

                {/* CTA Button - White Pill (Pinned to Bottom) */}
                <motion.div
                    className="z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button className="px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 hover:scale-105 transition-all duration-300 font-sans text-sm tracking-wide shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                        Start a Conversation
                    </button>
                </motion.div>

            </section>

            {/* Reuse other sections for context */}
            <section className="w-full bg-zinc-50 text-black py-20 rounded-t-[3rem] relative z-20 font-sans">
                <Capabilities />
                <Partnership />
            </section>

            <section className="relative z-10 pt-20 font-sans">
                <Proof />
                <Philosophy />
                <Contact />
            </section>

        </main>
    );
}
