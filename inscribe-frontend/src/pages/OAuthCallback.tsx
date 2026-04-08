import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function OAuthCallback() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const hasProcessed = useRef(false)

    useEffect(() => {
        if (hasProcessed.current) return

        // Wait a tick to ensure location is fully available
        const timer = setTimeout(() => {
            const hash = window.location.hash
            const search = window.location.search

            // Check if there was an error in the query parameters from the failure handler
            if (search) {
                const searchParams = new URLSearchParams(search)
                if (searchParams.get("error")) {
                    console.error("OAuth login failed:", searchParams.get("error"))
                    navigate("/") // or "/login" if it were a separate page, but here modals are probably used on Home
                    return
                }
            }

            if (!hash) {
                navigate("/")
                return
            }

            // Remove the '#' and parse as URLSearchParams
            const params = new URLSearchParams(hash.substring(1))
            const accessToken = params.get("accessToken")
            const refreshToken = params.get("refreshToken")

            if (accessToken && refreshToken) {
                hasProcessed.current = true
                const id = params.get("id")
                const name = params.get("name") || ""
                const username = params.get("username") || ""
                const avatar = params.get("avatar") || null

                // Perform the frontend login Context update
                login(
                    {
                        id: id ? parseInt(id, 10) : 0,
                        name: name,
                        username: username,
                        avatar: avatar,
                        email: "", // Not provided in the fragment by default
                        bio: null,
                        role: "USER" // Default assumption
                    },
                    accessToken,
                    refreshToken
                )

                // Redirect user to the home page or dashboard
                navigate("/")
            } else {
                navigate("/")
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [navigate, login])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-serif">Completing secure sign-in...</p>
        </div>
    )
}
