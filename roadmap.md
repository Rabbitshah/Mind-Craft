# MindCraft Roadmap

This roadmap is based on the current state of the project as of March 17, 2026.

The frontend now has a strong routed UI foundation, but most product flows are still demo-only and powered by local mock data. The backend is still a scaffold. The plan below is designed to move MindCraft from a design-complete prototype into a real product in clear phases.

## Current Baseline

### Frontend already available

- Landing page
- Course catalog
- Course detail page
- Sign in / Sign up / Forgot password screens
- Learner dashboard
- Instructor dashboard
- Checkout flow UI
- Local component library

### Backend currently available

- Express app setup
- CORS
- JSON parsing
- Cookie parsing
- dotenv setup
- Root health-style route

### Biggest current limitations

- No real authentication
- No database connection
- No real backend APIs
- No frontend-backend integration
- No payments
- No persistent course, user, or dashboard data
- No real AI functionality

## Phase 1: Core Foundation

Goal: make the app functional end-to-end for the first real user flows.

### 1. Backend structure

Create a clean backend architecture:

- `Server/routes/`
- `Server/controllers/`
- `Server/models/`
- `Server/middleware/`
- `Server/services/`
- `Server/config/`
- `Server/utils/`

Add:

- centralized error handler
- async wrapper utility
- request validation layer
- basic logging middleware

### 2. Environment setup

Add:

- `Client/.env.example`
- `Server/.env.example`

Include placeholders for:

- `PORT`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `OPENAI_API_KEY`
- mail configuration values

### 3. Database connection

Implement MongoDB with Mongoose:

- database connection bootstrap
- connection error handling
- initial seed or sample data strategy

### 4. Core models

Add initial models:

- `User`
- `Course`
- `Lesson`
- `Enrollment`
- `Cart`
- `Order`
- `Review`

Suggested user roles:

- learner
- instructor
- admin

### 5. Authentication

Implement:

- sign up
- sign in
- sign out
- forgot password
- reset password
- auth middleware
- protected routes
- role-based authorization

Optional in this phase:

- Google OAuth

### 6. Frontend API integration

Replace mock/demo-only behavior with real API calls:

- auth forms submit to backend
- catalog fetches courses from API
- course detail fetches by course id
- cart persists
- dashboards fetch user-specific data

Add UI states:

- loading
- empty
- error
- success

## Phase 2: Learning Product MVP

Goal: make MindCraft usable as a learning marketplace.

### 1. Course discovery

Add:

- server-side search
- category filtering
- sorting
- pagination
- featured/trending courses

### 2. Course detail functionality

Add:

- real curriculum data
- lesson previews
- instructor profile data
- reviews and ratings
- enrollment state

### 3. Learner experience

Make `/learn` real with:

- enrolled courses
- continue learning state
- lesson completion tracking
- progress percentages
- certificate eligibility
- recent activity

### 4. Instructor experience

Make `/teach` real with:

- create course
- edit course
- manage curriculum
- upload thumbnails/resources
- course status draft/published
- basic enrollment and revenue metrics

### 5. Review system

Add:

- create review
- edit/delete own review
- average ratings
- review counts
- moderation-ready structure

## Phase 3: Commerce and Business Layer

Goal: make the platform commercially usable.

### 1. Cart and checkout

Implement:

- persistent cart
- add/remove course
- order summary from backend
- checkout session creation

### 2. Stripe integration

Add:

- Stripe checkout or payment intent flow
- payment success verification
- order persistence
- purchased course unlocking
- receipt-ready order records

### 3. Purchase history

Add:

- learner order history
- downloadable receipts
- enrolled course access after payment

### 4. Promotions

Possible additions:

- promo codes
- discounts
- coupons
- limited-time offers

## Phase 4: AI and Smart Learning

Goal: add meaningful AI functionality on top of course content.

### 1. AI assistant

Upgrade the current assistant from demo to real:

- connect to OpenAI
- accept course context
- answer lesson-specific questions
- generate summaries
- explain difficult concepts

