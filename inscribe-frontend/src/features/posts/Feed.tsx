import { useState, useRef, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchPosts } from "./postService"
import PostCard from "./components/PostCard"
import { Loader2 } from "lucide-react"

export default function Feed() {
    const [category, setCategory] = useState<"for-you" | "featured">("for-you")

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["posts", category],
        queryFn: ({ pageParam = 0 }) =>
            fetchPosts(category, pageParam),
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
        <div className="max-w-3xl mx-auto py-8 px-4">

            {/* Tabs */}
            <div className="flex gap-8 border-b mb-8">
                <button
                    onClick={() => setCategory("for-you")}
                    className={`pb-3 text-sm font-medium transition-colors ${category === "for-you"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                        }`}
                >
                    For You
                </button>

                <button
                    onClick={() => setCategory("featured")}
                    className={`pb-3 text-sm font-medium transition-colors ${category === "featured"
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-black"
                        }`}
                >
                    Featured
                </button>
            </div>

            {/* Posts */}
            <div className="space-y-12">
                {isLoading && posts.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-gray-400" />
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
