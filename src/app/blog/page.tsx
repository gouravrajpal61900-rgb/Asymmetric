
import { SectionWrapper } from "@/components/SectionWrapper";
import { getPosts } from "@/lib/data";
import { BlogCard } from "@/components/BlogCard";
import { SearchBar } from "@/components/SearchBar";

// Force dynamic rendering so new posts appear without rebuild
export const dynamic = 'force-dynamic';

export default function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
    const allPosts = getPosts();
    const query = searchParams.q?.toLowerCase() || '';

    const posts = query
        ? allPosts.filter(p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query))
        : allPosts;

    return (
        <SectionWrapper className="min-h-screen py-24">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Insights & Updates</h1>
                    <p className="text-neutral-400 text-xl max-w-2xl">
                        Deep dives into AI infrastructure, agency automation, and the future of work.
                    </p>
                </div>

                <SearchBar />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-3xl">
                            <p className="text-neutral-500">No posts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </SectionWrapper>
    );
}
