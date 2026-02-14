'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SectionWrapper } from "../SectionWrapper";
import { countryCodes } from "@/lib/countryCodes";
import { CustomSelect } from "../CustomSelect";

// Zod Schema for Validation - PIVOT VERSION
const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    countryCode: z.string().min(1, "Required"),
    phone: z.string().min(5, "Valid phone number required"),

    // Changed from "Type" (Role) to "Partnership Model"
    model: z.enum(["Revenue Share / Equity", "White-Label SaaS", "Custom Enterprise Build", "Exploratory"]),

    url: z.string().optional(),

    // Changed from "Budget" to "Audience Size"
    audience: z.enum(["< 10k Followers", "10k - 100k Followers", "100k - 1M Followers", "1M+ Followers"]),

    timeline: z.enum(["ASAP", "1-3 Months", "3-6 Months", "Exploratory"]),
    message: z.string().min(10, "Tell us a bit more about your vision (min 10 chars)"),
});

type FormData = z.infer<typeof formSchema>;

export function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            model: "Revenue Share / Equity",
            audience: "100k - 1M Followers",
            timeline: "ASAP"
        }
    });

    const selectedModel = watch("model");
    const selectedAudience = watch("audience");
    const selectedTimeline = watch("timeline");

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
                        Looking for a technical partner?
                    </h2>
                    <p className="text-neutral-400">
                        We build software for your audience. Let&apos;s talk about your distribution.
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
                                <h3 className="text-2xl font-bold text-white mb-2">Application Received.</h3>
                                <p className="text-neutral-400">We analyze every potential partnership carefully.</p>
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
                                        />
                                        {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Email</label>
                                        <input
                                            {...register("email")}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
                                    </div>
                                </div>

                                {/* Phone & Model Row */}
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
                                                    list="country-codes-list-pivot"
                                                />
                                                <datalist id="country-codes-list-pivot">
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
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Partnership Model</label>
                                        <CustomSelect
                                            options={[
                                                { value: "Revenue Share / Equity", label: "Revenue Share / Equity" },
                                                { value: "White-Label SaaS", label: "White-Label SaaS" },
                                                { value: "Custom Enterprise Build", label: "Custom Enterprise Build" },
                                                { value: "Exploratory", label: "Exploratory" },
                                            ]}
                                            value={selectedModel}
                                            onChange={(val) => setValue("model", val as FormData['model'])}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic URL Field */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                                        Your Social Profile / Website
                                    </label>
                                    <input
                                        {...register("url")}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700"
                                        placeholder="https://x.com/yourhandle"
                                    />
                                </div>

                                {/* Audience & Timeline Row */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-blue-400 font-bold">Audience Size</label>
                                        <CustomSelect
                                            options={[
                                                { value: "< 10k Followers", label: "< 10k Followers" },
                                                { value: "10k - 100k Followers", label: "10k - 100k Followers" },
                                                { value: "100k - 1M Followers", label: "100k - 1M Followers" },
                                                { value: "1M+ Followers", label: "1M+ Followers" },
                                            ]}
                                            value={selectedAudience}
                                            onChange={(val) => setValue("audience", val as FormData['audience'])}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Timeline</label>
                                        <CustomSelect
                                            options={[
                                                { value: "ASAP", label: "ASAP" },
                                                { value: "1-3 Months", label: "1-3 Months" },
                                                { value: "3-6 Months", label: "3-6 Months" },
                                                { value: "Exploratory", label: "Exploratory" },
                                            ]}
                                            value={selectedTimeline}
                                            onChange={(val) => setValue("timeline", val as FormData['timeline'])}
                                        />
                                    </div>
                                </div>


                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Vision</label>
                                    <textarea
                                        {...register("message")}
                                        rows={4}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-neutral-700 resize-none"
                                        placeholder="Describe the software you want to build for your audience..."
                                    />
                                    {errors.message && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.message.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-bold rounded-xl py-4 hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Apply for Partnership"}
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
