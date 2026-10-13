# MindCraft: Detailed Project Overview

MindCraft is an early-stage creative learning platform that allows learners to discover courses and instructors to publish design, coding, and digital craft classes. The project aims to provide a premium, modern learning marketplace with a strong focus on design and user experience.

## 🏗️ Architecture & Technology Stack

The project uses a modern JavaScript/TypeScript stack, divided into a client-side frontend and a server-side backend scaffold:

*   **Frontend (Client):** 
    *   **Framework:** React 19 built with Vite.
    *   **Styling:** Tailwind CSS v4.
    *   **Routing:** React Router.
    *   **State:** The frontend has a robust UI foundation rebuilt from a Figma-generated structure, currently relying on mock data for demonstrations.
*   **Backend (Server):** 
    *   **Framework:** Express.js (currently a minimal scaffold).
    *   **Core setup:** Configured with CORS, JSON parsing, cookie parsing, and environment variables (`dotenv`).
    *   **Planned Integrations:** MongoDB (Mongoose), JWT authentication, Stripe (payments), OpenAI (AI integrations), Socket.IO (realtime features), Nodemailer, and Multer.

## 📊 Current State of the Project

The project is currently a **design-complete prototype**. While the UI looks functional, most of the product flows lack real backend integration.

### What is Working:
*   **Client Routes:** Landing page (`/`), Course catalog (`/courses`), Course detail (`/courses/:courseId`), Auth screens (`/sign-in`, `/sign-up`, `/forgot-password`), Dashboards (`/learn`, `/teach`), and a Checkout flow (`/checkout`).
*   **Component Library:** A local component library (`/components`) is available.
*   **Server Basics:** The Express server can boot up and serve a basic health-check endpoint.

### Major Limitations (What is Missing):
*   No real database connection or persistence (despite `mongoose` being installed).
*   No functional authentication or protected routes.
*   No real API integration connecting the frontend to the backend.
*   No payment processing, AI features, file uploads, or email workflows.

## 🚀 Development Roadmap

To move MindCraft from a prototype to a fully functional product, the development roadmap is structured into clear phases:

### Phase 1: Core Foundation
*   **Backend Structure:** Establish clean architecture (routes, controllers, models, middleware, services).
*   **Database & Models:** Connect to MongoDB and create core models (`User`, `Course`, `Lesson`, `Enrollment`, `Cart`, `Order`, `Review`).
*   **Authentication:** Implement robust email/password auth with JWT, protected routes, and role-based access.
*   **API Integration:** Replace mock data with real frontend-backend communication.

### Phase 2: Learning Product MVP
*   **Course Discovery:** Implement server-side search, filtering, and pagination.
*   **Learner & Instructor Experience:** Realize dashboards for tracking progress, managing course content, uploading assets, and handling enrollments.
*   **Review System:** Enable users to leave and manage course reviews.

### Phase 3: Commerce & Business Layer
*   **Payments:** Integrate Stripe for checkout, order history, and receipts.
*   **Promotions:** Support promo codes and discounts.

### Phase 4: AI & Smart Learning
*   **AI Assistant:** Integrate OpenAI to provide contextual Q&A on lessons, generate quizzes, and offer personalized study suggestions.

### Phase 5 & 6: Scale, Reliability, and Media
*   **Media & Realtime:** Add file uploads (`multer`), email workflows (`nodemailer`), and live class features (`socket.io`).
*   **Admin & Quality:** Introduce an admin dashboard, input validation, testing (frontend/backend), structured logging, and CI/CD pipelines.

## 🎯 Immediate Next Steps
The recommended first sprint focuses on establishing the backend foundation:
1. Standardize branding (ensure "MindCraft" is used consistently, replacing any legacy terms like "Tutorly").
2. Set up the server folder structure.
3. Establish the MongoDB connection.
4. Create the `User` and `Course` data models.
5. Build the authentication API and connect the sign-in/sign-up forms.
