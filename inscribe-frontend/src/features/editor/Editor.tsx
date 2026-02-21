import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import YoutubeExtension from "@tiptap/extension-youtube"
import CodeBlockExtension from "@tiptap/extension-code-block"
import Placeholder from "@tiptap/extension-placeholder"
import BubbleMenuExtension from "@tiptap/extension-bubble-menu"
import { useState } from "react"
import { getPresignedUrl, uploadToS3, createPost, getAISuggestion } from "./editorService"
import { Loader2, Sparkles, Image as ImageIcon, Bold, Italic, Link as LinkIcon, Heading1, Heading2, Quote, Code, Video, Search, SplitSquareHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface EditorProps {
    initialTitle?: string
    initialContent?: string
    initialCoverImage?: string
    initialTags?: string[]
    initialStatus?: "DRAFT" | "PUBLISHED"
    onSave?: (data: { title: string; content: string; coverImage?: string; tags: string[]; status: "DRAFT" | "PUBLISHED" }) => Promise<void>
}

export default function Editor({
    initialTitle = "",
    initialContent = "",
    initialCoverImage = "",
    initialTags = [],

    onSave
}: EditorProps) {
    const [coverImage, setCoverImage] = useState<string | null>(initialCoverImage || null)
    const [title, setTitle] = useState(initialTitle)
    const [tags, setTags] = useState<string[]>(initialTags)

    const [isPublishing, setIsPublishing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const navigate = useNavigate()

    const editor = useEditor({
        extensions: [
            StarterKit,
            BubbleMenuExtension,
            ImageExtension.configure({ inline: true, allowBase64: true }),
            LinkExtension.configure({ openOnClick: false }),
            YoutubeExtension.configure({ controls: false }),
            CodeBlockExtension,
            Placeholder.configure({ placeholder: "Tell your story..." })
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "prose prose-lg focus:outline-none max-w-none min-h-[500px] mb-20",
            },
        },
    })

    // Update editor content if initialContent changes (e.g. data fetch)
    // simplistic approach; in real apps be careful not to overwrite user edits

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const url = await getPresignedUrl(file.name)
            await uploadToS3(url, file)
            const publicUrl = url.split("?")[0]
            setCoverImage(publicUrl)
        } catch (error) {
            console.error("Upload failed", error)
            alert("Failed to upload image")
        } finally {
            setIsUploading(false)
        }
    }

    const handleAiSuggestion = async () => {
        const content = editor?.getText()
        if (!content) return

        setIsAiLoading(true)
        try {
            const suggestion = await getAISuggestion(content)
            editor?.commands.insertContent(suggestion)
        } catch (error) {
            console.error("AI failed", error)
        } finally {
            setIsAiLoading(false)
        }
    }

    const handleSave = async (newStatus: "DRAFT" | "PUBLISHED") => {
        if (!title) return alert("Please add a title")

        setIsPublishing(true)
        try {
            const postData = {
                title,
                content: editor?.getHTML() || "",
                coverImage: coverImage || undefined,
                tags,
                status: newStatus
            }

            if (onSave) {
                await onSave(postData)
            } else {
                await createPost(postData)
            }

            if (newStatus === "PUBLISHED") {
                navigate("/")
            } else {
                alert("Draft saved!")
            }
        } catch (error) {
            console.error("Publish/Save failed", error)
            alert("Failed to publish/save story")
        } finally {
            setIsPublishing(false)
        }
    }



    const setLink = () => {
        const previousUrl = editor?.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const addYoutube = () => {
        const url = prompt('Enter YouTube URL')
        if (url) {
            editor?.commands.setYoutubeVideo({ src: url })
        }
    }

    const addUnsplash = () => {
        // Placeholder for Unsplash integration
        const url = prompt('Enter Unsplash Image URL (Demo)')
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 relative">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-black transition text-sm">
                        <ImageIcon size={18} />
                        <span>{isUploading ? "Uploading..." : "Add Cover"}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    </label>

                    <button
                        onClick={handleAiSuggestion}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition text-sm disabled:opacity-50"
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        <span>AI Improve</span>
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave("DRAFT")}
                        disabled={isPublishing}
                        className="text-gray-500 hover:text-black px-4 py-1.5 text-sm font-medium transition disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave("PUBLISHED")}
                        disabled={isPublishing}
                        className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {isPublishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {coverImage && (
                <div className="mb-10 relative group">
                    <img src={coverImage} alt="Cover" className="w-full h-[400px] object-cover rounded-lg" />
                    <button
                        onClick={() => setCoverImage(null)}
                        className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                        ✕
                    </button>
                </div>
            )}

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl font-serif font-bold w-full outline-none placeholder-gray-300 mb-6"
            />

            <div className="flex flex-wrap items-center gap-2 mb-8">
                {tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm flex items-center gap-1">
                        #{tag}
                        <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500">×</button>
                    </span>
                ))}
                <input
                    placeholder="Add a tag..."
                    className="outline-none text-sm bg-transparent placeholder-gray-400"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const val = e.currentTarget.value.trim()
                            if (val && !tags.includes(val)) {
                                setTags([...tags, val])
                                e.currentTarget.value = ""
                            }
                        }
                    }}
                />
            </div>

            {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <div className="bg-black text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-xl">
                        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('bold') ? 'text-green-400' : ''}`}><Bold size={16} /></button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('italic') ? 'text-green-400' : ''}`}><Italic size={16} /></button>
                        <div className="w-[1px] h-4 bg-gray-600 mx-1" />
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('heading', { level: 1 }) ? 'text-green-400' : ''}`}><Heading1 size={16} /></button>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('heading', { level: 2 }) ? 'text-green-400' : ''}`}><Heading2 size={16} /></button>
                        <div className="w-[1px] h-4 bg-gray-600 mx-1" />
                        <button onClick={setLink} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('link') ? 'text-green-400' : ''}`}><LinkIcon size={16} /></button>
                        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-1 hover:bg-gray-700 rounded ${editor.isActive('blockquote') ? 'text-green-400' : ''}`}><Quote size={16} /></button>
                    </div>
                </BubbleMenu>
            )}

            <EditorContent editor={editor} />

            {/* Bottom Fixed Toolbar */}
            {editor && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center z-50">
                    <div className="flex items-center gap-6 text-gray-500">
                        <button onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()} className="flex flex-col items-center gap-1 hover:text-black transition">
                            <ImageIcon size={20} />
                            <span className="text-xs">Image</span>
                        </button>
                        <button onClick={addUnsplash} className="flex flex-col items-center gap-1 hover:text-black transition">
                            <Search size={20} /> {/* Using Search as Unsplash icon proxy */}
                            <span className="text-xs">Unsplash</span>
                        </button>
                        <button onClick={addYoutube} className="flex flex-col items-center gap-1 hover:text-black transition">
                            <Video size={20} />
                            <span className="text-xs">Video</span>
                        </button>
                        <div className="w-[1px] h-8 bg-gray-200" />
                        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`flex flex-col items-center gap-1 hover:text-black transition ${editor.isActive('codeBlock') ? 'text-black' : ''}`}>
                            <Code size={20} />
                            <span className="text-xs">Code</span>
                        </button>
                        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="flex flex-col items-center gap-1 hover:text-black transition">
                            <SplitSquareHorizontal size={20} />
                            <span className="text-xs">Divider</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
