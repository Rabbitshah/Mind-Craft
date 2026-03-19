# Codebase Brief: MindCraft

This document summarizes the current state of the MindCraft project after the frontend redesign port.

## Project Structure Overview

The project is divided into two main parts:
- `Client/`: React 19 application built with Vite and Tailwind CSS v4
- `Server/`: Express.js backend scaffold

## Current Frontend State

The frontend is no longer a single landing page. It now has a routed multi-page structure based on the Figma-generated screens, rebuilt with local project components instead of the generated `ui/*` imports.

### Frontend architecture

- Routing is defined in `Client/src/App.jsx`
- Shared visual primitives live in `Client/src/components/primitives.jsx`
- Shared layout/components live in:
  - `Client/src/components/Header.jsx`
  - `Client/src/components/Footer.jsx`
  - `Client/src/components/CourseCard.jsx`
  - `Client/src/components/Chip.jsx`
  - `Client/src/components/AIAssistantPanel.jsx`
  - `Client/src/components/Icons.jsx`
- Shared mock data currently lives in `Client/src/data/mockData.js`
- Global theme tokens and app-level styling live in `Client/src/index.css`

### Routes currently implemented

1. `/`
   - Landing page
   - File: `Client/src/pages/LandingPage.jsx`

2. `/courses`
   - Course catalog with search, category filters, and sorting
   - File: `Client/src/pages/CourseCatalog.jsx`

3. `/courses/:courseId`
   - Course detail page with overview, curriculum, instructor, reviews, and AI assistant panel
   - File: `Client/src/pages/CourseDetail.jsx`

4. `/sign-in`
   - Sign-in screen
   - File: `Client/src/pages/AuthPages.jsx`

5. `/sign-up`
   - Sign-up screen
   - File: `Client/src/pages/AuthPages.jsx`

6. `/forgot-password`
   - Password reset screen
   - File: `Client/src/pages/AuthPages.jsx`

7. `/learn`
   - Learner dashboard
   - File: `Client/src/pages/LearnerDashboard.jsx`

8. `/teach`
   - Instructor dashboard
   - File: `Client/src/pages/InstructorDashboard.jsx`

9. `/checkout`
   - Cart page
   - File: `Client/src/pages/CheckoutPages.jsx`

10. `/checkout/payment`
    - Payment page
    - File: `Client/src/pages/CheckoutPages.jsx`

11. `/checkout/confirmation`
    - Order confirmation page
    - File: `Client/src/pages/CheckoutPages.jsx`

12. `/components`
    - Local component library/demo page
    - File: `Client/src/pages/ComponentLibrary.jsx`

## Current Backend State

The backend is still minimal and is not yet connected to the frontend flows.

### Implemented backend behavior

- Express app setup
- `dotenv` support
- `cors` configured for local frontend use
- JSON parsing middleware
- Cookie parsing middleware
- Root route in `Server/index.js`

### Current backend limitations

- No auth routes
- No course APIs
- No database connection setup
- No checkout/payment endpoints
- No AI endpoints
- No file upload flows
- No live data powering the dashboards

## Workflow Summary

### Frontend workflow

1. `Client/src/main.jsx` mounts the app
2. `Client/src/App.jsx` defines all page routes
3. Shared UI primitives are reused across pages
4. Page content is currently driven by local mock data
5. Styling is controlled by CSS variables and Tailwind utility classes

### Backend workflow

1. `Server/index.js` loads environment variables
2. Express middleware is registered
3. The server listens on `process.env.PORT` or `5000`

## Engineering Notes

- The previous single-page prototype has been replaced with a routed UI structure
- The generated Figma files were used as design references, not copied directly
- The generated external `ui/*` dependency pattern was intentionally removed
- The client build has been verified successfully with Vite
- The server now has practical startup scripts:
  - `npm run dev`
  - `npm start`

## Recommended Next Steps

1. Add `.env.example` files for client and server
2. Connect catalog, auth, and checkout flows to real backend APIs
3. Add backend route organization (`routes`, `controllers`, `models`, `middleware`)
4. Replace mock data with API-driven state
5. Add form validation and error states
6. Add tests for the routed frontend pages and server startup
