'use client';

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from "framer-motion";
import { Capabilities } from "@/components/Capabilities";
import { Partnership } from "@/components/Partnership";
import { Proof } from "@/components/Proof";
import { Contact } from "@/components/Contact";
import { Menu, Search } from "lucide-react";



export default function HeroV3() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

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

            {/* Tech Interface Navigation - V3 (Hamburger Only) */}
            <nav className="absolute top-0 w-full p-8 flex justify-between items-start z-50 pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </motion.button>
                </div>
            </nav>

            {/* FULL SCREEN MENU OVERLAY */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center pointer-events-auto"
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-8 left-8 p-2 text-white/70 hover:text-white transition-colors"
                        >
                            <Menu size={24} className="rotate-90" />
                        </button>

                        <nav className="flex flex-col items-center gap-8">
                            {["Capabilities", "Partnership", "Philosophy", "Contact"].map((item, index) => (
                                <motion.button
                                    key={item}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-400 hover:text-white transition-colors"
                                >
                                    {item}
                                </motion.button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Content - V2 Clean Glow */}
            <section className="min-h-screen w-full flex flex-col items-center justify-between relative z-20 text-center px-6 pt-32 pb-24">

                {/* UPPER SPACER */}
                <div className="flex-none" />

                {/* CENTERED CONTENT (Title + Tagline) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">


                    {/* GLOWING BRAND TITLE */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white relative z-20 font-sans"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
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

                {/* CTA Button - White Pill (Floating above ticker) */}
                <motion.div
                    className="z-20 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-neutral-200 hover:scale-105 transition-all duration-300 font-sans text-sm tracking-wide shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    >
                        Start a Conversation
                    </button>
                </motion.div>

                {/* V3: CONTEXT TICKER at Bottom */}
                <motion.div
                    className="absolute bottom-0 w-full py-6 border-t border-white/5 bg-black/40 backdrop-blur-sm flex justify-center items-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    <p className="text-xs md:text-sm font-mono text-neutral-600 tracking-[0.2em] uppercase">
                        AUTOMATION <span className="mx-4 text-neutral-800">•</span>
                        INTELLIGENCE <span className="mx-4 text-neutral-800">•</span>
                        SCALE <span className="mx-4 text-neutral-800">•</span>
                        EQUITY
                    </p>
                </motion.div>

            </section>

            {/* TABBED TRANSITION: White overlapping content */}
            <section className="w-full bg-neutral-100 text-black py-20 rounded-t-[3rem] rounded-b-[3rem] relative z-30 -mt-10 mb-[-2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] font-sans">
                <Capabilities />
                <Partnership />
            </section>

            <section className="relative z-10 pt-20 bg-black font-sans">
                <Proof />
                <Contact />
            </section>

        </main>
    );
}
