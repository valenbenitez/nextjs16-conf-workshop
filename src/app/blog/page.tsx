import { getBlogPosts, getCategories } from "@/api";

import BlogPosts, { BlogPostsSkeleton } from "@/components/blog-posts";
import CategoryFilter from "@/components/category-filter";
import { Suspense } from "react";

export async function SearchResults({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getBlogPosts(category);

  return <BlogPosts posts={posts} />
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const categories = await getCategories();

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <header>
        <h1 className="mb-4 text-4xl font-bold">Blog Posts</h1>
        <p className="text-muted-foreground">Discover our latest articles and insights</p>
      </header>
      <CategoryFilter categories={categories} />

      <Suspense fallback={<BlogPostsSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>

    </div>
  );
}
