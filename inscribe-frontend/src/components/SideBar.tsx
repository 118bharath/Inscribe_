import { Home, User, BookOpen, BarChart } from "lucide-react"
import { Link } from "react-router-dom"

export default function Sidebar() {
    return (
        <div className="w-64 border-r border-gray-200 p-6 hidden md:flex flex-col gap-6">
            <h2 className="text-2xl font-serif">Inscribe</h2>

            <Link to="/" className="flex items-center gap-3">
                <Home size={18} /> Home
            </Link>

            <Link to="/profile" className="flex items-center gap-3">
                <User size={18} /> Profile
            </Link>

            <Link to="/library" className="flex items-center gap-3">
                <BookOpen size={18} /> Library
            </Link>

            <Link to="/stats" className="flex items-center gap-3">
                <BarChart size={18} /> Stats
            </Link>
        </div>
    )
}
