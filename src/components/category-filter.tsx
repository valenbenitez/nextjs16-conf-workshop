import type { Category } from "@/api";
import CategoriesComponent from "./list-categories";
import { Suspense } from "react";

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  return (
    <Suspense fallback={<p>Cargando categorias...</p>}>
      <CategoriesComponent categories={categories} />
    </Suspense>
  );
}
