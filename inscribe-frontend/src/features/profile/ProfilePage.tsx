import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "./profileService"
import FollowButton from "./FollowButton"
import UserPosts from "./UserPosts"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
    const { username } = useParams()

    const { data: user, isLoading } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => fetchUserProfile(username!),
        enabled: !!username
    })

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
    if (!user) return <div className="text-center py-20">User not found</div>

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
                        Lists
                    </button>
                    <button className="pb-4 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        About
                    </button>
                </div>

                {/* Posts */}
                <UserPosts username={username!} />

            </div>

            {/* Right Column */}
            <div className="w-[300px] hidden lg:block border-l border-gray-100 pl-8">

                <div className="sticky top-24 space-y-6">

                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-medium">
                        {user.name.charAt(0)}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {user.followers} Followers
                        </p>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                        {user.bio || "Writer on Inscribe."}
                    </p>

                    <FollowButton user={user} />

                </div>

            </div>

        </div>
    )
}
