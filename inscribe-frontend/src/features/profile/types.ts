export interface UserProfile {
    id: number
    name: string
    username: string
    bio: string
    avatar?: string
    email?: string
    followers: number
    following: number
    isFollowing: boolean
    role: "USER" | "ADMIN"
}

export interface FollowUser {
    id: number
    name: string
    username: string
    avatar?: string
    bio?: string
}
