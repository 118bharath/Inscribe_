import { useParams, Navigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchPost } from "@/features/posts/postService"
import { Loader2 } from "lucide-react"

/**
 * Intermediate route that loads a post by numeric ID,
 * then redirects to the canonical slug-based URL.
 * Used by notification links which only have relatedPostId.
 */
export default function PostDetailById() {
    const { id } = useParams()

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["post", Number(id)],
        queryFn: () => fetchPost(Number(id)),
        enabled: !!id
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (isError || !post) {
        return <div className="text-center py-20">Post not found</div>
    }

    return <Navigate to={`/post/${post.slug}`} replace />
}
