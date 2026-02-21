export interface Author {
    id: number
    name: string
}

export interface Post {
    id: number
    title: string
    excerpt: string
    content: string
    author: Author
    coverImage?: string
    readingTime: number
    createdAt: string
    clapped: boolean
    clapCount: number
    bookmarked: boolean
    slug: string
    tags: string[]
    status: "DRAFT" | "PUBLISHED"
    isAuthor: boolean
}

export interface PostPage {
    content: Post[]
    totalPages: number
}
