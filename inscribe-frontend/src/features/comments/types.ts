import type { UserProfile } from "@/features/profile/types"

export interface Comment {
    id: number
    content: string
    author: UserProfile
    parentId?: number
    replies: Comment[]
    createdAt: string
}
