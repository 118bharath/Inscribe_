import { useMutation, useQueryClient } from "@tanstack/react-query"
import { followUser, unfollowUser } from "./profileService"
import type { UserProfile } from "./types"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FollowButton({ user }: { user: UserProfile }) {
    const queryClient = useQueryClient()
    const [isHovering, setIsHovering] = useState(false)

    const mutation = useMutation({
        mutationFn: () =>
            user.isFollowing
                ? unfollowUser(user.id)
                : followUser(user.id),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["profile", user.username] })

            queryClient.setQueryData<UserProfile>(["profile", user.username], (old) => {
                if (!old) return old
                return {
                    ...old,
                    isFollowing: !old.isFollowing,
                    followers: old.isFollowing ? old.followers - 1 : old.followers + 1
                }
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", user.username] })
        }
    })

    if (user.isFollowing) {
        return (
            <Button
                onClick={() => mutation.mutate()}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${isHovering
                    ? "bg-red-50 text-red-600 border-red-600"
                    : "bg-white text-green-700 border-green-700 hover:bg-green-50"
                    }`}
                variant="outline"
            >
                {isHovering ? "Unfollow" : "Following"}
            </Button>
        )
    }

    return (
        <Button
            onClick={() => mutation.mutate()}
            className="rounded-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium"
        >
            Follow
        </Button>
    )
}
