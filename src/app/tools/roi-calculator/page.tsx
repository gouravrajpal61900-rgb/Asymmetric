'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Loader2, DollarSign, Users, Briefcase, Calculator, ArrowRight, Lock } from 'lucide-react';

export default function ROICalculator() {
    const [employees, setEmployees] = useState(10);
    const [avgSalary, setAvgSalary] = useState(60000);
    const [automationRate, setAutomationRate] = useState(30);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    // Derived Metrics
    const annualCost = employees * avgSalary;
    const annualSavings = annualCost * (automationRate / 100);
    const fiveYearSavings = annualSavings * 5;
    const hoursSaved = employees * 2080 * (automationRate / 100); // 2080 work hours/year

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'ROI Calculator',
                    data: {
                        employees,
                        avgSalary,
                        automationRate,
                        annualSavings,
                        fiveYearSavings
                    }
                })
            });

            // Also track event using Beacon API if available
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({
                    type: 'roi_unlock',
                    metadata: { annualSavings }
                })], { type: 'application/json' });
                navigator.sendBeacon('/api/track', blob);
            }

            setIsUnlocked(true);
        } catch (error) {
            console.error('Failed to save lead', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Efficiency Engine (ROI Calculator)",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Calculate the ROI of replacing manual labor with autonomous AI agents. Estimate annual savings and 5-year leverage."
    };

    return (
        <SectionWrapper id="roi-calculator" className="min-h-screen flex items-center justify-center py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Left: Inputs */}
                <div className="space-y-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Calculator className="text-white" size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white">Efficiency Engine</h1>
                        </div>
                        <p className="text-neutral-400 text-sm">
                            Quantify the value of replacing manual labor with autonomous agents.
                        </p>
                    </div>

                    {/* Slider 1: Employees */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <label className="text-neutral-300 font-medium flex items-center gap-2">
                                <Users size={16} /> Team Size
                            </label>
                            <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">{employees}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="500"
                            value={employees}
                            onChange={(e) => setEmployees(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Slider 2: Salary */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <label className="text-neutral-300 font-medium flex items-center gap-2">
                                <Briefcase size={16} /> Avg. Annual Salary
                            </label>
                            <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">${avgSalary.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="30000"
                            max="200000"
                            step="5000"
                            value={avgSalary}
                            onChange={(e) => setAvgSalary(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>

                    {/* Slider 3: Automation */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <label className="text-neutral-300 font-medium flex items-center gap-2">
                                <ZapIcon /> Automation Potential
                            </label>
                            <span className="text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded">{automationRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="90"
                            value={automationRate}
                            onChange={(e) => setAutomationRate(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <p className="text-xs text-neutral-500">
                            *Industry average for knowledge work is ~30-40%.
                        </p>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="relative bg-black/40 rounded-2xl p-8 flex flex-col justify-center border border-white/5">
                    {/* Blurred Content Overlay for Gate */}
                    <AnimatePresence>
                        {!isUnlocked && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, pointerEvents: "none" }}
                                className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center p-8 text-center rounded-2xl"
                            >
                                <Lock className="text-neutral-400 mb-4" size={32} />
                                <h3 className="text-xl font-bold text-white mb-2">Unlock Detailed Report</h3>
                                <p className="text-neutral-400 text-sm mb-6">
                                    See your 5-year projection and get a customized implementation roadmap.
                                </p>
                                <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4">
                                    <input
                                        type="email"
                                        required
                                        placeholder="work@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Generate Report <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Content */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest mb-2">Projected Annual Savings</p>
                            <motion.div
                                key={annualSavings}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500"
                            >
                                ${Math.round(annualSavings).toLocaleString()}
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-xs text-neutral-500 mb-1">5-Year Leverage</p>
                                <p className="text-xl font-bold text-white">${Math.round(fiveYearSavings).toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                <p className="text-xs text-neutral-500 mb-1">Hours Reclaimed/Yr</p>
                                <p className="text-xl font-bold text-white">{Math.round(hoursSaved).toLocaleString()} h</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-green-500" />
                                Implementation Plan
                            </h4>
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li className="flex gap-2">
                                    <span className="text-green-500">•</span> Automate {Math.round(employees * 0.2)} full-time equivalent roles immediately.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">•</span> Reinvest ${Math.round(annualSavings * 0.2).toLocaleString()} into growth engines.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">•</span> Zero-touch operations for Tier 1 support.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </SectionWrapper>
    );
}

function ZapIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    )
}
