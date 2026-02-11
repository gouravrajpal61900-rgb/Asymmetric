'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SectionWrapper } from "./SectionWrapper";
import { countryCodes } from "@/lib/countryCodes";

// Zod Schema for Validation
const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    countryCode: z.string().min(1, "Required"),
    phone: z.string().min(5, "Valid phone number required"),
    type: z.enum(["Brokerage Owner", "Team Leader", "Agent", "Other"]),
    url: z.string().optional(),
    budget: z.enum(["<$5k", "$5k-25k", "$25k-100k", "$100k+", "Co-Founder / Equity"]),
    timeline: z.enum(["ASAP", "1-3 Months", "3-6 Months", "Exploratory"]),
    message: z.string().min(10, "Tell us a bit more about your volume (min 10 chars)"),
});

type FormData = z.infer<typeof formSchema>;

export function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "Brokerage Owner"
        }
    });

    const selectedType = watch("type");

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Live Google Script Web App URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiCXtflGgqAwRvTg-sdAb1jYBwLHVwjV9dJ6dBKVVPgyU9AxDH1e18_6Owuvy4F7FQeA/exec';

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // For now, just log to console to prove it works
            console.log("Form Data Sent to Sheet:", data);

            setIsSuccess(true);
            reset();
        } catch (err) {
            console.error(err);
            setError("Transmission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SectionWrapper id="contact" className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        Start a Conversation.
                    </h2>
                    <p className="text-neutral-400">
                        We accept limited partners per quarter. Tell us your current volume.
                    </p>
                </motion.div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="text-green-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Transmission Received.</h3>
                                <p className="text-neutral-400">We will analyze your request and respond within 24 hours.</p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="mt-8 text-sm text-neutral-500 hover:text-white underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >

                                {/* Name & Email Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Name</label>
                                        <input
                                            {...register("name")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                            placeholder="John Doe"
                                            suppressHydrationWarning
                                        />
                                        {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Email</label>
                                        <input
                                            {...register("email")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                            placeholder="john@example.com"
                                            suppressHydrationWarning
                                        />
                                        {errors.email && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
                                    </div>
                                </div>



                                {/* Phone & Identity Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Phone</label>
                                        <div className="relative flex gap-4">
                                            <div className="relative w-[140px] flex-shrink-0">
                                                <input
                                                    {...register("countryCode")}
                                                    type="text"
                                                    placeholder="+1"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-500"
                                                    list="country-codes-list"
                                                    suppressHydrationWarning
                                                />
                                                <datalist id="country-codes-list">
                                                    {countryCodes.map((country) => (
                                                        <option key={country.name} value={country.code}>{country.flag} {country.name}</option>
                                                    ))}
                                                </datalist>

                                            </div>
                                            <input
                                                {...register("phone")}
                                                type="tel"
                                                className="flex-1 min-w-0 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                                placeholder="(555) 000-0000"
                                                suppressHydrationWarning
                                            />
                                        </div>
                                        {errors.countryCode && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> Code required</p>}
                                        {errors.phone && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.phone.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Identity</label>
                                        <select
                                            {...register("type")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                        >
                                            <option value="Brokerage Owner" className="bg-black text-white">Brokerage Owner</option>
                                            <option value="Team Leader" className="bg-black text-white">Team Leader</option>
                                            <option value="Agent" className="bg-black text-white">Agent</option>
                                            <option value="Other" className="bg-black text-white">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic URL Field */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                                        Company Website / Profile
                                    </label>
                                    <input
                                        {...register("url")}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                        placeholder="https://yourbrokerage.com"
                                        suppressHydrationWarning
                                    />
                                </div>

                                {/* Budget & Timeline Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Budget Range</label>
                                        <select
                                            {...register("budget")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                        >
                                            <option value="<$5k" className="bg-black text-white">&lt; $5k</option>
                                            <option value="$5k-25k" className="bg-black text-white">$5k - $25k</option>
                                            <option value="$25k-100k" className="bg-black text-white">$25k - $100k</option>
                                            <option value="$100k+" className="bg-black text-white">$100k+</option>
                                            <option value="Co-Founder / Equity" className="bg-black text-white">Co-Founder / Equity</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Timeline</label>
                                        <select
                                            {...register("timeline")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                                        >
                                            <option value="ASAP" className="bg-black text-white">ASAP</option>
                                            <option value="1-3 Months" className="bg-black text-white">1-3 Months</option>
                                            <option value="3-6 Months" className="bg-black text-white">3-6 Months</option>
                                            <option value="Exploratory" className="bg-black text-white">Exploratory</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Vision</label>
                                    <textarea
                                        {...register("message")}
                                        rows={4}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700 resize-none"
                                        placeholder="Describe the asymmetric leverage you want to build..."
                                    />
                                    {errors.message && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.message.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-bold rounded-xl py-4 hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Start a Conversation"}
                                </button>

                                {error && <p className="text-red-400 text-center text-sm">{error}</p>}

                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </SectionWrapper>
    );
}
