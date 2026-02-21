# Inscribe

Inscribe is a production-ready full-stack blogging platform designed to deliver a modern publishing experience similar to Medium.

It features a React + TypeScript frontend and a Spring Boot backend secured with JWT authentication and refresh tokens. The system is built with scalability in mind, supporting Docker-based deployment and future microservices architecture.

## Tech Stack

### Frontend
- React (TypeScript)
- TailwindCSS
- shadcn/ui
- React Query
- TipTap Editor

### Backend
- Spring Boot (Java 21)
- Spring Security (JWT + Refresh Tokens)
- MySQL 8
- Flyway Database Migrations
- Maven

### Infrastructure (Planned)
- Docker
- AWS (EC2 / RDS / S3)
- CI/CD via GitHub Actions

## Features

- Authentication (Signup/Login with JWT)
- Refresh Token Strategy (DB-backed)
- Role-based Authorization
- Post Creation & Editing
- Draft & Publish System
- Tag & Search System
- Nested Comments
- Follow & Bookmark System
- Production-grade project structure
