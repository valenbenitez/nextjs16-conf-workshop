import { getBlogPostBySlug, getBlogPosts, getFeaturedBlogPosts } from "@/api";
import BlogPosts, { BlogPostsSkeleton } from "@/components/blog-posts";
import { cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
    const posts = await getBlogPosts();

    return posts.map(post => ({ slug: post.slug }))
}

async function CachedBlogPosts(slug: string) {
    "use cache"
    const post = await getBlogPostBySlug(slug)

    cacheTag(slug)

    return post
}

async function FeaturedBlogPosts() {
    const featuredPosts = await getFeaturedBlogPosts();

    return <BlogPosts posts={featuredPosts} />
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await CachedBlogPosts(slug)

    if (!post) {
        return notFound()
    }

    return (
        <main className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold">{post?.title}</h2>
            <p>{post.content}</p>

            <hr />
            <section>
                <Suspense fallback={<BlogPostsSkeleton />}>
                    <h2 className="mb-8 text-3xl font-bold tracking-tight">Featured Posts</h2>
                    <FeaturedBlogPosts />
                </Suspense>
            </section>
        </main>
    )
}