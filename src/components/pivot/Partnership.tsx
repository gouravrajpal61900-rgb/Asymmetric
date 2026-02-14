'use client';

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { Handshake, ShieldCheck, TrendingUp } from "lucide-react";

export function Partnership() {
    return (
        <SectionWrapper id="partnership" className="">
            <div className="flex flex-col md:flex-row gap-16 items-center">

                {/* Left: Copy */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-blue-600 font-mono text-xs tracking-wider uppercase mb-4 block">
                            Venture Studio Model
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-black">
                            You Own the Distribution. <br />
                            <span className="text-neutral-500">We Build the Equity.</span>
                        </h2>
                        <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
                            Stop promoting other people&apos;s products. We build <b>your</b> software company.
                            We act as your technical co-founder, handling everything from code to cloud.
                        </p>

                        <ul className="space-y-4">
                            {[
                                { icon: ShieldCheck, text: "Due-Diligence Ready Codebase (Clean IP)" },
                                { icon: Handshake, text: "50/50 Revenue Share or Equity Deals" },
                                { icon: TrendingUp, text: "Built specifically for Valuation & Exit" },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-700">
                                    <item.icon size={20} className="text-blue-600" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Right: Premium Dashboard Visual */}
                <div className="flex-1 w-full flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-sm"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" />

                        {/* Card Container - SYSTEM HEALTH */}
                        <div className="relative z-10 bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-zinc-50/50">
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Valuation</div>
                                    <div className="text-2xl font-bold text-black font-mono tracking-tight">Owned By You</div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="text-green-600" size={16} />
                                </div>
                            </div>

                            {/* Chart Area Simulation - Pulse Graph */}
                            <div className="p-6 relative h-40 flex items-end justify-between gap-1">
                                {/* Simulated System Load / Activity */}
                                {[20, 35, 40, 45, 50, 60, 75, 80, 90, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: "20%" }}
                                        animate={{
                                            height: [`${h}%`, `${h - 5}%`, `${h}%`],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                        className="w-full bg-blue-600 rounded-t-sm"
                                    />
                                ))}
                            </div>

                            {/* Footer Stats */}
                            <div className="p-4 bg-zinc-50 border-t border-neutral-100 flex justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-neutral-600 font-medium">Cap Table: 100% Yours</span>
                                </div>
                                <span className="text-neutral-400 font-mono">Dilution: 0%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </SectionWrapper>
    );
}
