import api from "./api"

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: {
        id: number
        name: string
        email: string
    }
}

export const signIn = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/signin", {
        email,
        password,
    })
    return res.data
}

export const signUp = async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/signup", {
        name,
        email,
        password,
    })
    return res.data
}
