"use client"

import { Category } from "@/api"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function CategoriesComponent({
    categories
}: {
    categories: Category[]
}) {
    const searchParams = useSearchParams();
    const categoryActive = searchParams.get("category") || "all";

    return (
        <div className="flex flex-wrap gap-2">
            <Link
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${categoryActive === 'all' && `border-2 border-dotted`}`}
                href="/blog"
            >
                All Posts ({categories.reduce((sum, cat) => sum + cat.postCount, 0)})
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${categoryActive === category.slug && `border-2 border-dotted`}`}
                    href={`/blog?category=${category.slug}`}
                >
                    {category.name} ({category.postCount})
                </Link>
            ))}
        </div>
    )
}