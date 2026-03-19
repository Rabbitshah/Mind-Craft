# MindCraft

MindCraft is a React + Vite frontend with an Express backend scaffold for a creative learning platform.

## Project Structure

- `Client/` - React 19, Vite, Tailwind CSS v4
- `Server/` - Express server scaffold

## Prerequisites

- Node.js 18+ recommended
- npm

## Initial Setup

Install dependencies for both apps:

```powershell
cd Client
npm install
cd ..
cd Server
npm install
```

## Start The Frontend

From the project root:

```powershell
cd Client
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Start The Backend

From the project root:

```powershell
cd Server
npm run dev
```

If you want the non-watch version:

```powershell
cd Server
npm start
```

## Seed Sample Data

If you have MongoDB configured in `Server/.env`, you can seed sample courses, users, and enrollments with:

```powershell
cd Server
npm run seed
```

Default backend URL:

```text
http://localhost:5000
```

## Build The Frontend

```powershell
cd Client
npm run build
```

Preview the production build:

```powershell
cd Client
npm run preview
```

## Lint The Frontend

```powershell
cd Client
npm run lint
```

## Current Routes

- `/` - Landing page
- `/courses` - Course catalog
- `/courses/:courseId` - Course detail
- `/sign-in` - Sign in
- `/sign-up` - Sign up
- `/forgot-password` - Forgot password
- `/learn` - Learner dashboard
- `/teach` - Instructor dashboard
- `/checkout` - Cart
- `/checkout/payment` - Payment
- `/checkout/confirmation` - Confirmation
- `/components` - Local component library

## Notes

- The frontend has been rebuilt from the Figma-generated structure without relying on the generated `ui/*` imports.
- The backend is still a starter scaffold and does not yet power the frontend flows.
- The server expects environment variables through `.env` if you add custom config like `PORT`.
