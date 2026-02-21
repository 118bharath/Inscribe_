import api from "@/services/api"
import type { UserProfile } from "./types"
import type { PostPage } from "@/features/posts/types"

export const fetchUserProfile = async (username: string) => {
    const res = await api.get<UserProfile>(`/users/${username}`)
    return res.data
}

export const fetchUserPosts = async (username: string) => {
    const res = await api.get<PostPage>(`/users/${username}/posts`)
    return res.data
}

export const followUser = async (id: number) => {
    const res = await api.post(`/users/${id}/follow`)
    return res.data
}

export const unfollowUser = async (id: number) => {
    const res = await api.delete(`/users/${id}/follow`)
    return res.data
}
