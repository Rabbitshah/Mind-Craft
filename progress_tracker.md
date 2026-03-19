# MindCraft Progress Tracker

Last updated: 2026-03-18

## Done

- Phase 1 foundation is in place: routed React client, Express server structure, Mongo config, seed script, README, roadmap, and env examples.
- Auth API foundation exists with register, login, logout, forgot-password scaffold, and current-user lookup.
- Course discovery is API-backed for landing, catalog, and course detail pages.
- Course detail now returns learner access state and enrollment progress.
- Learner and instructor dashboards are connected to backend endpoints.
- Checkout foundation exists with cart, promo, checkout, latest-order, and order-history endpoints.
- Completed Mongo-backed checkout now creates enrollments for purchased courses.
- Signed-in user context now flows through dashboard and commerce backend routes instead of relying only on the first seeded learner.
- Protected frontend routes now gate learner and instructor pages by role.
- Auth-aware API requests now send the stored bearer token for dashboard and commerce flows.
- Header and auth pages now respond to signed-in state with role-aware redirects and sign-out handling.
- Learners can now mark course lessons complete from the course page through a progress API.
- Learner dashboard and enrolled course CTAs now open a dedicated continue-learning player route.
- A first-pass lesson player screen now supports lesson navigation and persisted completion updates.
- The lesson player now includes lesson summaries, takeaways, resource cards, and autosaved lesson notes.

## In Progress

- Converting remaining seeded/fallback assumptions into real authenticated flows.
- Replacing placeholder dashboard content with fully user-derived data in more areas.
- Expanding authenticated course access rules beyond dashboards and checkout.
- Tightening lesson progress into a fuller lesson player and continue-learning flow.
- Replacing the lesson player placeholder media block with real lesson content or video delivery.
- Persisting learner notes and downloadable resources beyond the current frontend-only foundation.

## Not Started

### Phase 2

- Instructor course creation and editing
- Lesson-level content management
- Rich lesson media, notes, and resource delivery inside the new lesson player
- Backend support for lesson assets and downloadable course materials
- Review and rating submission
- Wishlist or saved courses
- Search/filter pagination for larger datasets

### Phase 3

- Purchase history UI
- Receipt or invoice UI
- Stripe checkout integration
- Payment verification and webhooks
- Refund and cancellation flows

### Phase 4

- OpenAI-backed AI assistant
- Course-aware chat context
- Quiz generation
- Lesson summaries
- Study planner
- Chat history persistence

### Phase 5

- File uploads for thumbnails, avatars, and lesson assets
- Email flows for reset, welcome, purchase, and enrollment updates
- Realtime notifications and live session support

### Phase 6

- Admin dashboard and moderation tools
- Frontend tests
- Backend tests
- Logging, monitoring, and health checks
- Security hardening and rate limiting
- CI/CD and deployment polish
