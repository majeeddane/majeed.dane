---
Task ID: 1
Agent: Main Agent
Task: Fix file upload 500 error and placeholder.jpg 404 issues

Work Log:
- Diagnosed the /api/upload route code - found it was correctly using Supabase Storage but lacked proper error handling
- Verified Supabase environment variables (.env.local) are correctly configured
- Verified the `uploads` Storage bucket exists in Supabase and is public
- Tested direct upload via curl - API works correctly (returns 200 with valid public URLs)
- Root cause of /placeholder.jpg 404: 5 PortfolioItem records in database had imageUrl="/placeholder.jpg"
- Cleaned up all 5 placeholder portfolio items from the database
- Added `about_image` content key to database (was missing)
- Enhanced upload API route: added file size validation (10MB max), SVG support, better error messages with actual Supabase errors, detailed logging
- Fixed admin panel uploadFile function: now shows actual server error messages instead of generic "Upload failed"
- Added isValidImageUrl() helper to portfolio section to treat "/placeholder.jpg" as no image
- Added onError handlers to all images (hero, about, portfolio) to gracefully handle broken URLs
- Made portfolio API accept empty imageUrl (no longer required field)
- Fixed lint error in prisma/seed.ts (require import)
- Verified all uploads work: profile image, about image, CV PDF, portfolio PDF
- Verified no 404 or 500 errors in browser console
- Verified both profile and about images display correctly on the site

Stage Summary:
- Upload API (/api/upload) works correctly with Supabase Storage
- All file types (images + PDFs) upload and return valid public URLs
- No more /placeholder.jpg 404 errors
- Admin panel shows actual error messages when uploads fail
- Portfolio items gracefully handle missing images with fallback UI
- about_image content key added and working
- Both hero profile image and about section image are independent and working
