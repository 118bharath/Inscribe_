import api from "@/services/api"

const getPresignedUrl = async (file: File) => {
    const res = await api.post<{ uploadUrl: string; fileKey: string; viewUrl: string }>("/storage/presigned-url", {
        fileName: file.name,
        contentType: file.type,
        contentLength: file.size
    })
    return res.data
}

const uploadToS3 = async (url: string, file: File) => {
    await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type
        }
    })
}

const createPost = async (data: {
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
    category?: string;
}) => {
    const res = await api.post("/posts", data)
    return res.data
}

const getAISuggestion = async (content: string) => {
    const res = await api.post<{ suggestion: string }>("/ai/suggest", { content })
    return res.data.suggestion
}

export { getPresignedUrl, uploadToS3, createPost, getAISuggestion }
export default { getPresignedUrl, uploadToS3, createPost, getAISuggestion }