### 2. Quiz generation

Add:

- generate quiz from lesson/course
- multiple difficulty levels
- score feedback
- answer explanations

### 3. Study support

Add:

- personalized study suggestions
- revision plans
- concept recap cards
- project prompt generation

### 4. Safety and cost control

Implement:

- prompt boundaries
- rate limits
- token/cost monitoring
- fallback responses

## Phase 5: Media, Communication, and Realtime

Goal: improve engagement and platform quality.

### 1. Media uploads

Use `multer` and storage integration for:

- course thumbnails
- lesson attachments
- PDFs
- instructor avatars
- downloadable resources

### 2. Email workflows

Use `nodemailer` for:

- welcome email
- password reset email
- purchase confirmation
- enrollment confirmation
- reminders

### 3. Notifications

Add:

- in-app notifications
- email notifications
- new review alerts
- session reminders

### 4. Realtime features

Use `socket.io` for:

- live Q&A
- classroom chat
- instructor presence
- learner presence
- realtime announcements

## Phase 6: Admin, Reliability, and Scale

Goal: make the platform operationally strong.

### 1. Admin tools

Add:

- admin dashboard
- user management
- course moderation
- review moderation
- refund/admin order actions

### 2. Validation and security

Implement:

- request validation
- stricter auth checks
- rate limiting
- security headers
- input sanitization

### 3. Testing

Add:

- frontend component tests
- frontend route/page tests
- backend API tests
- auth flow tests
- checkout flow tests

### 4. Dev quality

Add:

- linting for server
- prettier or formatting standard
- CI pipeline
- build checks
- deployment notes

### 5. Monitoring

Add:

- structured logs
- health checks
- error monitoring
- performance monitoring

## Recommended Build Order

If you want the fastest path to a working product, build in this order:

1. Backend structure and env setup
2. MongoDB connection and models
3. Authentication
4. Course APIs
5. Frontend API integration
6. Learner enrollment and progress
7. Instructor course management
8. Cart and Stripe checkout
9. Review system
10. AI assistant integration
11. Media uploads
12. Email workflows
13. Realtime features
14. Admin tools
15. Tests and monitoring

## Suggested File Structure

### Server

```text
Server/
  config/
    db.js
  controllers/
    authController.js
    courseController.js
    enrollmentController.js
    orderController.js
    reviewController.js
    userController.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
    validateRequest.js
  models/
    Cart.js
    Course.js
    Enrollment.js
    Lesson.js
    Order.js
    Review.js
    User.js
  routes/
    authRoutes.js
    courseRoutes.js
    enrollmentRoutes.js
    orderRoutes.js
    reviewRoutes.js
    userRoutes.js
  services/
    aiService.js
    emailService.js
    paymentService.js
  utils/
    asyncHandler.js
    generateToken.js
  index.js
```

### Client

```text
Client/src/
  api/
    authApi.js
    courseApi.js
    orderApi.js
    userApi.js
  context/
    AuthContext.jsx
    CartContext.jsx
  hooks/
    useAuth.js
    useCart.js
  pages/
  components/
  data/
```

## Best Immediate Next Tasks

If we start implementation right away, the most sensible first sprint is:

1. Fix backend branding from `Tutorly` to `MindCraft`
2. Add server folder structure
3. Add Mongo connection
4. Add `User` and `Course` models
5. Build auth API
6. Connect sign-in and sign-up forms
7. Build courses API
8. Connect course catalog and course detail pages

## Good Phase-by-Phase Milestone Outcomes

### After Phase 1

You will have:

- real user accounts
- protected app flows
- real database-backed data
- live course fetching

### After Phase 2

You will have:

- usable learner and instructor flows
- real enrollments and progress
- review-capable course pages

### After Phase 3

You will have:

- real purchases
- order persistence
- monetizable product flow

### After Phase 4 and beyond

You will have:

- AI-enhanced learning workflows
- richer engagement
- a platform that can scale into a fuller edtech product
