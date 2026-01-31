'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Bot, User, Clock, CheckCircle2, DollarSign, Send, AlertCircle, X, MessageSquare, Loader2 } from "lucide-react";

// --- Types ---
interface Message {
    id: string;
    sender: 'ai' | 'lead' | 'human';
    content: string;
    timestamp: string;
}

interface Lead {
    id: string;
    name: string;
    address: string;
    source: string;
    timestamp: string;
    status: 'incoming' | 'processing' | 'responded' | 'human_active';
    history: Message[];
}

const MOCK_PROPERTIES = [
    "1200 Brickell Bay Dr, Miami, FL",
    "800 S Pointe Dr, Miami Beach, FL",
    "1717 N Bayshore Dr, Miami, FL",
];

const MOCK_NAMES = ["James Wilson", "Sarah Chen", "Michael Rodriguez", "Emily Thompson"];

export default function ISADashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [stats, setStats] = useState({
        totalLeads: 0,
        avgResponseTime: "0.0s",
        revenueRescued: 0
    });

    // Derived state
    const selectedLead = leads.find(l => l.id === selectedLeadId);

    // --- Handlers ---

    // --- Multi-Turn Scenario Logic ---
    const SCENARIO_STEPS = [
        { delay: 8000, sender: 'ai', content: "Hi Sarah! I'm Alex from the agency. I saw your inquiry on 1200 Brickell Bay Dr via Zillow. Are you looking to book a tour this weekend or would you like the virtual link first?" },
        { delay: 15000, sender: 'lead', content: "Hi Alex. I'm actually in town this Saturday. But does this unit have the bay view? The photos aren't clear." },
        { delay: 24000, sender: 'ai', content: "Yes, it absolutely does! It's a direct East-facing unit with unobstructed bay views. I can send you a video walk-through right now if you want?" },
        { delay: 35000, sender: 'lead', content: "That would be great. Also, what are the HOA fees? I'm trying to stay under $1500/mo." },
        { delay: 42000, sender: 'ai', content: "The HOA is $1,240/mo, so it fits your budget perfectly! It includes cable, internet, and the gym. Shall I lock in 11 AM Saturday for you to see it?" },
        { delay: 50000, sender: 'lead', content: "11 AM works. See you then." }
    ];

    const simulateLead = async () => {
        setIsSimulating(true);
        const newId = Math.random().toString(36).substr(2, 9);
        const prop = "1200 Brickell Bay Dr, Miami, FL";
        const name = "Sarah Chen";
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newLead: Lead = {
            id: newId,
            name: name,
            address: prop,
            source: "Zillow Premier Agent",
            timestamp: time,
            status: 'incoming',
            history: [] // Start empty, wait for ingestion
        };

        setLeads(prev => [newLead, ...prev]);
        setSelectedLeadId(newId);

        // Step 1: Ingestion (Immediate)
        setTimeout(() => {
            setLeads(prev => prev.map(l => l.id === newId ? {
                ...l,
                status: 'processing',
                history: [{
                    id: 'sys-1',
                    sender: 'lead',
                    content: `(Simulated Zillow Form Data Ingested)`,
                    timestamp: time
                }]
            } : l));
        }, 1000);

        // Step 2: Run Scenario
        SCENARIO_STEPS.forEach(step => {
            setTimeout(() => {
                setLeads(prev => prev.map(l => {
                    if (l.id !== newId) return l;
                    return {
                        ...l,
                        status: step.sender === 'ai' ? 'responded' : 'processing',
                        history: [...l.history, {
                            id: `msg-${Date.now()}-${Math.random()}`,
                            sender: step.sender as 'ai' | 'lead',
                            content: step.content,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]
                    };
                }));

                // If it's the last step, stop simulating
                if (step === SCENARIO_STEPS[SCENARIO_STEPS.length - 1]) {
                    setIsSimulating(false);
                    setStats(prev => ({
                        totalLeads: prev.totalLeads + 1,
                        avgResponseTime: "8.4s",
                        revenueRescued: prev.revenueRescued + 12450
                    }));
                }
            }, step.delay);
        });
    };


    const handleManualReply = (text: string) => {
        if (!selectedLeadId) return;

        setLeads(prev => prev.map(l => {
            if (l.id !== selectedLeadId) return l;
            return {
                ...l,
                status: 'human_active',
                history: [...l.history, {
                    id: `human-${Date.now()}`,
                    sender: 'human',
                    content: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]
            };
        }));
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black overflow-hidden flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-20">
                <div className="flex items-center gap-4">
                    <Logo size={32} />
                    <div className="hidden md:block">
                        <h1 className="text-sm font-bold tracking-tight">ISA COMMAND CENTER</h1>
                        <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">V1.0 • LIVE</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-6 mr-6">
                        <MetricSmall label="Revenue Rescued" value={`$${stats.revenueRescued.toLocaleString()}`} />
                        <MetricSmall label="Avg Response" value={stats.avgResponseTime} color="text-green-400" />
                    </div>
                    <button
                        onClick={simulateLead}
                        disabled={isSimulating}
                        className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 text-xs shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        {isSimulating ? <Loader2 className="animate-spin" size={14} /> : <Bot size={14} />}
                        SIMULATE LEAD
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Lead List */}
                <div className={`${selectedLeadId ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] flex-col border-r border-white/10 bg-black/20`}>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Incoming Feed</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {leads.map((lead) => (
                                <LeadListItem
                                    key={lead.id}
                                    lead={lead}
                                    isSelected={lead.id === selectedLeadId}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                />
                            ))}
                            {leads.length === 0 && (
                                <div className="py-20 text-center text-neutral-600 text-sm font-mono">
                                    No active leads.
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Detailed Chat View */}
                <div className={`flex-1 flex flex-col bg-[#0A0A0A] relative transition-all duration-300 ${!selectedLeadId ? 'hidden md:flex opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                    {selectedLead ? (
                        <ChatInterface lead={selectedLead} onManualReply={handleManualReply} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center flex-col text-neutral-600">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p className="font-mono text-sm">Select a lead to inspect conversation state.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

// --- Sub-Components ---

function MetricSmall({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
        </div>
    )
}

function LeadListItem({ lead, isSelected, onClick }: { lead: Lead, isSelected: boolean, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onClick}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group relative overflow-hidden ${isSelected
                ? 'bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-neutral-300'}`}>{lead.name}</span>
                <span className="text-[10px] font-mono text-neutral-600">{lead.timestamp}</span>
            </div>
            <div className="text-xs text-neutral-500 truncate mb-3">{lead.address}</div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
                {lead.status === 'incoming' && <StatusBadge color="text-yellow-500" icon={<Loader2 size={10} className="animate-spin" />} text="Ingesting" />}
                {lead.status === 'processing' && <StatusBadge color="text-blue-400" icon={<Bot size={10} />} text="AI Typing..." />}
                {lead.status === 'responded' && <StatusBadge color="text-green-400" icon={<CheckCircle2 size={10} />} text="AI Responded" />}
                {lead.status === 'human_active' && <StatusBadge color="text-red-400" icon={<User size={10} />} text="Human Override" />}
            </div>
        </motion.div>
    )
}

function StatusBadge({ color, icon, text }: { color: string, icon: any, text: string }) {
    return (
        <div className={`flex items-center gap-1.5 ${color} text-[10px] font-mono uppercase tracking-wide bg-white/[0.02] px-2 py-1 rounded-md`}>
            {icon} {text}
        </div>
    )
}

function ChatInterface({ lead, onManualReply }: { lead: Lead, onManualReply: (t: string) => void }) {
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lead.history]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        onManualReply(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]">
                <div>
                    <h2 className="text-sm font-bold text-white">{lead.name}</h2>
                    <p className="text-xs text-neutral-500">{lead.address}</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-neutral-400 border border-white/5">source: {lead.source}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {lead.history.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'lead' ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed relative group ${msg.sender === 'ai'
                            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                            : msg.sender === 'human'
                                ? 'bg-red-500/10 border border-red-500/20 text-red-100'
                                : 'bg-[#1A1A1A] border border-white/5 text-neutral-300'
                            }`}>
                            {/* Label */}
                            <span className={`absolute -top-3 ${msg.sender === 'lead' ? 'left-4' : 'right-4'} px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest ${msg.sender === 'ai' ? 'bg-blue-500 text-black' : msg.sender === 'human' ? 'bg-red-500 text-black' : 'bg-[#333] text-white'
                                }`}>
                                {msg.sender === 'lead' ? 'Incoming Lead' : msg.sender === 'human' ? 'Broker Override' : 'AI Assistant'}
                            </span>

                            {msg.content}
                        </div>
                        <span className="text-[10px] text-neutral-600 mt-2 font-mono mx-1">{msg.timestamp}</span>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#080808]">
                {lead.status === 'human_active' && (
                    <div className="mb-2 flex items-center gap-2 text-[10px] text-red-400 font-mono uppercase tracking-widest">
                        <AlertCircle size={10} /> AI Paused • Manual Control Active
                    </div>
                )}

                <form onSubmit={handleSend} className="relative">
                    <input
                        className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-neutral-600"
                        placeholder="Type a message to take over (Pauses AI)..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 p-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    )
}
