import type { Comment } from "./types"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CommentItem({ comment, onReply }: { comment: Comment, onReply: (parentId: number, content: string) => void }) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState("")

    const handleSubmit = () => {
        if (!replyContent.trim()) return
        onReply(comment.id, replyContent)
        setIsReplying(false)
        setReplyContent("")
    }

    return (
        <div className="mt-6">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {comment.author.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 text-sm mt-1">{comment.content}</p>

                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs text-gray-500 mt-2 hover:text-black"
                    >
                        Reply
                    </button>

                    {isReplying && (
                        <div className="mt-3">
                            <textarea
                                className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                rows={2}
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={handleSubmit} className="bg-black text-white hover:bg-gray-800">
                                    Reply
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recursive Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map(reply => (
                        <CommentItem key={reply.id} comment={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    )
}
