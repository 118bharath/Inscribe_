export interface UserProfile {
    id: number
    name: string
    username: string
    bio: string
    followers: number
    following: number
    isFollowing: boolean
    role: "USER" | "ADMIN"
}
