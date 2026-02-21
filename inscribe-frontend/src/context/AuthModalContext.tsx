import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

type ModalType =
    | "signin-options"
    | "signup-options"
    | "signin-email"
    | "signup-email"
    | null

interface AuthContextType {
    modal: ModalType
    openSignIn: () => void
    openSignUp: () => void
    closeModal: () => void
    goToSignInEmail: () => void
    goToSignUpEmail: () => void
    goToSignInOptions: () => void
    goToSignUpOptions: () => void
}

const AuthModalContext = createContext<AuthContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalType>(null)

    return (
        <AuthModalContext.Provider
            value={{
                modal,
                openSignIn: () => setModal("signin-options"),
                openSignUp: () => setModal("signup-options"),
                closeModal: () => setModal(null),
                goToSignInEmail: () => setModal("signin-email"),
                goToSignUpEmail: () => setModal("signup-email"),
                goToSignInOptions: () => setModal("signin-options"),
                goToSignUpOptions: () => setModal("signup-options"),
            }}
        >
            {children}
        </AuthModalContext.Provider>
    )
}

export function useAuthModal() {
    const context = useContext(AuthModalContext)
    if (!context) throw new Error("useAuthModal must be used within provider")
    return context
}
