import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

export interface User {
    id: number
    name: string
    email: string
    username: string
    bio: string | null
    avatar: string | null
    role: "USER" | "ADMIN"
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (user: User, accessToken: string, refreshToken: string) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (user: User, accessToken: string, refreshToken: string) => {
        sessionStorage.setItem("accessToken", accessToken)
        sessionStorage.setItem("refreshToken", refreshToken)
        sessionStorage.setItem("user", JSON.stringify(user))
        setUser(user)
    }

    const logout = () => {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        sessionStorage.removeItem("user")
        setUser(null)
    }

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return prev
            const updated = { ...prev, ...updates }
            sessionStorage.setItem("user", JSON.stringify(updated))
            return updated
        })
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within provider")
    return context
}
