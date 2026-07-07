---
Task ID: 4
Agent: API Routes Agent
Task: Add missing API CRUD routes for experiences, clients, skills, courses

Work Log:
- Read existing route files for experience, clients, skills, courses (GET/POST only) and portfolio/[id]/route.ts (reference pattern with PUT/DELETE)
- Read content/route.ts to understand SiteContent model for batch endpoint
- Created /src/app/api/experience/[id]/route.ts with PUT and DELETE handlers following portfolio/[id] pattern
- Created /src/app/api/clients/[id]/route.ts with PUT and DELETE handlers following portfolio/[id] pattern
- Created /src/app/api/skills/[id]/route.ts with PUT and DELETE handlers following portfolio/[id] pattern
- Created /src/app/api/courses/[id]/route.ts with PUT and DELETE handlers following portfolio/[id] pattern
- Created /src/app/api/content/batch/route.ts with batch PUT handler accepting array of {key, valueAr, valueEn} objects
- Ran lint check - only pre-existing error in prisma/seed.ts, no new issues
- Verified dev server is running properly

Stage Summary:
- All 4 resources now have full CRUD support via [id]/route.ts files with PUT (partial update) and DELETE (with existence check) handlers
- Batch content endpoint at /api/content/batch accepts PUT with array of {key, valueAr, valueEn} and upserts each item, returning per-item results with 207 status if any fail
- All new routes follow the same pattern as the existing portfolio/[id]/route.ts (async params, existence check before update/delete, spread operator for partial updates)

---
Task ID: 1
Agent: Fullstack Rebuild Agent
Task: Rebuild Portfolio Website with All Improvements & New Features

Work Log:
- Read worklog.md and all existing section components to understand current state
- Installed `react-image-crop` package for image cropping functionality
- **globals.css**: Added `overflow-x: hidden` on both html and body, `max-width: 100vw` on body to prevent mobile horizontal scrolling/jitter. Added `marquee-scroll` and `marquee-scroll-reverse` keyframes for infinite scrolling marquee. Added `dot-pulse` keyframe for timeline dot animation.
- **hero.tsx**: Fixed "شاهد أعمالي" button - changed from invisible `border-white/40 text-white` to visible `border-gold/60 text-gold bg-navy-900/30 backdrop-blur-sm` styling that works on both light and dark backgrounds.
- **about.tsx**: Complete redesign with two-column layout (image left, content right; reversed in RTL). Added `useEffect` to fetch `about_image` from `/api/content` API. Circular profile image with gradient border ring and glow effect. Falls back to initials if no image. Bio card, info badges grid, and education card all in the content column.
- **clients.tsx**: Converted from static grid to infinite scrolling marquee. Two rows scrolling in opposite directions. Each row has client items duplicated 4x for seamless looping. Items are styled as cards with Building2 icon. Uses CSS animations `marquee-scroll` and `marquee-scroll-reverse`. Container has `overflow-hidden` and tracks have `w-max`. Hover pauses the animation.
- **experience.tsx**: Added gold gradient accents on timeline dots (using `linear-gradient(135deg, #C9A84C, #D4BC6A)`). Added `animate-dot-pulse` animation for subtle pulsing effect on dots. Vertical timeline line now uses gradient `from-gold to-navy to-gold`. Cards have subtle gradient background on hover (`from-gold/[0.03] to-transparent`).
- **courses.tsx**: Added numbered badges (01, 02, 03, etc.) in top-right of each card. Added gradient accent bar on left (LTR) or right (RTL) of each card (`bg-gradient-to-b from-gold to-gold-light`). Cards have `overflow-hidden` for proper accent bar rendering.
- **admin-panel.tsx**: Integrated `react-image-crop` for image cropping. Created `ImageCropDialog` component with 1:1 aspect ratio crop for profile/about images. Added "About Section Image" upload section in the Files panel. Added `currentAboutImg` and `aboutPreview` state. Both profile image and about image uploads now open crop dialog before saving. After cropping, canvas converts to blob and uploads via the existing upload flow. Added `pendingAboutImg` state management. The `uploadFile` function now accepts `File | Blob` to support cropped blobs.
- Ran lint check - only pre-existing error in prisma/seed.ts, no new issues from changes
- Verified dev server is running and compiling successfully with no errors

Stage Summary:
- Fixed mobile horizontal scrolling by adding overflow-x: hidden on html/body
- Fixed invisible "View Portfolio" button in hero section with gold-themed styling
- Added separate aboutImage field with fetch from `about_image` content key
- Converted clients section to infinite scrolling marquee with two-row opposite directions
- Improved experience section with gold gradient timeline dots and pulse animation
- Added numbered badges and gradient accent bars to courses section
- Integrated image crop dialog (react-image-crop) for profile and about image uploads in admin panel
- All sections verified to be mobile responsive with proper Tailwind responsive classes
