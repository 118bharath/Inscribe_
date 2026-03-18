import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } from "./notificationService"
import type { Notification } from "./notificationService"
import { Bell, Check, CheckCheck } from "lucide-react"
import { Link } from "react-router-dom"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import { useAuth } from "@/context/AuthContext"

export default function NotificationDropdown() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: fetchUnreadCount,
        refetchInterval: 30000
    })

    const { data: notifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => fetchNotifications(0, 20),
        enabled: open
    })

    const markReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] })
        }
    })

    const markAllMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] })
        }
    })

    // WebSocket for real-time
    useEffect(() => {
        if (!user) return

        const token = sessionStorage.getItem("accessToken")
        const socket = new SockJS(`${import.meta.env.VITE_API_URL || ""}/ws`)
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/user/queue/notifications", (message) => {
                    const notification: Notification = JSON.parse(message.body)
                    queryClient.setQueryData<number>(["notifications", "unread-count"], (old) => (old ?? 0) + 1)
                    queryClient.invalidateQueries({ queryKey: ["notifications"] })
                    console.log("New notification:", notification)
                })
            },
        })

        client.activate()
        return () => { client.deactivate() }
    }, [user, queryClient])

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const items = notifications?.content ?? []

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-500 hover:text-black transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1 rounded-full border border-white min-w-[14px] flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[480px] flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {items.some(n => !n.isRead) && (
                            <button
                                onClick={() => markAllMutation.mutate()}
                                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {items.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            items.map(n => (
                                <div
                                    key={n.id}
                                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.isRead ? "bg-green-50/50" : ""}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                        {n.senderName?.charAt(0) || "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {n.relatedPostId ? (
                                            <Link
                                                to={`/post/id/${n.relatedPostId}`}
                                                onClick={() => setOpen(false)}
                                                className="text-sm text-gray-700 hover:text-black block"
                                            >
                                                {n.message}
                                            </Link>
                                        ) : (
                                            <p className="text-sm text-gray-700">{n.message}</p>
                                        )}
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markReadMutation.mutate(n.id)}
                                            className="text-gray-400 hover:text-green-600 transition flex-shrink-0 mt-1"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
