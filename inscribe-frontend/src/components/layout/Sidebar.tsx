import { Home, Bookmark, User, BarChart2 } from "lucide-react"
import { Link } from "react-router-dom"

export default function Sidebar() {
    return (
        <div className="h-full p-6 flex flex-col gap-8">

            <h1 className="text-2xl font-serif">Inscribe</h1>

            <nav className="flex flex-col gap-6 text-gray-700">
                <Link to="/" className="flex items-center gap-3 hover:text-black">
                    <Home size={18} />
                    Home
                </Link>

                <Link to="/library" className="flex items-center gap-3 hover:text-black">
                    <Bookmark size={18} />
                    Library
                </Link>

                <Link to="/profile" className="flex items-center gap-3 hover:text-black">
                    <User size={18} />
                    Profile
                </Link>

                <Link to="/stats" className="flex items-center gap-3 hover:text-black">
                    <BarChart2 size={18} />
                    Stats
                </Link>
            </nav>

        </div>
    )
}
