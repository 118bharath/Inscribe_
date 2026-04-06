import { Outlet } from "react-router-dom"
import Navbar from "../shared/components/Navbar"
import AuthModal from "../shared/components/AuthModal"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <AuthModal />
    </div>
  )
}
