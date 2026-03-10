import { Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { logoutUser } from "@/services/authService"
import { Link, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import NotificationDropdown from "@/features/notifications/NotificationDropdown"

export default function Topbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const debouncedSearch = useDebounce(searchQuery, 500)

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`)
        }
    }, [debouncedSearch, navigate])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await logoutUser()
        logout()
        setShowDropdown(false)
        navigate("/")
    }

    return (
        <div className="h-16 border-b border-gray-200 flex items-center px-6 justify-between bg-white sticky top-0 z-50">

            {/* Left: Logo & Search */}
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-green-600 rounded-tr-xl rounded-bl-xl flex items-center justify-center text-white">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 22l3-3m0 0l3.5-3.5a6 6 0 1 1 8.5 8.5L4 22z" />
                        </svg>
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight group-hover:text-green-800 transition-colors">
                        Inscribe
                    </span>
                </Link>

                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full w-[300px] focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-200 transition-all">
                    <Search size={16} className="text-gray-400" />
                    <input
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none w-full text-sm placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                <Link to="/write" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-medium">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Write
                </Link>

                <NotificationDropdown />

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 text-white flex items-center justify-center text-sm font-medium">
                                {user?.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">@{user?.username || user?.email}</p>
                            </div>
                            <Link
                                to={`/u/${user?.id}`}
                                onClick={() => setShowDropdown(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                Profile
                            </Link>
                            <Link
                                to="/bookmarks"
                                onClick={() => setShowDropdown(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                Bookmarks
                            </Link>
                            <Link
                                to="/analytics"
                                onClick={() => setShowDropdown(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                Stats
                            </Link>
                            <Link
                                to="/settings/profile"
                                onClick={() => setShowDropdown(false)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                                Settings
                            </Link>
                            <hr className="my-1 border-gray-100" />
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
