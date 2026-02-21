import { useAuth } from "@/context/AuthContext"
import { deletePost } from "@/features/posts/postService"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Post } from "@/features/posts/types"

export default function PostOwnerActions({ post }: { post: Post }) {
    const { user } = useAuth()
    const navigate = useNavigate()

    // Only show if the current user is the author
    // The 'isAuthor' field from backend might be cleaner, but we can also check IDs
    // Assuming post.author.id and user.id are available
    const isAuthor = user?.id === post.author.id || post.isAuthor

    if (!isAuthor) return null

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) return

        try {
            await deletePost(post.id)
            toast.success("Story deleted")
            navigate("/")
        } catch (error) {
            toast.error("Failed to delete story")
            console.error(error)
        }
    }

    return (
        <div className="flex gap-3 mb-6">
            <Button
                variant="outline"
                onClick={() => navigate(`/edit/${post.id}`)}
                className="text-green-600 border-green-600 hover:bg-green-50"
            >
                Edit Story
            </Button>

            <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
                Delete
            </Button>
        </div>
    )
}
