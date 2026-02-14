'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";
import { ArrowUpRight } from "lucide-react";

interface Project {
    name: string;
    tag: string;
    description: string;
    gradient: string;
    link?: string;
    stack: string[];
    metric: string;
}

const projects: Project[] = [
    {
        name: "CommodityOS",
        tag: "Vertical SaaS",
        description: "Mobile operating system for commodity trading.",
        gradient: "from-green-500/20 to-emerald-900/20",
        stack: ["Next.js", "Offline-First"],
        metric: "Deployable"
    },
    {
        name: "Audience OS",
        tag: "Data Sovereignty",
        description: "Algorithm-proof infrastructure. Systematically funnels 'Rented Followers' into an 'Owned Database' (Email/SMS/Wallet) that no platform can ban.",
        gradient: "from-blue-500/20 to-indigo-900/20",
        stack: ["Supabase", "Row Level Security"],
        metric: "Permissionless"
    },
    {
        name: "Stealth Agent",
        tag: "AI Infrastructure",
        description: "Autonomous outreach bots for high-ticket coaching programs.",
        gradient: "from-purple-500/20 to-violet-900/20",
        stack: ["OpenAI", "Puppeteer"],
        metric: "Scalable"
    },
];


function ProjectCard({ project, index }: { project: Project, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // FIX: Lift useMotionTemplate to top level
    const spotlight = useMotionTemplate`
        radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(255,255,255,0.08),
            transparent 40%
        )
    `;

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        if (typeof window !== 'undefined' && window.innerWidth < 768) return;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
            className="group relative h-[500px] rounded-3xl bg-black border border-white/10 hover:border-white/20 overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)]"
        >
            {/* 1. Dynamic Mesh Gradient Background (Subtle) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

            {/* 2. Scanning Grid Effect (The "Wow" Architecture) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%]"
                    animate={{ top: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index }}
                />
            </div>

            {/* 3. Mouse Follow Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"
                style={{ background: spotlight }}
            />

            {/* 4. Active Circuit Border on Hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <span className="absolute top-0 left-0 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-x" />
                <span className="absolute bottom-0 right-0 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-x-reverse" />
            </div>


            {/* Content Layer */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                {/* Header Tags */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <span className="w-fit text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400/80 border border-cyan-500/20 bg-cyan-950/30 px-3 py-1.5 rounded-sm backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                            {project.tag}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Active Asset
                        </span>
                    </div>

                    {project.link && (
                        <div className="bg-white/5 p-3 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                            <ArrowUpRight size={18} />
                        </div>
                    )}
                </div>

                {/* Main Text */}
                <div className="relative">
                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-neutral-400 transition-all duration-300">
                        {project.name}
                    </h3>

                    <p className="text-sm text-neutral-400 mb-8 leading-relaxed max-w-[90%] group-hover:text-neutral-300 transition-colors">
                        {project.description}
                    </p>

                    {/* Footer: Tech & Metric */}
                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {project.stack.map((tech, i) => (
                                <span key={i} className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">{tech}</span>
                            ))}
                        </div>
                        <span className="text-white text-xs font-bold font-mono tracking-widest flex items-center gap-2">
                            {project.metric}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function Proof() {
    return (
        <SectionWrapper id="proof">
            <div className="mb-24 relative">
                {/* Decorative Background for Section Title */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-white/20" />

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 text-center"
                >
                    Proof of <span className="text-neutral-600">Capability.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed"
                >
                    We construct <span className="text-white">Sovereign Assets</span>. While others build landing pages, we engineer valuation-ready infrastructure owned 100% by you.
                </motion.p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </SectionWrapper>
    );
}
