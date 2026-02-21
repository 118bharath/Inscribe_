import { useEffect, useState, useRef } from "react"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs" // Use direct import, not { Client } from... wait. standard import is fine.
import type { Comment } from "./types"
import CommentItem from "./CommentItem"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function CommentsSection({ postId }: { postId: number }) {
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const clientRef = useRef<Client | null>(null)

    // Fetch initial comments
    useEffect(() => {
        api.get<Comment[]>(`/posts/${postId}/comments`)
            .then(res => setComments(res.data))
            .catch(err => console.error("Failed to fetch comments", err))
    }, [postId])

    // WebSocket Connection
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws")
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/post/${postId}`, (message) => {
                    const receivedComment: Comment = JSON.parse(message.body)
                    addCommentToUI(receivedComment)
                })
            },
        })

        client.activate()
        clientRef.current = client

        return () => {
            client.deactivate()
        }
    }, [postId])

    const addCommentToUI = (comment: Comment) => {
        setComments(prev => {
            // If it's a top-level comment
            if (!comment.parentId) {
                // Avoid duplicates
                if (prev.find(c => c.id === comment.id)) return prev
                return [comment, ...prev]
            }

            // If it's a reply, find parent and append
            // Note: This needs a recursive update function for deep replies
            // For simplicity in this level, we assume simple nesting or just re-fetch
            // But let's try to update locally
            return addReplyToTree(prev, comment)
        })
    }

    const addReplyToTree = (list: Comment[], newReply: Comment): Comment[] => {
        return list.map(c => {
            if (c.id === newReply.parentId) {
                const replies = c.replies || []
                if (replies.find(r => r.id === newReply.id)) return c
                return { ...c, replies: [...replies, newReply] }
            } else if (c.replies?.length) {
                return { ...c, replies: addReplyToTree(c.replies, newReply) }
            }
            return c
        })
    }

    const handlePostComment = async () => {
        if (!newComment.trim()) return

        try {
            await api.post(`/posts/${postId}/comments`, { content: newComment })
            setNewComment("")
        } catch (err) {
            console.error("Failed to post comment", err)
        }
    }

    const handleReply = async (parentId: number, content: string) => {
        try {
            await api.post(`/posts/${postId}/comments`, { content, parentId })
        } catch (err) {
            console.error("Failed to reply", err)
        }
    }

    return (
        <div className="py-10 border-t mt-10">
            <h3 className="text-xl font-bold mb-6">Responses ({comments.length})</h3>

            {user ? (
                <div className="mb-8">
                    <textarea
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-black"
                        rows={3}
                        placeholder="What are your thoughts?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                        <Button
                            onClick={handlePostComment}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                            disabled={!newComment.trim()}
                        >
                            Respond
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-6 bg-gray-50 p-4 rounded text-center">
                    <p className="text-sm">Log in to leave a comment</p>
                </div>
            )}

            <div className="space-y-2">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
                ))}
            </div>
        </div>
    )
}
