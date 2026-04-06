import api, { getDeviceId } from "./api"
import type { User } from "@/context/AuthContext"

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

const signIn = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
    })
    return res.data
}

const signUp = async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/signup", {
        name,
        email,
        password,
    })
    return res.data
}

const logoutUser = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken")
    if (refreshToken) {
        try {
            await api.post("/auth/logout", {
                refreshToken,
                deviceId: getDeviceId()
            })
        } catch {
            // Silently fail — we clear storage regardless
        }
    }
}

export { signIn, signUp, logoutUser }
export default { signIn, signUp, logoutUser }
