
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { HeroBackground } from '@/components/pivot/HeroBackground';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = isLogin ? 'POST' : 'PUT';

        try {
            const res = await fetch('/api/auth', {
                method: endpoint,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                login(data.user);
                if (data.user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message || 'Authentication failed');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Something went wrong');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white font-sans selection:bg-cyan-500/30">

            {/* Ambient Background */}
            <div className="fixed inset-0 bg-noise opacity-5 pointer-events-none mix-blend-overlay z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black opacity-80 pointer-events-none z-0" />
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <HeroBackground />
            </div>

            <SectionWrapper className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            {isLogin ? 'Portal Access' : 'Initiate Sequence'}
                        </h1>
                        <p className="text-neutral-500 text-sm font-mono tracking-wide uppercase">
                            {isLogin ? 'Sovereign Command' : 'New Identity'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-mono text-sm"
                                    placeholder="IDENTITY_TOKEN"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-mono text-sm"
                                    placeholder="ACCESS_KEY"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-xs font-mono bg-red-900/10 p-3 rounded-lg border border-red-500/20 text-center">
                                ERROR: {error}
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Authenticate' : 'Initialize'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-neutral-500 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
                        >
                            {isLogin ? '[ Create Identity ]' : '[ Return to Login ]'}
                        </button>
                    </div>
                </motion.div>
            </SectionWrapper>
        </main>
    );
}
