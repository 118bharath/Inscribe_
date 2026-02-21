import { useNavigate } from "react-router-dom"
import { useAuthModal } from "@/context/AuthModalContext"
import { useAuth } from "@/context/AuthContext"

const Home = () => {
  const { user } = useAuth()
  const { openSignIn } = useAuthModal()
  const navigate = useNavigate()

  const handleStartWriting = () => {
    if (user) {
      navigate("/write")
    } else {
      localStorage.setItem("redirectAfterLogin", "/write")
      openSignIn()
    }
  }

  return (
    <div className="w-full border-x border-gray-200">

      <div className="max-w-[1200px] mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">

        {/* IMAGE SECTION (LEFT) */}
        <div className="w-full max-w-[380px] h-[480px] bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto rounded-2xl">
          <span className="text-gray-400 text-base">
            Image Placeholder
          </span>
        </div>

        {/* TEXT SECTION (RIGHT) */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-gray-900">
            Human stories,
            <br />
            written beautifully.
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            A distraction-free space for writers, thinkers, and storytellers to share their voice with the world.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleStartWriting}
              className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Start Writing
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Start Reading
            </button>
          </div>

          <p className="mt-10 text-sm text-gray-500 max-w-md leading-relaxed">
            Simple tools to publish, grow your audience, and connect with a community that values deep writing.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Home
