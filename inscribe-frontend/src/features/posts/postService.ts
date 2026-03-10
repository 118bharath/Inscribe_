import api from "@/services/api"
import type { PostPage, Post } from "./types"

const fetchPosts = async (page: number, size: number = 10) => {
    const res = await api.get<PostPage>("/posts", {
        params: { page, size }
    })
    return res.data
}

const fetchPostsByCategory = async (category: string, page: number, size: number = 10) => {
    const res = await api.get<PostPage>(`/posts/category/${category}`, {
        params: { page, size }
    })
    return res.data
}

const fetchStaffPicks = async (page: number = 0, size: number = 5) => {
    const res = await api.get<PostPage>("/posts/staff-picks", {
        params: { page, size }
    })
    return res.data
}

const clapPost = async (id: number) => {
    const res = await api.post(`/posts/${id}/clap`)
    return res.data
}

const unclapPost = async (id: number) => {
    const res = await api.delete(`/posts/${id}/clap`)
    return res.data
}

const bookmarkPost = async (id: number) => {
    const res = await api.post(`/posts/${id}/bookmark`)
    return res.data
}

const unbookmarkPost = async (id: number) => {
    const res = await api.delete(`/posts/${id}/bookmark`)
    return res.data
}

const fetchPost = async (id: number) => {
    const res = await api.get<Post>(`/posts/id/${id}`)
    return res.data
}

const fetchPostBySlug = async (slug: string) => {
    const res = await api.get<Post>(`/posts/${slug}`)
    return res.data
}

const updatePost = async (data: {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
    category?: string;
}) => {
    const res = await api.put<Post>(`/posts/${data.id}`, data)
    return res.data
}

const fetchPostsByTag = async (tagName: string, page: number = 0, size: number = 10) => {
    const res = await api.get<PostPage>(`/posts/tag/${tagName}`, {
        params: { page, size }
    })
    return res.data
}

const deletePost = async (id: number) => {
    await api.delete(`/posts/${id}`)
}

const searchAll = async (keyword: string, page: number = 0, size: number = 10) => {
    const res = await api.get("/search", {
        params: { keyword, page, size }
    })
    return res.data
}

export { fetchPosts, fetchPostsByCategory, fetchStaffPicks, clapPost, unclapPost, bookmarkPost, unbookmarkPost, fetchPost, fetchPostBySlug, updatePost, fetchPostsByTag, deletePost, searchAll }
export default { fetchPosts, fetchPostsByCategory, fetchStaffPicks, clapPost, unclapPost, bookmarkPost, unbookmarkPost, fetchPost, fetchPostBySlug, updatePost, fetchPostsByTag, deletePost, searchAll }
