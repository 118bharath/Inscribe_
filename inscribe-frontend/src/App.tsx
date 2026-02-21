import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Post from "./pages/Post"
import MainLayout from "./layouts/MainLayout"
import OurStory from "./pages/OurStory.tsx"
import Membership from "./pages/MemberShip.tsx"
import Write from "./pages/Write.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import AppLayout from "./layouts/AppLayout.tsx"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"
import ProfilePage from "./features/profile/ProfilePage"
import AnalyticsDashboard from "./features/analytics/AnalyticsDashboard"
import PostDetail from "./features/posts/PostDetail"
import EditPost from "./features/posts/EditPost"
import SearchPage from "./pages/SearchPage"
import TagPage from "./features/posts/TagPage"


function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  // TODO: Remove "|| true" when done testing
  const startUser = user

  return (
    <BrowserRouter>
      <Routes>
        {startUser ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/write" element={<Write />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/u/:username" element={<ProfilePage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/tag/:tagName" element={<TagPage />} />
          </Route>
        ) : (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/post/:id" element={<Post />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
