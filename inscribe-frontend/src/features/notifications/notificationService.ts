import api from "@/services/api"

export interface Notification {
    id: number
    message: string
    type: "COMMENT" | "FOLLOW" | "CLAP" | "BOOKMARK" | "SYSTEM"
    isRead: boolean
    senderId: number
    senderName: string
    relatedPostId?: number
    createdAt: string
}

export interface NotificationPage {
    content: Notification[]
    totalPages: number
    totalElements: number
}

const fetchNotifications = async (page: number = 0, size: number = 20) => {
    const res = await api.get<NotificationPage>("/notifications", {
        params: { page, size }
    })
    return res.data
}

const fetchUnreadCount = async () => {
    const res = await api.get<number>("/notifications/unread-count")
    return res.data
}

const markAsRead = async (id: number) => {
    await api.put(`/notifications/${id}/read`)
}

const markAllAsRead = async () => {
    await api.put("/notifications/read-all")
}

export { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead }
export default { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead }
