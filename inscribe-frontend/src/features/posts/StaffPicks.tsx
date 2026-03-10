import { useQuery } from "@tanstack/react-query"
import { fetchStaffPicks } from "./postService"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function StaffPicks() {
    const { data, isLoading } = useQuery({
        queryKey: ["staff-picks"],
        queryFn: () => fetchStaffPicks(0, 5)
    })

    const posts = data?.content ?? []

    return (
        <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">
                Staff Picks
            </h3>

            {isLoading ? (
                <div className="py-4">
                    <Loader2 className="animate-spin text-gray-300 mx-auto" size={16} />
                </div>
            ) : posts.length === 0 ? (
                <p className="text-sm text-gray-400">No staff picks yet.</p>
            ) : (
                <div className="space-y-5">
                    {posts.map(post => (
                        <Link
                            key={post.id}
                            to={`/post/${post.slug}`}
                            className="block group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">
                                    {post.author.name.charAt(0)}
                                </div>
                                <span className="text-xs text-gray-600">{post.author.name}</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-gray-600 transition line-clamp-2 leading-snug">
                                {post.title}
                            </h4>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

