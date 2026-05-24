# Kharadi Properties

A Vite + React property blog website for Kharadi, Pune. This version includes 160 generated society guide pages from the Kharadi society database, with price notes, rent estimates, amenities, buyer profile, investment view, and photo research links.

The site is intentionally set to no-index/private build mode while content and photos are being refined.

## Live links

- Website: https://i-want-to-create-a-website-rouge.vercel.app
- GitHub: https://github.com/aditya15singh07-droid/kharadi-properties

## Run locally

```bash
npm install
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The current society guide UI uses generated local data from `src/data/societyProfiles.js`. The Supabase client and `fetchPublishedPosts()` helper remain ready in `src/lib/supabase.js` for connecting real blog posts or admin-published content next.

## Society guide data

- Main society pages are generated from `src/data/societyProfiles.js`.
- Source spreadsheet: `Kharadi_160_Societies_Complete_Database.xlsx`.
- Visible Google Images search links are removed from the site.
- Where reliable project/property photo URLs were available, society pages show those images directly.
- Societies without a verified image URL show a pending-photo panel instead of a misleading stock image.

## Vercel deployment

1. Push this project to GitHub.
2. Import the GitHub repository in Vercel.
3. Add the Supabase environment variables in Vercel project settings.
4. Deploy with the included `vercel.json`.

## Suggested next pages

- `/societies/:slug` for individual society pages.
- `/rent-in-kharadi` for rental leads.
- `/buy-property-in-kharadi` for buyer services.
- `/post-property` for owner and broker submissions.
