'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Capabilities } from "@/components/pivot/Capabilities";
import { Partnership } from "@/components/pivot/Partnership";
import { Proof } from "@/components/pivot/Proof";
import { Philosophy } from "@/components/pivot/Philosophy";
import { Contact } from "@/components/pivot/Contact";
import dynamic from 'next/dynamic';
import { Menu, ArrowRight } from "lucide-react";

// Lazy Load Heavy Background - Critical for FCP (First Contentful Paint)
const HeroBackground = dynamic(() => import('@/components/pivot/HeroBackground').then(mod => mod.HeroBackground), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />
});
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (isMenuOpen && window.scrollY > 50) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMenuOpen]);

    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main
            className="min-h-screen flex flex-col items-center relative overflow-hidden bg-black text-white selection:bg-white selection:text-black group font-sans"
        >

            {/* Background Ambience: CLEAN (No Grid) + Subtle Noise + Glow */}
            <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none fixed mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-80 pointer-events-none fixed" />

            {/* Animated Network Background - Global Fixed */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <HeroBackground />
            </div>

            {/* Tech Interface Navigation - V3 (Hamburger Only) */}
            <nav className="absolute top-0 w-full p-8 flex justify-between items-start z-50 pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto">
                    <AnimatePresence>
                        {!isMenuOpen && (
                            <motion.button
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50, rotate: -90 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <Menu size={24} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Partner Access / Login */}
                <div className="pointer-events-auto">
                    <Link
                        href="/login"
                        className="text-xs font-mono text-neutral-500 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                    >
                        Partner Access
                    </Link>
                </div>
            </nav>

            {/* FULL SCREEN MENU OVERLAY */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop Blur & Dark Gradient Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-md pointer-events-auto"
                        >
                            {/* Left Side Gradient Darkening (Non-Boxy) */}
                            <div className="absolute inset-y-0 left-0 w-full max-w-2xl bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                        </motion.div>

                        {/* Menu Content */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-y-0 left-0 z-50 w-full max-w-md p-16 flex flex-col justify-center pointer-events-none"
                        >
                            <div className="pointer-events-auto">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-10 left-10 text-white/50 hover:text-white transition-colors"
                                >
                                    <Menu size={32} className="rotate-90" />
                                </button>

                                <nav className="flex flex-col gap-5 items-start w-full">
                                    {["Capabilities", "Partnership", "Philosophy", "Tools", "Blog", "Contact"].map((item, index) => {
                                        const isPage = item === 'Blog' || item === 'Tools';
                                        const href = item === 'Blog' ? '/blog' : item === 'Tools' ? '/tools' : null;

                                        return (
                                            <motion.div
                                                key={item}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: 0.1 + index * 0.06, duration: 0.6, ease: "easeOut" }}
                                            >
                                                {isPage ? (
                                                    <Link
                                                        href={href!}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block text-2xl font-light text-neutral-300 hover:text-white transition-all duration-300 hover:tracking-widest tracking-wide"
                                                    >
                                                        {item}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            scrollToSection(item.toLowerCase());
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="block text-2xl font-light text-neutral-300 hover:text-white transition-all duration-300 hover:tracking-widest tracking-wide text-left"
                                                    >
                                                        {item}
                                                    </button>
                                                )}
                                            </motion.div>
                                        );
                                    })}

                                    {/* Auth Link */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="mt-8 pt-8 border-t border-white/10 w-full max-w-[200px]"
                                    >
                                        {user ? (
                                            <div className="flex flex-col gap-3 text-left">
                                                <div className="flex items-center gap-3 opacity-80">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                                        {user.email[0].toUpperCase()}
                                                    </div>
                                                    <p className="text-white text-sm font-medium tracking-wide">{user.email}</p>
                                                </div>

                                                <div className="flex gap-3 mt-1">
                                                    {user.role === 'admin' && (
                                                        <Link
                                                            href="/admin"
                                                            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                                        >
                                                            Dashboard
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="text-xs font-medium text-neutral-500 hover:text-white transition-colors"
                                                    >
                                                        Log out
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href="/login"
                                                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                                            >
                                                Login / Join
                                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        )}
                                    </motion.div>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Hero Content - V2 Clean Glow */}
            <section className="min-h-screen w-full flex flex-col items-center justify-between relative z-20 text-center px-4 md:px-6 pt-20 md:pt-32 pb-12 md:pb-24">

                {/* UPPER SPACER */}
                <div className="flex-none" />

                {/* CENTERED CONTENT (Title + Tagline) */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">

                    {/* GLOWING BRAND TITLE */}
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white relative z-20 font-sans leading-tight"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        style={{
                            textShadow: "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.2)"
                        }}
                    >
                        We Build The Software.<br />
                        <span className="text-neutral-500">You Build The Empire.</span>
                    </motion.h1>


                    {/* Tagline */}
                    <motion.h2
                        className="mt-8 text-lg md:text-xl font-normal text-neutral-400 tracking-wide font-sans max-w-2xl leading-relaxed mix-blend-plus-lighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        The venture studio for creators.
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
                        Apply for Partnership
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
                        VENTURE STUDIO <span className="mx-4 text-neutral-800">•</span>
                        WHITE-LABEL AI <span className="mx-4 text-neutral-800">•</span>
                        EQUITY <span className="mx-4 text-neutral-800">•</span>
                        EXIT
                    </p>
                </motion.div>

            </section>

            {/* TABBED TRANSITION: White overlapping content */}
            <section className="w-full bg-neutral-100 text-black py-20 rounded-t-[3rem] rounded-b-[3rem] relative z-30 -mt-10 mb-[-2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] font-sans">
                <Capabilities />
                <Partnership />
            </section>

            <section className="w-full relative z-10 pt-20 bg-transparent font-sans">
                <Philosophy />
                <Proof />
                <Contact />
            </section>

        </main>
    );
}
