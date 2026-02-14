'use client';

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { Bot, Layers, Workflow, Zap } from "lucide-react";

const capabilities = [
    {
        title: "Turnkey SaaS Platforms",
        description: "Deploy a $20k/mo B2B tool under your personal brand in weeks. We handle the code; you handle the launch.",
        icon: Workflow,
    },
    {
        title: "White-Label AI Agents",
        description: "Clone yourself. We train agents on your content to coach your audience 24/7, unlocking high-ticket revenue at scale.",
        icon: Bot,
    },
    {
        title: "Asset Engineering",
        description: "Stop selling hours. Start selling software. We build valuations-ready assets designed for eventual exit.",
        icon: Layers,
    },
    {
        title: "Audience Monetization Engines",
        description: "Automated systems that convert your passive followers into active subscribers. Zero lead leakage, 100% attribution.",
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
                    Product Modules, <span className="text-neutral-500">Not Services.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-neutral-600 text-lg max-w-2xl"
                >
                    We provide the ready-to-deploy infrastructure. You provide the distribution.
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
                        className="group p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:border-black/5 transition-all duration-300"
                    >
                        <div className="mb-6 inline-flex p-3 rounded-2xl bg-black/5 text-black group-hover:bg-black group-hover:text-white transition-colors">
                            <cap.icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-black">{cap.title}</h3>
                        <p className="text-neutral-600 leading-relaxed font-light mb-6">
                            {cap.description}
                        </p>

                        {/* Revenue Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                            Revenue: High Leverage
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
