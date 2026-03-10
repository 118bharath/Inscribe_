import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import PostCard from "@/features/posts/components/PostCard"
import type { PostPage } from "@/features/posts/types"
import { Loader2, Bookmark } from "lucide-react"

export default function BookmarksPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["bookmarks"],
        queryFn: async () => {
            const res = await api.get<PostPage>("/posts/bookmarks", {
                params: { page: 0, size: 20 }
            })
            return res.data
        }
    })

    const posts = data?.content ?? []

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="flex items-center gap-3 mb-8">
                <Bookmark size={24} />
                <h1 className="text-3xl font-serif font-bold">Your Bookmarks</h1>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <Bookmark size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500">No bookmarks yet</p>
                    <p className="text-gray-400 text-sm mt-1">Save stories to read later</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    )
}
