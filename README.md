# KHARADI PROPERTIES

A Vite + React property blog website for Kharadi, Pune. This first version is a content engine for society guides, rent updates, buying notes, and local area information. Later it can grow into service pages and property sales/listings.

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

The current UI uses sample data from `src/data/properties.js`. The Supabase client and `fetchPublishedPosts()` helper are ready in `src/lib/supabase.js` for connecting real blog posts next.

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
