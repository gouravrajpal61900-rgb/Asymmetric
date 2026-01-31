'use client';

import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";

export function Philosophy() {
    return (
        <SectionWrapper id="philosophy" className="text-center">
            <div className="max-w-3xl mx-auto space-y-12">
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
                            "True leverage is silent. We build the <span className="text-neutral-500">invisible infrastructure</span> that turns audience attention into owned assets. No friction. No noise. Just scale."
                        </h3>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"
                />
            </div>
        </SectionWrapper>
    );
}
