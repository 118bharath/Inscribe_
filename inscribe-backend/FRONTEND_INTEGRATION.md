# Frontend Integration Guide (Inscribe Backend)

This is the full backend contract for frontend integration.

## Base URL
- Local: `http://localhost:8080`
- Auth prefix: `/api/auth`

## Authentication and Authorization
- Public endpoints:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /actuator/health`
- `GET /actuator/info`
- `GET /v3/api-docs`
- `GET /swagger-ui/index.html`
- All other endpoints require:
- `Authorization: Bearer <accessToken>`

## Auth APIs

### Signup
- `POST /api/auth/signup`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass1"
}
```
- Validation:
- `name`: required, max 100
- `email`: required, valid email, max 150
- `password`: required, 8-72 chars, must include uppercase + lowercase + digit

### Login
- `POST /api/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "StrongPass1"
}
```

### Refresh
- `POST /api/auth/refresh`
```json
{
  "refreshToken": "<token>",
  "deviceId": "web-chrome-main"
}
```
- `deviceId` is required.

### Logout
- `POST /api/auth/logout`
```json
{
  "refreshToken": "<token>",
  "deviceId": "web-chrome-main"
}
```
- `deviceId` is required in request validation.

### Auth Response (signup/login/refresh)
```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<refresh>",
  "user": {
    "id": 1,
    "username": "jane",
    "name": "Jane Doe",
    "bio": null,
    "avatar": null
  }
}
```

## Core APIs

### Posts
- `GET /posts?page=0&size=10`
- `GET /posts/id/{id}`
- `GET /posts/{slug}`
- `GET /posts/category/{category}?page=0&size=10`
- `GET /posts/staff-picks?page=0&size=10`
- `GET /posts/tag/{tagName}?page=0&size=10`
- `GET /posts/bookmarks?page=0&size=10`
- `POST /posts`
- `PUT /posts/{id}`
- `DELETE /posts/{id}`

`PostRequest`:
```json
{
  "title": "My Post",
  "content": "markdown/html/text",
  "excerpt": "short summary",
  "status": "DRAFT",
  "tags": ["java", "spring"],
  "imageUrl": "https://example.com/image.jpg",
  "category": "Technology",
  "staffPick": false
}
```
- Validation:
- `title`: required, max 255
- `content`: required
- `excerpt`: optional, max 1000
- `status`: required enum `DRAFT | PUBLISHED`
- `tags`: optional, max 20 entries
- `imageUrl`: optional valid URL, max 2000
- `category`: optional, max 100
- `staffPick`: optional, only applied for admin users

Behavior notes:
- `/posts/tag/{tagName}` returns published posts for the tag.
- `/posts/bookmarks` returns current user bookmarks (published posts, plus own drafts if bookmarked).
- `/posts/{slug}` and `/posts/id/{id}` can return draft only to the post author.

### Comments
- `POST /posts/{postId}/comments`
- `GET /posts/{postId}/comments?limit=100`
- `DELETE /posts/{postId}/comments/{commentId}`

`CommentRequest`:
```json
{
  "content": "Nice article!",
  "parentId": null
}
```
- Validation:
- `content`: required, max 5000
- `parentId`: optional (for threaded replies)

### Claps and Bookmarks
- `POST /posts/{id}/clap`
- `DELETE /posts/{id}/clap`
- `POST /posts/{id}/bookmark`
- `DELETE /posts/{id}/bookmark`

### Users and Follows
- `GET /users/{id}`
- `GET /users/{id}/posts?page=0&size=10`
- `PUT /users/me`
- `GET /users/search?keyword=jane&page=0&size=10`
- `POST /users/{id}/follow`
- `DELETE /users/{id}/follow`
- `GET /users/{id}/followers?limit=100`
- `GET /users/{id}/following?limit=100`

Behavior notes:
- `/users/{id}/posts` returns:
- all posts (draft + published) if `id` is the authenticated user
- only published posts for other users

### Search
- `GET /search?keyword=java&page=0&size=5`
- `keyword` is required (1-100 chars)
- `size` max 50

### Notifications
- `GET /notifications?page=0&size=20`
- `GET /notifications/unread-count`
- `PUT /notifications/{id}/read`
- `PUT /notifications/read-all`
- Alias base path is also supported:
- `/api/notifications/...`

## File Upload (S3 Presigned URL)

### 1. Request upload URL
- `POST /storage/presigned-url`
```json
{
  "fileName": "cover.png",
  "contentType": "image/png",
  "contentLength": 245120
}
```

