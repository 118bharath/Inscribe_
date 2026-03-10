import { useSearchParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { searchAll } from "@/features/posts/postService"
import { searchUsers } from "@/features/profile/profileService"
import PostCard from "@/features/posts/components/PostCard"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q") || ""
    const [tab, setTab] = useState<"posts" | "people">("posts")

    const { data: searchData, isLoading: postsLoading } = useQuery({
        queryKey: ["search", query],
        queryFn: () => searchAll(query),
        enabled: !!query && tab === "posts",
        staleTime: 1000 * 60
    })

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ["search-users", query],
        queryFn: () => searchUsers(query),
        enabled: !!query && tab === "people",
        staleTime: 1000 * 60
    })

    if (!query) {
        return <div className="text-center py-20 text-gray-500">Type something to search...</div>
    }

    const isLoading = tab === "posts" ? postsLoading : usersLoading
    const posts = searchData?.content ?? []
    const users = usersData?.content ?? []

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <p className="text-sm text-gray-500 mb-2">Results for</p>
            <h1 className="text-3xl font-serif font-bold mb-6">{query}</h1>

            {/* Tabs */}
            <div className="flex gap-6 border-b mb-8">
                <button
                    onClick={() => setTab("posts")}
                    className={`pb-3 text-sm font-medium transition ${tab === "posts" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                >
                    Stories
                </button>
                <button
                    onClick={() => setTab("people")}
                    className={`pb-3 text-sm font-medium transition ${tab === "people" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                >
                    People
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" />
                </div>
            ) : tab === "posts" ? (
                posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No stories found for "{query}"</div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post: any) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )
            ) : (
                users.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">No people found for "{query}"</div>
                ) : (
                    <div className="space-y-4">
                        {users.map((u: any) => (
                            <Link
                                key={u.id}
                                to={`/u/${u.id}`}
                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium overflow-hidden flex-shrink-0">
                                    {u.avatar ? (
                                        <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        u.name?.charAt(0) || "?"
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{u.name}</p>
                                    {u.bio && <p className="text-sm text-gray-500 truncate">{u.bio}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            )}
        </div>
    )
}
