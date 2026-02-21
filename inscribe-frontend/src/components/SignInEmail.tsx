import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthModal } from "@/context/AuthModalContext"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@/services/authService"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function SignInEmail() {
    const { goToSignInOptions, closeModal } = useAuthModal()
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            const { login } = useAuth()
            const res = await signIn(data.email, data.password)

            login({ ...res.user, role: "USER" }, res.accessToken, res.refreshToken)

            closeModal()

            const redirectPath = localStorage.getItem("redirectAfterLogin")
            if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin")
                navigate(redirectPath)
            } else {
                window.location.reload()
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-3xl font-serif">Sign in with email</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 text-left"
            >
                <div>
                    <label className="text-sm">Your email</label>
                    <Input {...register("email")} />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="text-sm">Password</label>
                    <Input type="password" {...register("password")} />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full bg-black text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing in..." : "Continue"}
                </Button>
            </form>

            <p
                onClick={goToSignInOptions}
                className="text-sm underline cursor-pointer"
            >
                Back to sign in options
            </p>
        </div>
    )
}
