import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchPostBySlug } from "@/features/posts/postService"
import CommentsSection from "@/features/comments/CommentsSection"
import PostActions from "./components/PostActions"
import PostOwnerActions from "./components/PostOwnerActions"
import { Loader2 } from "lucide-react"

export default function PostDetail() {
    const { slug } = useParams()

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPostBySlug(slug!),
        enabled: !!slug
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (!post) {
        return <div className="text-center py-20">Post not found</div>
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

            <h1 className="text-4xl font-serif font-bold leading-tight">
                {post.title}
            </h1>

            <PostOwnerActions post={post} />

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-lg">
                    {post.author.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()} · {post.readingTime} min read
                    </p>
                </div>
            </div>

            <div
                className="prose prose-lg max-w-none font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex gap-2 mt-8">
                {post.tags?.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        {tag}
                    </span>
                ))}
            </div>

            <PostActions post={post} />

            <CommentsSection postId={post.id} />

        </div>
    )
}
