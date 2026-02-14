'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Loader2, ArrowRight, Brain, CheckCircle } from 'lucide-react';

const QUESTIONS = [
    {
        id: 'data',
        text: "How centralized is your business data?",
        options: [
            { label: "Scattered across spreadsheets & emails", score: 1 },
            { label: "Centralized in a CRM/ERP", score: 3 },
            { label: "Synced via APIs / Data Warehouse", score: 5 }
        ]
    },
    {
        id: 'sops',
        text: "Are your core workflows documented?",
        options: [
            { label: "No, it's all in our heads", score: 1 },
            { label: "Yes, we have written SOPs", score: 3 },
            { label: "Yes, and they are strictly followed", score: 5 }
        ]
    },
    {
        id: 'volume',
        text: "What is your monthly volume of leads/tickets?",
        options: [
            { label: "Low (< 100/mo)", score: 1 },
            { label: "Moderate (100 - 1,000/mo)", score: 3 },
            { label: "High (1,000+/mo)", score: 5 }
        ]
    },
    {
        id: 'tools',
        text: "Do you use automation tools today?",
        options: [
            { label: "None (Manual)", score: 1 },
            { label: "Basic (Zapier/Make)", score: 3 },
            { label: "Custom Scripts / APIs", score: 5 }
        ]
    },
    {
        id: 'budget',
        text: "What is your budget for AI transformation?",
        options: [
            { label: "Exploratory (<$5k)", score: 1 },
            { label: "Serious ($5k - $50k)", score: 3 },
            { label: "Strategic ($50k+)", score: 5 }
        ]
    }
];

export default function ReadinessQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; tier: string } | null>(null);

    const handleAnswer = (score: number) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: score }));
        if (step < QUESTIONS.length - 1) {
            setStep(prev => prev + 1);
        } else {
            setStep(prev => prev + 1); // Move to email gate
        }
    };

    const calculateTier = (total: number) => {
        if (total >= 20) return "AI Native (High Readiness)";
        if (total >= 12) return "Process Ready (Medium Readiness)";
        return "Foundation Needed (Low Readiness)";
    };

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        const tier = calculateTier(totalScore);

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'Readiness Quiz',
                    data: {
                        answers,
                        totalScore,
                        tier
                    }
                })
            });

            // Track event
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({
                    type: 'quiz_complete',
                    metadata: { totalScore, tier }
                })], { type: 'application/json' });
                navigator.sendBeacon('/api/track', blob);
            }

            setResult({ score: totalScore, tier });
        } catch (error) {
            console.error('Failed to save lead', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentQuestion = QUESTIONS[step];
    const isGate = step === QUESTIONS.length;
    const isResult = !!result;

    // structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "AI Readiness Quiz",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Assess your organization's readiness for autonomous AI agents. Get a customized score and implementation roadmap."
    };

    return (
        <SectionWrapper id="readiness-quiz" className="min-h-screen py-32 flex items-center justify-center">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="w-full max-w-2xl mx-auto">
                {/* Progress Bar */}
                {!isResult && (
                    <div className="mb-12">
                        <div className="text-right text-xs text-neutral-500 mb-2 font-mono">
                            {Math.min(step + 1, QUESTIONS.length)} / {QUESTIONS.length}
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden min-h-[400px] flex flex-col justify-center">

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {/* QUESTIONS */}
                        {!isGate && !isResult && (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 relative z-10"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    {currentQuestion.text}
                                </h2>
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(option.score)}
                                            className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-neutral-300 hover:text-white flex justify-between items-center group"
                                        >
                                            {option.label}
                                            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500" size={16} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* EMAIL GATE */}
                        {isGate && !isResult && (
                            <motion.div
                                key="gate"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 relative z-10"
                            >
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Brain className="text-blue-400" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
                                <p className="text-neutral-400">
                                    We&apos;ve calculated your AI Readiness Score. Enter your email to view your personalized report.
                                </p>
                                <form onSubmit={handleUnlock} className="max-w-sm mx-auto space-y-4">
                                    <input
                                        type="email"
                                        required
                                        placeholder="work@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 text-center placeholder:text-neutral-600"
                                    />
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Reveal Score"}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* RESULT */}
                        {isResult && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8 relative z-10"
                            >
                                <div className="inline-block p-12 rounded-full border-4 border-white/10 relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-white/50 border-b-transparent border-l-transparent rotate-45" />
                                    <div className="text-4xl font-bold text-white">{result?.score} <span className="text-lg text-neutral-500 font-normal">/ 25</span></div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{result?.tier}</h3>
                                    <p className="text-neutral-400 max-w-md mx-auto">
                                        {result?.tier.includes("High")
                                            ? "You are ready for autonomous agents. Your infrastructure can support high-leverage AI deployment immediately."
                                            : "You have potential, but need to standardize your data and workflows before scaling with AI."
                                        }
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button onClick={() => window.location.href = '/#contact'} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors">
                                        Book Strategy Call
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-green-500 text-sm">
                                        <CheckCircle size={14} /> Report sent to {email}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </SectionWrapper>
    );
}
