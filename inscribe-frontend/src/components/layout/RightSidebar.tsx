import { useQuery } from "@tanstack/react-query"
import { fetchStaffPicks } from "@/features/posts/postService"

export default function RightSidebar() {
    const { data: staffPicks } = useQuery({
        queryKey: ["staff-picks"],
        queryFn: fetchStaffPicks,
    })

    return (
        <div className="space-y-8 sticky top-24">
            <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-4">
                    Staff Picks
                </h3>
                <div className="space-y-4">
                    {staffPicks?.map(post => (
                        <div key={post.id} className="cursor-pointer group">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium">
                                    {post.author.name.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-gray-900">{post.author.name}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 group-hover:underline leading-snug">
                                {post.title}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
