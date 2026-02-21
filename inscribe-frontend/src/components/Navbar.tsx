import { Link, useNavigate } from "react-router-dom"
import { Leaf } from "lucide-react"
import { useAuthModal } from "@/context/AuthModalContext.tsx"
import { useAuth } from "@/context/AuthContext"



export default function Navbar() {

  const { user, logout } = useAuth()
  const { openSignIn, openSignUp } = useAuthModal()
  const navigate = useNavigate()

  const handleWriteClick = () => {
    if (user) {
      navigate("/write")
    } else {
      localStorage.setItem("redirectAfterLogin", "/write")
      openSignIn()
    }
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1400px] mx-auto px-12 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          <span className="text-xl font-semibold tracking-tight">Inscribe</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/our-story" className="hover:text-black transition">Our Story</Link>
          <Link to="/membership" className="hover:text-black transition">Membership</Link>
          <button onClick={handleWriteClick} className="hover:text-black transition">Write</button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="border px-4 py-2 text-sm rounded-md hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={openSignIn} className="text-sm font-medium hover:text-black transition">
                Sign in
              </button>
              <button
                onClick={openSignUp}
                className="bg-black text-white px-5 py-2 text-sm rounded-full hover:bg-gray-800 transition"
              >
                Get started
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
