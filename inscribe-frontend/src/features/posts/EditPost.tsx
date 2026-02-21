import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchPost, updatePost } from "@/features/posts/postService"
import Editor from "@/features/editor/Editor"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditPost() {
    const { id } = useParams()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", Number(id)],
        queryFn: () => fetchPost(Number(id)),
        enabled: !!id
    })

    const mutation = useMutation({
        mutationFn: updatePost,
        onSuccess: (data) => {
            toast.success("Story updated successfully")
            queryClient.invalidateQueries({ queryKey: ["post", Number(id)] })
            queryClient.invalidateQueries({ queryKey: ["post", data.slug] })
            navigate(`/post/${data.slug}`)
        },
        onError: () => {
            toast.error("Failed to update story")
        }
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (!post) return <div className="text-center py-20">Post not found</div>

    return (
        <Editor
            initialContent={post.content}
            initialTitle={post.title}
            initialCoverImage={post.coverImage}
            onSave={async (data) => {
                await mutation.mutateAsync({ id: post.id, ...data })
            }}
        />
    )
}