Validation:
- `fileName`: required, max 255
- `contentType`: required, max 100
- `contentLength`: 1 to 10,485,760 bytes (10MB)

Response:
```json
{
  "uploadUrl": "https://...",
  "fileKey": "posts/<uuid>-cover.png",
  "viewUrl": "https://..."
}
```

### 2. Upload directly to S3
- `PUT` to `uploadUrl`
- Use the same `Content-Type`

### 3. Persist `viewUrl` or `fileKey` in post payload

## WebSocket Notifications
- STOMP endpoint: `/ws`
- CONNECT header:
- `Authorization: Bearer <accessToken>`
- Subscribe:
- `/user/queue/notifications`

Example notification payload:
```json
{
  "id": 10,
  "message": "Alice commented on your post",
  "type": "COMMENT",
  "isRead": false,
  "senderId": 2,
  "senderName": "Alice",
  "relatedPostId": 7,
  "createdAt": "2026-03-09T18:10:00"
}
```

## Pagination and Limits
- Page-based endpoints use `page` and `size`.
- Max `size` on pageable endpoints is `50`.
- Followers/following/comments use `limit` (default 100, min 1, max 200).

## Error Response Format
```json
{
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2026-03-09T18:10:00",
  "validationErrors": {
    "email": "must be a well-formed email address"
  }
}
```

## Request Correlation
- Backend accepts and returns `X-Request-Id`.
- Frontend should log/store this for debugging.

## CORS
- Allowed origins are controlled by:
- `app.cors.allowed-origins`

## API Docs
- Swagger UI: `/swagger-ui/index.html`
- OpenAPI JSON: `/v3/api-docs`




Here is a comprehensive breakdown of all the features and systems we have successfully implemented in the Inscribe project so far.

This gives us a very solid foundation for a fully functional, modern blogging/publishing platform like Medium.

🎨 Frontend (React + Vite + Tailwind CSS)
Modern UI/UX & Layout: Clean, minimalist reading experience with a responsive App Layout (Topbar, Left Navigation Sidebar, Right Staff Picks Sidebar).
Authentication System: Complete sign-up and sign-in flows with email/password. Token storage is handled securely via sessionStorage (logging out automatically on browser close) while maintaining a persistent device ID.
Rich Text Editing (Tiptap): A full-featured WYSIWYG editor for writing stories, supporting formatting, headings, quotes, and inline cover image uploading.
Interactive Feed:
Infinite scrolling for seamless reading.
Category filtering (Technology, Programming, Design, etc.).
Dedicated "Staff Picks" section for curated content.
Social & Engagement Features:
Follow System: Follow/unfollow writers, view Followers/Following lists in interactive modals, and a dedicated "Following" section in the navigation sidebar.
Bookmarking: Save posts to a personal "Library" for later reading.
Commenting: Interactive discussion threads under each post.
User Profiles: Dedicated profile pages /u/{id} showing the user's avatar, bio, follower metrics, and a feed of their published stories. Users can edit their own profiles.
Real-Time Notifications: A notification bell dropdown that connects via WebSockets to alert users instantly when someone interacts with their content or follows them.
Search Engine: A dedicated search page to discover content by keywords, matching against posts and user profiles.
Client-Side Architecture: Powered by React Router for navigation and @tanstack/react-query for high-performance data fetching, caching, and auto-refresh mechanisms via Axios interceptors.
⚙️ Backend (Spring Boot + Java)
Security & JWT Auth: Role-based access control, secure password hashing (BCrypt), and a robust JWT lifecycle including automatic Access Token refresh routes and hardened Refresh Token tracking in the database.
Rate Limiting & Protection: Built-in rate limit filters on authentication endpoints to prevent brute-force attacks.
Relational Database Engine: Structured data modeling with automatic database migrations (Flyway/SQL scripts) to manage schemas for Users, Posts, Comments, Follows, Bookmarks, and Notifications.
RESTful APIs: Clean, paginated API endpoints for all core resources, fully documented with OpenAPI/Swagger (/v3/api-docs).
AWS S3 Storage Integration: A secure StorageController that generates Presigned URLs, allowing the frontend to upload images directly to AWS S3 without bottlenecking the Java backend.
Real-Time Subsystem (WebSockets): STOMP over SockJS configuration with dedicated channel interceptors to securely authenticate and push live notification events directly to connected clients.
Global Exception Handling: Standardized error responses guaranteeing the frontend always receives clean semantic HTTP status codes and error messages.

