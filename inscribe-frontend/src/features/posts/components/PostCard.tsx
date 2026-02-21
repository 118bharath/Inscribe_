import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clapPost, unclapPost, bookmarkPost, unbookmarkPost } from "@/features/posts/postService"
import type { Post } from "@/features/posts/types"
import { Heart, Bookmark } from "lucide-react"

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
                                    clapCount: p.clapped
                                        ? p.clapCount - 1
                                        : p.clapCount + 1,
                                }
                                : p
                        ),
                    })),
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
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

    return (
        <div className="border-b pb-8">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <button
                    onClick={() => clapMutation.mutate()}
                    className="flex items-center gap-2 hover:text-black transition-colors"
                >
                    <Heart
                        size={16}
                        fill={post.clapped ? "black" : "none"}
                        className={post.clapped ? "text-black" : ""}
                    />
                    {post.clapCount}
                </button>
                <span>{post.readingTime} min read</span>

                <button
                    onClick={() => bookmarkMutation.mutate()}
                    className="ml-auto hover:text-black transition-colors"
                >
                    <Bookmark
                        size={20}
                        fill={post.bookmarked ? "black" : "none"}
                        className={post.bookmarked ? "text-black" : ""}
                    />
                </button>
            </div>
        </div>
    )
}
