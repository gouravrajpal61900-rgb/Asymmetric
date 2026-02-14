
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { getPosts } from '@/lib/data';
import { SectionWrapper } from '@/components/SectionWrapper';
import { BlogCTA } from '@/components/BlogCTA';

// Force dynamic because we are reading from file system that changes at runtime (locally)
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    const posts = getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const posts = getPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.image,
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        description: post.excerpt,
    };

    return (
        <article className="min-h-screen pt-24 pb-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SectionWrapper>
                <div className="max-w-3xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Insights
                    </Link>

                    <div className="space-y-6 mb-12">
                        <div className="flex gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-xs uppercase tracking-wider font-bold text-blue-400 border border-blue-400/20 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-neutral-500 border-b border-white/10 pb-8">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {new Date(post.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {post.image && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-3xl mb-12 border border-white/10">
                            <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
                        </div>
                    )}


                    <div className="prose prose-invert prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* CTA */}
                    <BlogCTA />
                </div>
            </SectionWrapper>
        </article>
    );
}
