"use client";

import { use } from "react";
import { useCategoryBySlug, usePostsByCategorySlug } from "@/features/category/hooks/useCategories";
import { PostSection } from "@/components/sections/PostSection/PostSection";
import { Footer } from "@/components/layout/Footer/Footer";

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: category, isLoading: isLoadingCategory } = useCategoryBySlug(slug);
  const { data: posts, isLoading: isLoadingPosts } = usePostsByCategorySlug(slug);

  return (
    <>
      <div className="pt-24 pb-8 min-h-[70vh]">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {isLoadingCategory ? "Loading..." : category?.name || "Category"}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
          </div>

          <PostSection
            title={`Posts in ${category?.name || "this category"}`}
            posts={posts || []}
            isLoading={isLoadingPosts}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}