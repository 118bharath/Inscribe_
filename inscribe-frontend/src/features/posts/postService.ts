import api from "@/services/api"
import type { PostPage, Post } from "./types"

export const fetchPosts = async (category: "for-you" | "featured", page: number) => {
    const res = await api.get<PostPage>("/posts", {
        params: { category, page, size: 10 }
    })
    return res.data
}

export const clapPost = async (id: number) => {
    const res = await api.post(`/posts/${id}/clap`)
    return res.data
}

export const unclapPost = async (id: number) => {
    const res = await api.delete(`/posts/${id}/clap`)
    return res.data
}

export const fetchStaffPicks = async () => {
    const res = await api.get<Post[]>("/posts/staff-picks")
    return res.data
}

export const bookmarkPost = async (id: number) => {
    const res = await api.post(`/posts/${id}/bookmark`)
    return res.data
}

export const unbookmarkPost = async (id: number) => {
    const res = await api.delete(`/posts/${id}/bookmark`)
    return res.data
}

export const fetchPost = async (id: number) => {
    const res = await api.get<Post>(`/posts/${id}`)
    return res.data
}

export const fetchPostBySlug = async (slug: string) => {
    const res = await api.get<Post>(`/posts/slug/${slug}`)
    return res.data
}

export const updatePost = async (data: {
    id: number;
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED"
}) => {
    const res = await api.put<Post>(`/posts/${data.id}`, data)
    return res.data
}

export const fetchPostsByTag = async (tagName: string) => {
    const res = await api.get<Post[]>(`/posts/tag/${tagName}`)
    return res.data
}

export const deletePost = async (id: number) => {
    await api.delete(`/posts/${id}`)
}

export const searchPosts = async (query: string) => {
    const res = await api.get<Post[]>(`/posts/search`, {
        params: { query }
    })
    return res.data
}
