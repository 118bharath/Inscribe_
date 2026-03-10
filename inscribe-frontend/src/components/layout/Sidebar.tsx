import { Home, Bookmark, User, BarChart2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { fetchFollowing } from "@/features/profile/profileService"

export default function Sidebar() {
    const { user } = useAuth()

    const { data: following } = useQuery({
        queryKey: ["sidebar-following", user?.id],
        queryFn: () => fetchFollowing(user!.id, 4),
        enabled: !!user
    })

    const people = following?.slice(0, 4) ?? []

    return (
        <div className="h-full pl-3 pr-5 pt-8 pb-6 flex flex-col">

            <div className="flex flex-col gap-10">
                <nav className="flex flex-col gap-7 text-gray-700">
                    <Link to="/" className="flex items-center gap-4 hover:text-black transition text-[15px] font-medium">
                        <Home size={22} />
                        Home
                    </Link>

                    <Link to="/bookmarks" className="flex items-center gap-4 hover:text-black transition text-[15px] font-medium">
                        <Bookmark size={22} />
                        Library
                    </Link>

                    <Link to={user ? `/u/${user.id}` : "/profile"} className="flex items-center gap-4 hover:text-black transition text-[15px] font-medium">
                        <User size={22} />
                        Profile
                    </Link>

                    <Link to="/analytics" className="flex items-center gap-4 hover:text-black transition text-[15px] font-medium">
                        <BarChart2 size={22} />
                        Stats
                    </Link>
                </nav>

                {/* Following Section */}
                {user && (
                    <div className="border-t pt-8">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-5">
                            Following
                        </h4>

                        {people.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {people.map(person => (
                                    <Link
                                        key={person.id}
                                        to={`/u/${person.id}`}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium overflow-hidden flex-shrink-0">
                                            {person.avatar ? (
                                                <img src={person.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                person.name.charAt(0)
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700 group-hover:text-black transition truncate">
                                            {person.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Find writers and publications to follow.
                            </p>
                        )}

                        <Link
                            to="/search"
                            className="text-sm text-green-600 hover:text-green-700 font-medium mt-4 inline-block transition"
                        >
                            See suggestions
                        </Link>
                    </div>
                )}
            </div>

        </div>
    )
}
