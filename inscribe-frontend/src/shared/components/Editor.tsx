import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function Editor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Start writing your story...</p>",
    })

    return (
        <div className="max-w-3xl mx-auto">
            <EditorContent editor={editor} />
        </div>
    )
}
