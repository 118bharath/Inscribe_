import api from "@/services/api"
import type { UserProfile, FollowUser } from "./types"
import type { PostPage } from "@/features/posts/types"

const fetchUserProfile = async (userId: number) => {
    const res = await api.get<UserProfile>(`/users/${userId}`)
    return res.data
}

const fetchUserPosts = async (userId: number, page: number = 0) => {
    const res = await api.get<PostPage>(`/users/${userId}/posts`, {
        params: { page, size: 10 }
    })
    return res.data
}

const updateProfile = async (data: { name?: string; bio?: string; avatar?: string }) => {
    const res = await api.put<UserProfile>("/users/me", data)
    return res.data
}

const followUser = async (id: number) => {
    const res = await api.post(`/users/${id}/follow`)
    return res.data
}

const unfollowUser = async (id: number) => {
    const res = await api.delete(`/users/${id}/follow`)
    return res.data
}

const fetchFollowers = async (userId: number, limit: number = 100) => {
    const res = await api.get<FollowUser[]>(`/users/${userId}/followers`, {
        params: { limit }
    })
    return res.data
}

const fetchFollowing = async (userId: number, limit: number = 100) => {
    const res = await api.get<FollowUser[]>(`/users/${userId}/following`, {
        params: { limit }
    })
    return res.data
}

const searchUsers = async (keyword: string, page: number = 0, size: number = 10) => {
    const res = await api.get<{ content: UserProfile[] }>("/users/search", {
        params: { keyword, page, size }
    })
    return res.data
}

export { fetchUserProfile, fetchUserPosts, updateProfile, followUser, unfollowUser, fetchFollowers, fetchFollowing, searchUsers }
export default { fetchUserProfile, fetchUserPosts, updateProfile, followUser, unfollowUser, fetchFollowers, fetchFollowing, searchUsers }
