import { useQuery } from "@tanstack/react-query"
import { fetchUserPosts } from "./profileService"
import PostCard from "@/features/posts/components/PostCard"
import { Loader2 } from "lucide-react"

export default function UserPosts({ username }: { username: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ["user-posts", username],
        queryFn: () => fetchUserPosts(username),
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        )
    }

    if (!data?.content?.length) {
        return (
            <div className="py-10 text-gray-500">
                This user hasn't published any stories yet.
            </div>
        )
    }

    return (
        <div className="space-y-8 mt-8">
            {data.content.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}
