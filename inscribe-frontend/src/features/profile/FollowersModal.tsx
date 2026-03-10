import { useQuery } from "@tanstack/react-query"
import { fetchFollowers, fetchFollowing } from "./profileService"
import { X, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import type { FollowUser } from "./types"

interface Props {
    userId: number
    mode: "followers" | "following"
    onClose: () => void
}

export default function FollowersModal({ userId, mode, onClose }: Props) {
    const { data: users, isLoading } = useQuery({
        queryKey: [mode, userId],
        queryFn: () => mode === "followers" ? fetchFollowers(userId) : fetchFollowing(userId)
    })

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div
                className="bg-white rounded-lg w-full max-w-md max-h-[70vh] flex flex-col shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="font-semibold text-lg capitalize">{mode}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-gray-400" />
                        </div>
                    ) : !users || users.length === 0 ? (
                        <p className="text-center py-10 text-gray-400 text-sm">
                            No {mode} yet
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {users.map((u: FollowUser) => (
                                <Link
                                    key={u.id}
                                    to={`/u/${u.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden flex-shrink-0">
                                        {u.avatar ? (
                                            <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            u.name.charAt(0)
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{u.name}</p>
                                        {u.bio && <p className="text-xs text-gray-500 truncate">{u.bio}</p>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
