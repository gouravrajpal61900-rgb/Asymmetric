
'use client';
import { SectionWrapper } from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calculator, Zap, ArrowRight } from 'lucide-react';

const tools = [
    {
        title: "AI ROI Calculator",
        description: "Quantify the specific dollar value of automating your agency workflows. Get a custom savings report.",
        href: "/tools/roi-calculator",
        icon: Calculator,
        color: "bg-blue-500"
    },
    {
        title: "AI Readiness Scorecard",
        description: "Assess your data infrastructure and team capability. Receive a personalized roadmap to autonomy.",
        href: "/tools/readiness-quiz",
        icon: Zap,
        color: "bg-purple-500"
    }
];

export default function ToolsPage() {
    return (
        <SectionWrapper className="min-h-screen py-32">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Free AI Utilities<span className="text-blue-500">.</span></h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                    Powerful frameworks to help you measure value and plan your transition to an autonomous enterprise.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={tool.href} className="group block h-full">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/30 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-6 text-white`}>
                                    <tool.icon size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-neutral-400 mb-8 flex-1">
                                    {tool.description}
                                </p>
                                <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                                    Launch Tool <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
