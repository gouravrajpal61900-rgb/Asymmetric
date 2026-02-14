
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SectionWrapper } from '@/components/SectionWrapper';
import { Loader2, Plus, BarChart2, FileText, Check, X, User, Download, LogOut } from 'lucide-react';

function AdminContent() {
    const [activeTab, setActiveTab] = useState<'posts' | 'analytics' | 'leads'>('posts');
    const [isLoading, setIsLoading] = useState(false);

    // Data State
    const [posts, setPosts] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        tags: '',
        author: 'Asymmetric Team'
    });

    const fetchPosts = async () => {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setPosts(data);
    };

    const fetchAnalytics = async () => {
        const res = await fetch('/api/track');
        const data = await res.json();
        setAnalytics(data);
    };

    const fetchLeads = async () => {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data);
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await fetch('/api/blog', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim())
                })
            });
            alert('Post Created!');
            setFormData({ title: '', excerpt: '', content: '', image: '', tags: '', author: 'Asymmetric Team' });
            fetchPosts();
        } catch (err) {
            alert('Error creating post');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper: Convert Leads to CSV
    const downloadLeadsCSV = () => {
        const headers = ["ID", "Email", "Source", "Date", "Data"];
        const rows = leads.map(l => [
            l.id, l.email, l.source, new Date(l.timestamp).toISOString(), JSON.stringify(l.data).replace(/,/g, ';') // Escape commas
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper: Get Last 7 Days Traffic
    const getChartData = () => {
        const days = 7;
        const data = new Array(days).fill(0);
        const labels = new Array(days).fill('').map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (days - 1 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        analytics.forEach(e => {
            const date = new Date(e.timestamp);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= days) {
                data[days - diffDays]++;
            }
        });

        const max = Math.max(...data, 1); // Avoid div by zero
        return { data, labels, max };
    };

    const chart = getChartData();

    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Protect Route
        const checkAccess = () => {
            if (!user) {
                router.push('/login');
                return;
            }
            if (user.role !== 'admin') {
                alert('Access Denied: Admins Only');
                router.push('/');
            }
        };
        // Small timeout to allow hydration
        const timer = setTimeout(checkAccess, 100);
        return () => clearTimeout(timer);
    }, [user, router]);

    // ... Data Fetching (Use Effect)
    useEffect(() => {
        if (user?.role === 'admin') {
            fetchPosts();
            fetchAnalytics();
            fetchLeads();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" />
            </div>
        );
    }

    return (
        <SectionWrapper className="min-h-screen py-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Sovereign Command Center</h1>
                        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mt-1">Admin Access • Clearance Level 5</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg flex items-center gap-2 hover:bg-red-900/40">
                            <LogOut size={18} /> Logout
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'posts' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                        >
                            <FileText size={18} /> Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                        >
                            <BarChart2 size={18} /> Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === 'leads' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                        >
                            <User size={18} /> Leads
                        </button>
                    </div>
                </div>

                {activeTab === 'posts' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Editor */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Create New Post</h2>
                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-neutral-500 mb-1">Title</label>
                                    <input
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded p-3 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-500 mb-1">Excerpt</label>
                                    <textarea
                                        value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded p-3 text-white h-20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-neutral-500 mb-1">Content (HTML Supported)</label>
                                    <textarea
                                        value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded p-3 text-white h-60 font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-neutral-500 mb-1">Image URL</label>
                                        <input
                                            value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded p-3 text-white"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-neutral-500 mb-1">Tags (comma sep)</label>
                                        <input
                                            value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded p-3 text-white"
                                            placeholder="AI, Tech, Strategy"
                                        />
                                    </div>
                                </div>
                                <button disabled={isLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                                    {isLoading ? 'Publishing...' : 'Publish Post'}
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Existing Posts ({posts.length})</h2>
                            <div className="space-y-4 max-h-[800px] overflow-y-auto">
                                {posts.map(post => (
                                    <div key={post.id} className="p-4 border border-white/5 rounded-xl bg-black/20 hover:border-white/20 transition-colors">
                                        <h3 className="font-bold text-white">{post.title}</h3>
                                        <div className="flex justify-between text-xs text-neutral-500 mt-2">
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                            <span>{post.slug}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid gap-8">
                        {/* CSS Bar Chart */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Traffic Trends (7 Days)</h2>
                            <div className="h-48 flex items-end gap-2">
                                {chart.data.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-blue-600/50 rounded-t-sm group-hover:bg-blue-500 transition-all relative"
                                            style={{ height: `${(val / chart.max) * 100}%` }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {val}
                                            </div>
                                        </div>
                                        <span className="text-xs text-neutral-500">{chart.labels[i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
                            <h2 className="text-xl font-bold text-white mb-6">Recent Logs ({analytics.length})</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-neutral-400">
                                    <thead className="border-b border-white/10 text-white uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Time</th>
                                            <th className="p-4">Path</th>
                                            <th className="p-4">Event</th>
                                            <th className="p-4">Scroll / Time</th>
                                            <th className="p-4">Device</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {analytics.slice(0, 50).map(event => (
                                            <tr key={event.id} className="hover:bg-white/5">
                                                <td className="p-4">{new Date(event.timestamp).toLocaleString()}</td>
                                                <td className="p-4 text-white font-mono">{event.path}</td>
                                                <td className="p-4">
                                                    {event.type === 'pageview' && <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">PageView</span>}
                                                    {event.type === 'exit' && <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Exit</span>}
                                                    {event.type === 'copy' && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Copy</span>}
                                                </td>
                                                <td className="p-4 font-mono text-xs">
                                                    {event.metadata ? (
                                                        <div className="flex flex-col gap-1">
                                                            {event.metadata.scrollDepth !== undefined && <span>Scroll: {event.metadata.scrollDepth}%</span>}
                                                            {event.metadata.timeOnPage !== undefined && <span>Time: {event.metadata.timeOnPage}s</span>}
                                                            {event.metadata.text && <span className="text-neutral-500 truncate max-w-[100px]">"{event.metadata.text}"</span>}
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td className="p-4 font-mono text-xs">{event.deviceType} • {event.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Lead Database ({leads.length})</h2>
                            <button
                                onClick={downloadLeadsCSV}
                                className="bg-white text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-200"
                            >
                                <Download size={16} /> Export CSV
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-neutral-400">
                                <thead className="border-b border-white/10 text-white uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Source</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Data Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.map(lead => (
                                        <tr key={lead.id} className="hover:bg-white/5">
                                            <td className="p-4">{new Date(lead.timestamp).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs font-bold border border-purple-500/30">
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white font-bold">{lead.email}</td>
                                            <td className="p-4 text-xs">
                                                {lead.source === 'ROI Calculator' && lead.data?.annualSavings && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-green-400 font-bold">
                                                            ${Math.round(Number(lead.data.annualSavings)).toLocaleString()} / yr
                                                        </span>
                                                        <span className="text-neutral-500">
                                                            5yr: ${Math.round(Number(lead.data.fiveYearSavings)).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                                {lead.source === 'Readiness Quiz' && lead.data?.tier && (
                                                    <div className="flex flex-col gap-1">
                                                        <span className={
                                                            lead.data.tier.includes('High') ? 'text-green-400 font-bold' :
                                                                lead.data.tier.includes('Medium') ? 'text-yellow-400 font-bold' :
                                                                    'text-red-400 font-bold'
                                                        }>
                                                            {lead.data.tier}
                                                        </span>
                                                        <span className="text-neutral-500">
                                                            Score: {lead.data.totalScore}/25
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Fallback for other sources */}
                                                {!['ROI Calculator', 'Readiness Quiz'].includes(lead.source) && (
                                                    <span className="font-mono text-neutral-600 break-all">
                                                        {JSON.stringify(lead.data).substring(0, 50)}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SectionWrapper>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-white" />
            </div>
        }>
            <AdminContent />
        </Suspense>
    );
}
