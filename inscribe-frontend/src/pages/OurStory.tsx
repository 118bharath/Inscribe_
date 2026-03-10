import { ArrowRight, PenLine, Users, Sparkles, Shield } from "lucide-react"
import { Link } from "react-router-dom"

export default function OurStory() {
    return (
        <div className="w-full">

            {/* ── HERO SECTION ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight text-gray-900">
                        Built for writers<br />and thinkers.
                    </h1>
                    <p className="mt-6 text-gray-500 text-lg leading-relaxed max-w-md">
                        Start writing today — scale to powerful, creative tools when you need them.
                    </p>
                    <p className="mt-12 text-sm text-gray-400 max-w-sm leading-relaxed">
                        All features work together — start simply, grow confidently, and keep full creative control.
                    </p>
                </div>

                <div className="flex gap-4 items-start">
                    {/* Main image card */}
                    <div className="relative flex-1 group">
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-gray-300 rounded-tl-sm" />
                        <img
                            src="/story-hero.png"
                            alt="Writer at work"
                            className="w-full h-[420px] object-cover rounded-sm shadow-lg"
                        />
                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded text-sm italic font-serif">
                            Your voice matters
                        </div>
                    </div>

                    {/* Secondary image card */}
                    <div className="relative w-[45%] mt-12 group">
                        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-gray-300 rounded-tr-sm" />
                        <img
                            src="/story-community.png"
                            alt="Community of writers"
                            className="w-full h-[320px] object-cover rounded-sm shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-gray-200" />

            {/* ── MISSION SECTION ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                    <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-gray-300 rounded-bl-sm" />
                    <img
                        src="/story-creative.png"
                        alt="Creative process"
                        className="w-full h-[400px] object-cover rounded-sm shadow-lg"
                    />
                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded text-sm italic font-serif">
                        Distraction-free creation
                    </div>
                </div>

                <div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-gray-900">
                        Why we built<br />Inscribe.
                    </h2>
                    <p className="mt-6 text-gray-500 text-lg leading-relaxed">
                        We believe great ideas deserve a great home. Too many platforms overwhelm writers with noise. Inscribe strips away the clutter so you can focus on what matters — your words.
                    </p>
                    <p className="mt-4 text-gray-500 leading-relaxed">
                        From a simple draft to a published story read by thousands, every feature is designed to serve the writing experience first.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-gray-900 hover:text-green-700 transition group"
                    >
                        Start writing
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-gray-200" />

            {/* ── FEATURES GRID ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-20">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                    Everything you need.
                </h2>
                <p className="text-gray-500 text-lg mb-16 max-w-lg">
                    Powerful tools that stay out of your way until you need them.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
                    {/* Feature 1 */}
                    <div className="bg-white p-8 group hover:bg-gray-50 transition">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 mb-5 group-hover:bg-green-100 transition">
                            <PenLine size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Rich Editor</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            A beautiful, distraction-free editor with formatting, images, embeds, and code blocks.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-8 group hover:bg-gray-50 transition">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-5 group-hover:bg-purple-100 transition">
                            <Sparkles size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Smart content suggestions powered by AI to help you write better, faster.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 group hover:bg-gray-50 transition">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-100 transition">
                            <Users size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Follow writers, engage with comments, and build your audience organically.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-8 group hover:bg-gray-50 transition">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-100 transition">
                            <Shield size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">You Own It</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your content is yours. Draft or publish on your terms — no gatekeepers.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="border-t border-gray-200" />

            {/* ── BOTTOM CTA ── */}
            <section className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                    Ready to tell your story?
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                    Join a growing community of writers who value clarity, craft, and creative freedom.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-800 transition group"
                >
                    Get Started
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>
        </div>
    )
}
