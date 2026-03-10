import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clapPost, unclapPost, bookmarkPost, unbookmarkPost } from "@/features/posts/postService"
import type { Post } from "@/features/posts/types"
import { Heart, Bookmark } from "lucide-react"
import { Link } from "react-router-dom"

export default function PostCard({ post }: { post: Post }) {
    const queryClient = useQueryClient()

    const clapMutation = useMutation({
        mutationFn: () =>
            post.clapped
                ? unclapPost(post.id)
                : clapPost(post.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["posts"] })
            queryClient.setQueryData<any>(["posts"], (old: any) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        content: page.content.map((p: Post) =>
                            p.id === post.id
                                ? {
                                    ...p,
                                    clapped: !p.clapped,
                                    clapCount: p.clapped ? p.clapCount - 1 : p.clapCount + 1,
                                }
                                : p
                        ),
                    })),
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }
    })

    const bookmarkMutation = useMutation({
        mutationFn: () =>
            post.bookmarked
                ? unbookmarkPost(post.id)
                : bookmarkPost(post.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["posts"] })
            queryClient.setQueryData<any>(["posts"], (old: any) => {
                if (!old) return old
                return {
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        content: page.content.map((p: Post) =>
                            p.id === post.id
                                ? { ...p, bookmarked: !p.bookmarked }
                                : p
                        ),
                    })),
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        }
    })

    const coverImg = post.imageUrl || post.coverImage

    return (
        <div className="border-b pb-8">
            <Link to={`/post/${post.slug}`} className="block group">
                <div className="flex gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">
                                {post.author.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-700">{post.author.name}</span>
                            {post.category && (
                                <>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-xs text-gray-500">{post.category}</span>
                                </>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition line-clamp-2">
                            {post.title}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm line-clamp-2">{post.excerpt}</p>
                    </div>
                    {coverImg && (
                        <img
                            src={coverImg}
                            alt=""
                            className="w-28 h-28 object-cover rounded-md flex-shrink-0"
                        />
                    )}
                </div>
            </Link>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span>{post.readingTime} min read</span>
                <button
                    onClick={() => clapMutation.mutate()}
                    className="flex items-center gap-1 hover:text-black transition-colors ml-auto"
                >
                    <Heart
                        size={16}
                        fill={post.clapped ? "currentColor" : "none"}
                        className={post.clapped ? "text-red-500" : ""}
                    />
                    {post.clapCount > 0 && <span>{post.clapCount}</span>}
                </button>
                <button
                    onClick={() => bookmarkMutation.mutate()}
                    className="hover:text-black transition-colors"
                >
                    <Bookmark
                        size={16}
                        fill={post.bookmarked ? "currentColor" : "none"}
                        className={post.bookmarked ? "text-black" : ""}
                    />
                </button>
            </div>
        </div>
    )
}
