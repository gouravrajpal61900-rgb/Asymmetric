'use client';

import { motion } from "framer-motion";
import { SectionWrapper } from "../SectionWrapper";

export function Philosophy() {
    return (
        <SectionWrapper id="philosophy" className="text-center">
            <div className="max-w-4xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <p className="text-sm font-mono text-neutral-500 tracking-[0.2em] uppercase mb-8">
                            Our Philosophy
                        </p>
                        <h3 className="text-3xl md:text-5xl font-medium text-white leading-tight font-sans">
                            &quot;True leverage is silent. We build the <span className="text-neutral-500">invisible infrastructure</span>. You take the stage, the credit, and the exit.&quot;
                        </h3>
                    </div>
                </motion.div>

                {/* Pivot Specific Values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16 border-t border-white/10 pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        <h4 className="text-xl font-bold text-white">Ghost Mode.</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            We never post about your project. Our NDAs are ironclad. To the world, you built it yourself.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center md:text-left space-y-2"
                    >
                        <h4 className="text-xl font-bold text-white">Asset Oriented.</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            We don&apos;t build features; we build valuations. Every line of code is written for Due Diligence.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-right md:text-left space-y-2"
                    >
                        <h4 className="text-xl font-bold text-white">Zero Friction.</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            You bring the audience. We bring the engineering, design, and ops.
                        </p>
                    </motion.div>
                </div>
            </div>
        </SectionWrapper>
    );
}
