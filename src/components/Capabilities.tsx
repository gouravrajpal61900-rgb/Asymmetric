'use client';

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { Bot, Layers, Workflow, Zap } from "lucide-react";

const capabilities = [
    {
        title: "Automation Systems",
        description: "Replacing manual repetition with silent, error-free code. We orchestrate complex workflows that run while you sleep.",
        icon: Workflow,
    },
    {
        title: "Custom Intelligence",
        description: "AI agents that learn your voice, handle your support, and scale your reach. Not just chat wrappers, but functional logic.",
        icon: Bot,
    },
    {
        title: "Product Engineering",
        description: "From rapid prototype to scalable SaaS. We build assets, not just apps. High-performance, secure, and ready for scale.",
        icon: Layers,
    },
    {
        title: "Sovereign Sales Layers",
        description: "Lead ingestion infrastructure that feels native to your brokerage. We capture, qualify, and convert leads while you sleep.",
        icon: Zap,
    },
];

export function Capabilities() {
    return (
        <SectionWrapper id="capabilities">
            <div className="mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-black"
                >
                    Systems, <span className="text-neutral-500">Not Services.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-neutral-600 text-lg max-w-2xl"
                >
                    We don't sell hours. We sell leverage. Each of our distinct capabilities is designed to compound your output.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {capabilities.map((cap, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:border-black/5 transition-all duration-300"
                    >
                        <div className="mb-6 inline-flex p-3 rounded-2xl bg-black/5 text-black group-hover:bg-black group-hover:text-white transition-colors">
                            <cap.icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-black">{cap.title}</h3>
                        <p className="text-neutral-600 leading-relaxed font-light">
                            {cap.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
