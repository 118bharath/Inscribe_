import { Button } from "@/components/ui/button"
import { useAuthModal } from "@/context/AuthModalContext"
import { Mail } from "lucide-react"

export default function SignUpOptions() {
    const {
        goToSignInOptions,
        goToSignUpEmail,
    } = useAuthModal()

    const handleOAuth = (provider: string) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`
    }

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-3xl font-serif">Join Inscribe.</h2>

            <div className="space-y-3">
                <Button variant="outline" className="w-full relative" onClick={() => handleOAuth("google")}>
                    <svg className="absolute left-4 w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </Button>

                <Button variant="outline" className="w-full relative" onClick={() => handleOAuth("facebook")}>
                    <svg className="absolute left-4 w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.88c0-2.474 1.283-4.416 4.646-4.416 1.611 0 3.196.126 3.196.126v3.495h-1.801c-1.393 0-2.086.974-2.086 1.944v1.731h3.754l-.6 3.667h-3.154v7.98C19.782 23.497 24 18.254 24 12 24 5.373 18.627 0 12 0S0 5.373 0 12c0 6.254 4.218 11.497 10.999 11.691z" />
                    </svg>
                    Sign up with Facebook
                </Button>

                <Button variant="outline" className="w-full relative" onClick={() => handleOAuth("twitter")}>
                    <svg className="absolute left-4 w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Sign in with X
                </Button>

                <Button variant="outline" className="w-full relative" onClick={goToSignUpEmail}>
                    <Mail className="absolute left-4 w-5 h-5" />
                    Sign up with email
                </Button>
            </div>

            <p className="text-sm">
                Already have an account?{" "}
                <span
                    onClick={goToSignInOptions}
                    className="underline cursor-pointer"
                >
                    Sign in
                </span>
            </p>
        </div>
    )
}
