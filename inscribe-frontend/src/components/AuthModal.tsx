import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuthModal } from "@/context/AuthModalContext"
import SignInOptions from "./SignInOptions.tsx"
import SignUpOptions from "./SignUpOptions.tsx"
import SignInEmail from "./SignInEmail.tsx"
import SignUpEmail from "./SignUpEmail.tsx"

export default function AuthModal() {
    const { modal, closeModal } = useAuthModal()

    return (
        <Dialog open={!!modal} onOpenChange={closeModal}>
            <DialogContent className="max-w-md p-10 overflow-hidden">
                <div key={modal} className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
                    {modal === "signin-options" && <SignInOptions />}
                    {modal === "signup-options" && <SignUpOptions />}
                    {modal === "signin-email" && <SignInEmail />}
                    {modal === "signup-email" && <SignUpEmail />}
                </div>
            </DialogContent>
        </Dialog>
    )
}
