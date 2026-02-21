import api from "@/services/api"

export const getPresignedUrl = async (fileName: string) => {
    const res = await api.post<{ url: string }>("/images/presigned", { fileName })
    return res.data.url
}

export const uploadToS3 = async (url: string, file: File) => {
    await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    })
}

export const createPost = async (data: {
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED"
}) => {
    const res = await api.post("/posts", data)
    return res.data
}

export const getAISuggestion = async (content: string) => {
    const res = await api.post<{ suggestion: string }>("/ai/suggest", { content })
    return res.data.suggestion
}
