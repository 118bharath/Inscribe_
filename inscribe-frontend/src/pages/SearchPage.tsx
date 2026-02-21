import { useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { searchPosts } from "@/features/posts/postService"
import PostCard from "@/features/posts/components/PostCard"
import { Loader2 } from "lucide-react"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""

    const { data: posts, isLoading } = useQuery({
        queryKey: ["search", query],
        queryFn: () => searchPosts(query),
        enabled: !!query,
        staleTime: 1000 * 60 // 1 minute
    })

    if (!query) {
        return <div className="text-center py-20 text-gray-500">Type something to search...</div>
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return <div className="text-center py-20 text-gray-500">No results found for "{query}"</div>
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Results for <span className="text-gray-500">"{query}"</span>
            </h1>
            <div className="space-y-8">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
