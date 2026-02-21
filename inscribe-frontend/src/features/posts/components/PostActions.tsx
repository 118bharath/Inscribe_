import type { Post } from "@/features/posts/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { clapPost, unclapPost, bookmarkPost, unbookmarkPost } from "@/features/posts/postService"
import { Heart, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PostActions({ post }: { post: Post }) {
    const queryClient = useQueryClient()

    const clapMutation = useMutation({
        mutationFn: () =>
            post.clapped ? unclapPost(post.id) : clapPost(post.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["post", post.slug] })

            // Optimistic update for single post view
            queryClient.setQueryData(["post", post.slug], (old: Post | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    clapped: !old.clapped,
                    clapCount: old.clapped ? old.clapCount - 1 : old.clapCount + 1
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", post.slug] })
        }
    })

    const bookmarkMutation = useMutation({
        mutationFn: () =>
            post.bookmarked ? unbookmarkPost(post.id) : bookmarkPost(post.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["post", post.slug] })

            queryClient.setQueryData(["post", post.slug], (old: Post | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    bookmarked: !old.bookmarked
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["post", post.slug] })
        }
    })

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
    }

    return (
        <div className="flex items-center justify-between border-y py-4 my-8">
            <div className="flex items-center gap-6">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-transparent p-0"
                    onClick={() => clapMutation.mutate()}
                >
                    <Heart
                        className={post.clapped ? "fill-red-500 text-red-500" : "text-gray-500"}
                    />
                    <span>{post.clapCount}</span>
                </Button>

                <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-transparent p-0"
                >
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                        Suggest
                    </div>
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => bookmarkMutation.mutate()}
                >
                    <Bookmark
                        className={post.bookmarked ? "fill-black text-black" : "text-gray-500"}
                    />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                >
                    <Share2 className="text-gray-500" />
                </Button>
            </div>
        </div>
    )
}
