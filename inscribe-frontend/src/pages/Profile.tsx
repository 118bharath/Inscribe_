import { useAuth } from "@/context/AuthContext"

export default function Profile() {
    const { user } = useAuth()

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-serif">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
        </div>
    )
}
