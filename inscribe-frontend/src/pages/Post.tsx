import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchPost } from "@/features/posts/postService"
import { Loader2 } from "lucide-react"
import CommentsSection from "@/features/comments/CommentsSection"
import PostCard from "@/features/posts/components/PostCard"

export default function Post() {
  const { id } = useParams()
  const postId = Number(id)

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId
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
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
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

      <div className="mt-12">
        <PostCard post={post} />
      </div>

      <CommentsSection postId={postId} />
    </div>
  )
}
