import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchPostsByTag } from "@/features/posts/postService"
import PostCard from "@/features/posts/components/PostCard"
import { Loader2 } from "lucide-react"

export default function TagPage() {
    const { tagName } = useParams()

    const { data: posts, isLoading } = useQuery({
        queryKey: ["tag", tagName],
        queryFn: () => fetchPostsByTag(tagName!),
        enabled: !!tagName
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (!posts || posts.length === 0) {
        return <div className="text-center py-20 text-gray-500">No stories found with tag matching #{tagName}</div>
    }

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="text-gray-400">#</span>
                {tagName}
            </h1>
            <div className="space-y-8">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}
