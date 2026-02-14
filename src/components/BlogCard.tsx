
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPost } from '@/lib/data';

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                {/* Image/Gradient Area */}
                <div className="h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50 relative p-6 flex flex-col justify-end">
                    {post.image ? (
                        <Image src={post.image} alt={post.title} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    ) : null}
                    <div className="relative z-10">
                        <div className="flex gap-2 mb-2">
                            {post.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-yellow-500/90 text-black px-2 py-1 rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-xs text-neutral-500">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center">
                                <User size={12} />
                            </div>
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>5 min read</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
