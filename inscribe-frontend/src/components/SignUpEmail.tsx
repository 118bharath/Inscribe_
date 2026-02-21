import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthModal } from "@/context/AuthModalContext"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@/services/authService"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const schema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function SignUpEmail() {
    const { goToSignUpOptions, closeModal } = useAuthModal()
    const { login } = useAuth()
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
            const res = await signUp(
                data.name,
                data.email,
                data.password
            )

            login({ ...res.user, role: "USER" }, res.accessToken, res.refreshToken)

            closeModal()

            const redirectPath = localStorage.getItem("redirectAfterLogin")
            if (redirectPath) {
                localStorage.removeItem("redirectAfterLogin")
                navigate(redirectPath)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed")
        }
    }

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-3xl font-serif">Sign up with email</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 text-left"
            >
                <div>
                    <label className="text-sm">Your name</label>
                    <Input {...register("name")} />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

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
                    {isSubmitting ? "Creating account..." : "Continue"}
                </Button>
            </form>

            <p
                onClick={goToSignUpOptions}
                className="text-sm underline cursor-pointer"
            >
                Back to sign up options
            </p>
        </div>
    )
}
