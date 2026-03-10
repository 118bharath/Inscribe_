import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchPosts, fetchPostsByCategory } from "./postService"
import PostCard from "./components/PostCard"
import { Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"

const CATEGORIES = ["For You", "Technology", "Science", "Programming", "Design", "Business", "Lifestyle"]

export default function Feed() {
    const [category, setCategory] = useState("For You")

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["posts", category],
        queryFn: ({ pageParam = 0 }) =>
            category === "For You"
                ? fetchPosts(pageParam)
                : fetchPostsByCategory(category, pageParam),
        getNextPageParam: (lastPage, pages) =>
            pages.length < lastPage.totalPages ? pages.length : undefined,
        initialPageParam: 0
    })

    const posts = data?.pages.flatMap(p => p.content) ?? []

    const loaderRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            },
            { threshold: 1 }
        )

        if (loaderRef.current) {
            observer.observe(loaderRef.current)
        }

        return () => observer.disconnect()
    }, [hasNextPage, fetchNextPage])

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Category Tabs */}
            <div className="flex gap-6 border-b mb-8 overflow-x-auto scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${category === cat
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div className="space-y-10">
                {isLoading && posts.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg">No stories yet</p>
                        <p className="text-sm mt-1">Check back later or try a different category</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>

            {/* Infinite Loader */}
            <div ref={loaderRef} className="h-10 mt-6 flex justify-center">
                {isFetchingNextPage && <Loader2 className="animate-spin text-gray-400" />}
            </div>
        </div>
    )
}
