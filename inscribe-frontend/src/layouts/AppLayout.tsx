import { Outlet } from "react-router-dom"
import Sidebar from "@/components/layout/Sidebar"
import RightSidebar from "@/components/layout/RightSidebar"
import Topbar from "@/components/layout/Topbar"

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Top Navigation */}
            <Topbar />

            {/* 3 Column Layout */}
            <div className="flex flex-1 max-w-[1400px] mx-auto w-full">

                {/* Left Sidebar */}
                <aside className="hidden lg:block w-[250px] border-r border-gray-200 shrink-0">
                    <div className="sticky top-20">
                        <Sidebar />
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 w-full min-w-0 px-8 py-6">
                    <Outlet />
                </main>

                {/* Right Sidebar */}
                <aside className="hidden xl:block w-[350px] shrink-0 border-l border-gray-200 px-6 py-6">
                    <RightSidebar />
                </aside>

            </div>
        </div>
    )
}
