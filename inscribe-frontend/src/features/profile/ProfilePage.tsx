import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "./profileService"
import FollowButton from "./FollowButton"
import UserPosts from "./UserPosts"
import FollowersModal from "./FollowersModal"
import { Loader2, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function ProfilePage() {
    const { userId: userIdParam } = useParams()
    const { user: currentUser } = useAuth()
    const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null)

    const userId = Number(userIdParam)

    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["profile", userId],
        queryFn: () => fetchUserProfile(userId),
        enabled: !isNaN(userId) && userId > 0,
        retry: 2
    })

    if (isNaN(userId) || userId <= 0) return <div className="text-center py-20 text-gray-500">Invalid profile link</div>
    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    if (isError || !user) return (
        <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Could not load this profile. The server may be temporarily unavailable.</p>
            <button onClick={() => refetch()} className="text-green-600 hover:text-green-700 font-medium text-sm">
                Try again
            </button>
        </div>
    )

    const isOwnProfile = currentUser?.id === user.id

    return (
        <div className="max-w-6xl mx-auto flex gap-12 px-6 py-8">

            {/* Main Column */}
            <div className="flex-1 min-w-0">

                <h1 className="text-4xl md:text-5xl font-serif font-medium truncate">
                    {user.name}
                </h1>

                {/* Tabs */}
                <div className="flex gap-8 mt-10 border-b border-gray-200">
                    <button className="pb-4 border-b-2 border-black font-medium text-sm text-gray-900">
                        Home
                    </button>
                    <button className="pb-4 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        About
                    </button>
                </div>

                {/* Posts */}
                <UserPosts userId={userId} />

            </div>

            {/* Right Column */}
            <div className="w-[300px] hidden lg:block border-l border-gray-100 pl-8">

                <div className="sticky top-24 space-y-6">

                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 font-medium overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user.name.charAt(0)
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {user.name}
                        </h2>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <button
                                onClick={() => setFollowModal("followers")}
                                className="hover:text-black transition"
                            >
                                <strong className="text-gray-900">{user.followers}</strong> Followers
                            </button>
                            <button
                                onClick={() => setFollowModal("following")}
                                className="hover:text-black transition"
                            >
                                <strong className="text-gray-900">{user.following}</strong> Following
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        {user.bio || "Writer on Inscribe."}
                    </p>

                    {isOwnProfile ? (
                        <Link
                            to="/settings/profile"
                            className="inline-flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition"
                        >
                            <Settings size={14} />
                            Edit Profile
                        </Link>
                    ) : (
                        <FollowButton user={user} />
                    )}

                </div>

            </div>

            {/* Followers/Following Modal */}
            {followModal && (
                <FollowersModal
                    userId={user.id}
                    mode={followModal}
                    onClose={() => setFollowModal(null)}
                />
            )}

        </div>
    )
}
