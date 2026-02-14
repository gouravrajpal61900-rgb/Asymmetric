'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { ArrowUpRight } from "lucide-react";

interface Project {
    name: string;
    tag: string;
    description: string;
    gradient: string;
    link?: string;
    stack: string[];
}

const projects: Project[] = [
    {
        name: "Saudabook",
        tag: "Vertical SaaS",
        description: "A complete mobile operating system for commodity trading partnerships. Real-time sync, offline-first.",
        gradient: "from-green-500/20 to-emerald-900/20",
        link: "https://saudabook.vercel.app",
        stack: ["Next.js", "Postgres", "Offline-First"]
    },
    {
        name: "Internal CRM",
        tag: "Operations System",
        description: "How we manage our own chaos. A bespoke lead management and project tracking engine built for speed.",
        gradient: "from-blue-500/20 to-indigo-900/20",
        stack: ["Supabase", "Edge Functions", "Tailwind"]
    },
    {
        name: "Ghost Agents",
        tag: "AI Infrastructure",
        description: "Autonomous agents that handle outreach, qualification, and data enrichment without human oversight.",
        gradient: "from-purple-500/20 to-violet-900/20",
        stack: ["OpenAI", "Puppeteer", "Redis"]
    },
];


function ProjectCard({ project, index }: { project: Project, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const CardContent = () => (
        <>
            <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* SPOTLIGHT EFFECT */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(255,255,255,0.1),
                            transparent 80%
                        )
                    `
                }}
            />

            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                        {project.tag}
                    </span>
                    {project.link && (
                        <div className="bg-white/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <ArrowUpRight size={16} className="text-white" />
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    {project.name}
                </h3>

                <p className="text-sm text-neutral-400 line-clamp-3 mb-6 leading-relaxed">
                    {project.description}
                </p>

                {/* TECH STACK PILLS */}
                <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
        >
            {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    <CardContent />
                </a>
            ) : (
                <div className="block h-full">
                    <CardContent />
                </div>
            )}
        </motion.div>
    );
}

export function Proof() {
    return (
        <SectionWrapper id="proof">
            <div className="mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight mb-12"
                >
                    Built In <span className="text-neutral-500">Public.</span>
                </motion.h2>

                {/* METRICS TICKER */}
                <div className="flex flex-wrap gap-8 md:gap-24 items-baseline border-b border-white/10 pb-12 mb-12">
                    <div className="space-y-2">
                        <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">Zero Operational Friction</p>
                        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Operational Goal</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">Infinite Scalability</p>
                        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Leverage Goal</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">Sovereign Infrastructure</p>
                        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Ownership Goal</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} index={index} />
                ))}
            </div>
        </SectionWrapper>
    );
}
