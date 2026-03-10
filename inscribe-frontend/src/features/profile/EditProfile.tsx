import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "./profileService"
import { useAuth } from "@/context/AuthContext"
import { getPresignedUrl, uploadToS3 } from "@/features/editor/editorService"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Loader2, Camera } from "lucide-react"

export default function EditProfile() {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState(user?.bio || "")
    const [avatar, setAvatar] = useState(user?.avatar || "")
    const [isUploading, setIsUploading] = useState(false)

    const mutation = useMutation({
        mutationFn: () => updateProfile({ name, bio, avatar: avatar || undefined }),
        onSuccess: (data) => {
            updateUser({
                name: data.name,
                bio: data.bio,
                avatar: data.avatar ?? undefined
            })
            toast.success("Profile updated")
            navigate(`/u/${user?.id}`)
        },
        onError: () => {
            toast.error("Failed to update profile")
        }
    })

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const { uploadUrl, viewUrl } = await getPresignedUrl(file)
            await uploadToS3(uploadUrl, file)
            setAvatar(viewUrl)
        } catch {
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-serif font-bold mb-8">Edit Profile</h1>

            <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium overflow-hidden">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name.charAt(0)
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-white border rounded-full p-1.5 cursor-pointer shadow-sm hover:bg-gray-50 transition">
                            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                        </label>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user?.email}</p>
                        <p className="text-xs text-gray-500">@{user?.username}</p>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        maxLength={50}
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition resize-none"
                        maxLength={250}
                        placeholder="Tell the world about yourself..."
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">{bio.length}/250</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending || !name.trim()}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {mutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="border border-gray-300 px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
