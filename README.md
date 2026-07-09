# Next.js 16 Cache Components — Blog Demo

A small blog application built to explore and demonstrate **caching strategies in Next.js 16** using Cache Components, Partial Prerendering (PPR), and on-demand revalidation.

**Live demo:** https://beni-blog-16.vercel.app

## What this project demonstrates

This is not a production CMS. It is a **technical demo** focused on how to reason about cache boundaries in the App Router:

- When to cache at the **page** level vs the **data function** level
- How to keep a **static shell** while streaming **dynamic content**
- How to tag cached entries and **invalidate them on demand**
- How Next.js classifies routes at build time (`○` static, `◐` partial prerender, `ƒ` dynamic)

The data layer simulates API latency with artificial delays so cache hits and misses are easy to observe in the server logs.

## Stack

- **Next.js 16** with `cacheComponents: true`
- **React 19** (Server Components + Suspense)
- **TypeScript**
- **Tailwind CSS 4**

## Cache strategy

### Home (`/`)

The entire page is wrapped in `"use cache"` with `cacheLife("minutes")` (~1 minute revalidation).

- Stats and featured posts are fetched in parallel inside the cached boundary.
- The page is fully prerendered and served from cache between revalidations.

### Blog listing (`/blog`)

Uses **Partial Prerendering** to split static and dynamic concerns:

| Layer | Behavior |
|-------|----------|
| Header + category filter | Static — categories fetched via `getCategories()` with `"use cache"` and tagged `categories` |
| Post grid | Dynamic — wrapped in `<Suspense>` and filtered by `?category=` search param |

This avoids marking the entire page as dynamic just because the post list depends on query params.

### Blog post (`/blog/[slug]`)

- `generateStaticParams()` prebuilds all post routes at compile time.
- Post content is cached per slug with `"use cache"` and tagged with the post slug via `cacheTag(slug)`.
- A **Featured Posts** section at the bottom is dynamic and streamed inside `<Suspense>` after the cached article shell.

### On-demand revalidation

Two secured API routes allow manual cache invalidation during development and demos:

```
GET /revalidate/tag?tag=<slug>&secret=<SECRET>
GET /revalidate/path?path=<path>&type=page|layout&secret=<SECRET>
```

`revalidateTag` is called with `"max"` to invalidate across all cache life profiles.

## Project structure

```
src/
├── api.ts                          # Data layer with simulated latency
├── app/
│   ├── page.tsx                    # Cached home page
│   ├── blog/
│   │   ├── page.tsx                # PPR: static shell + dynamic posts
│   │   └── [slug]/page.tsx         # Cached post + dynamic featured section
│   └── revalidate/
│       ├── tag/route.ts            # Tag-based invalidation
│       └── path/route.ts           # Path-based invalidation
└── components/
    ├── blog-posts.tsx              # Post grid + skeleton
    └── category-filter.tsx         # Client-side active category state
```

## Getting started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|----------|-------------|
| `SECRET` | Shared secret for `/revalidate/*` routes |

### Scripts

```bash
pnpm dev      # Development server (Turbopack)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # ESLint
```

## Observing cache behavior

1. Run `pnpm dev` and watch the terminal — API calls log with `[API] Fetching...` prefixes.
2. Navigate to `/blog` and switch categories — only the Suspense boundary refetches posts.
3. Reload `/` within the cache window — no data fetches should appear in the logs.
4. After changing cached content, call the revalidate endpoint:

```bash
curl "http://localhost:3000/revalidate/tag?tag=my-post-slug&secret=your-secret"
```

5. Run `pnpm build` and inspect the route table — look for `○`, `◐`, and `ƒ` markers and revalidate times.

## Key decisions

**Why cache categories separately?**  
Categories change rarely compared to posts. Caching them at the data layer with a dedicated tag (`categories`) allows targeted invalidation without busting the entire blog page cache.

**Why Suspense on the blog listing?**  
`searchParams` makes the post list inherently dynamic. Suspense lets Next prerender the layout and category filter while streaming only the filtered results.

**Why tag posts by slug?**  
Each post has an independent cache entry. When a single post is updated, only its tag needs revalidation — not the full site.

## Origin

This project started from the [Next.js 16 Cache Components workshop](https://github.com/vercel/next.js).

These were the tasks that were originally to be completed:

### Task 1: Home page

Migrate home page to use [`"use cache"`](https://nextjs.org/docs/app/api-reference/directives/use-cache) directive. Remember to keep the original [revalidation time](https://nextjs.org/docs/app/api-reference/functions/cacheLife) of 60 seconds.

### Task 2: Blog page

Migrate the blog page to use `"use cache"`. Currently the entire page is dynamic because results are dynamic. Find a way of making the categories and layout static while keeping the posts dynamic.

### Task 3: Blog post page

Create a fully static blog post page that uses [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag) to set a tag with the blog post id.

### Task 4: Revalidate the cache

Create a secured route to revalidate the cache of a given tag using [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).

### Task 5: Add a dynamic featured posts section to blog post page

Add a dynamic section to the end of the blog post page to show the featured posts.

## Bonus Tasks

- Show the active category in the `category-filter` component.
- Create a custom cache profile in `next.config.ts` and use it.
- Deploy the application and verify everything works.


