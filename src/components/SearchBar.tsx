
'use client';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // For this v1 with local JSON, we'll actually just use client-side filtering 
    // in the parent component or URL params if we want to be fancy.
    // But strictly, the BlogPage is a Server Component. 
    // So best approach: 
    // 1. Enter search -> Update URL query param ?q=...
    // 2. BlogPage reads searchParams? 
    //    Wait, BlogPage is receiving data from getPosts(). 
    //    We can make BlogPage accept searchParams prop (Server Component feature).

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="relative max-w-md w-full mb-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder="Search insights..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
                onChange={(e) => {
                    router.push('?' + createQueryString('q', e.target.value));
                }}
                defaultValue={searchParams.get('q') ?? ''}
            />
        </div>
    );
}
