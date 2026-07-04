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
