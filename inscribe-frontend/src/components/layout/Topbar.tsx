import { Bell, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { useDebounce } from "@/hooks/useDebounce"

export default function Topbar() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [notificationCount, setNotificationCount] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 500)

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`)
        }
    }, [debouncedSearch, navigate])

    useEffect(() => {
        if (!user) return

        const socket = new SockJS("http://localhost:8080/ws")
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${user.id}`, () => {
                    // Assuming message body contains notification details
                    // For now, just increment count
                    setNotificationCount(prev => prev + 1)
                })
            },
        })

        client.activate()

        return () => {
            client.deactivate()
        }
    }, [user])

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

                <button className="text-gray-500 hover:text-black transition-colors relative">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1 rounded-full border border-white min-w-[14px] flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </button>

                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    {user?.name.charAt(0)}
                </div>
            </div>
        </div>
    )
}
