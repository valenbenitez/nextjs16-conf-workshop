import type { Category } from "@/api";
import CategoriesComponent from "./list-categories";
import { Suspense } from "react";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  return (
      <CategoriesComponent categories={categories} />
  );
}
