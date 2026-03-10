export interface Author {
    id: number
    name: string
    username?: string
    avatar?: string
}

export interface Post {
    id: number
    title: string
    excerpt: string
    content: string
    author: Author
    coverImage?: string
    imageUrl?: string
    readingTime: number
    createdAt: string
    clapped: boolean
    clapCount: number
    bookmarked: boolean
    bookmarkCount: number
    slug: string
    tags: string[]
    status: "DRAFT" | "PUBLISHED"
    category?: string
    staffPick?: boolean
    isAuthor: boolean
}

export interface PostPage {
    content: Post[]
    totalPages: number
    totalElements?: number
}
