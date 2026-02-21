import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import AuthModal from "../components/AuthModal"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <AuthModal />
    </div>
  )
}
