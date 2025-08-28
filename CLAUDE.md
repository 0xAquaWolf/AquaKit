# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run debug` - Start development server with Node.js debugger enabled
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Architecture Overview

This is a Next.js 15 application with App Router that integrates Convex for backend services and Better Auth for authentication.

### Key Architecture Components

**Authentication Stack:**

- Better Auth with Convex integration (`@convex-dev/better-auth`)
- Auth client configured in `src/lib/auth-client.ts`
- Authentication routes in `src/app/api/auth/[...all]/route.ts`
- Convex auth configuration in `convex/auth.config.ts`

**Convex Integration:**

- Convex backend with Better Auth plugin in `convex/convex.config.ts`
- Client provider wraps the app in `src/app/ConvexClientProvider.tsx`
- Schema definitions in `convex/schema.ts`
- HTTP endpoints in `convex/http.ts`

**Frontend Structure:**

- Next.js App Router with TypeScript
- Tailwind CSS for styling with custom configuration
- UI components in `src/components/ui/`
- Path aliases: `@/*` for `src/*` and `@/convex/*` for `convex/*`

### Environment Setup

The application requires:

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `CONVEX_SITE_URL` - Used in auth configuration

### Styling and UI

- Tailwind CSS v4 with PostCSS configuration
- Custom component system using `class-variance-authority`
- Lucide React for icons
- Geist font family (Sans and Mono variants)

### State Management

- Zustand for client-side state management
- Convex for server state and real-time data

### Development Notes

- Uses Turbopack for faster builds and development
- TypeScript with strict mode enabled
- Source maps enabled for debugging
- Prettier with import sorting and Tailwind class sorting plugins
