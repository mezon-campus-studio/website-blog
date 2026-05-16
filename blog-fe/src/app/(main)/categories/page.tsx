"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { useAllCategories } from "@/features/category/hooks/useCategories";
import { CategoryFormDialog } from "@/features/category/components/CategoryFormDialog";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Footer } from "@/components/layout/Footer/Footer";
import { Category } from "@/features/category/types";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useAllCategories();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  function openCreate() {
    setSelectedCategory(undefined);
    setDialogOpen(true);
  }

  function openEdit(e: React.MouseEvent, cat: Category) {
    e.preventDefault(); // chặn Link navigate
    e.stopPropagation();
    setSelectedCategory(cat);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="pt-24 pb-16 min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground">Explore Categories</h1>
            {isAdmin && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary
                           text-primary-foreground text-sm font-medium
                           hover:bg-primary/90 transition"
              >
                <Plus className="w-4 h-4" />
                Tạo danh mục
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-muted/60 animate-pulse" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                // relative + group trên wrapper, KHÔNG phải Link
                <div key={category.id} className="relative group">
                  <Link href={`/category/${category.slug}`}>
                    <div className="p-6 rounded-xl border border-border/40 bg-card
                                    transition-all duration-200
                                    hover:border-primary/50 hover:shadow-md hover:-translate-y-1">
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors pr-8">
                        {category.name}
                      </h2>
                      {category.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Edit button — ADMIN only, nằm ngoài Link */}
                  {isAdmin && (
                    <button
                      onClick={(e) => openEdit(e, category)}
                      className="absolute top-3 right-3 p-1.5 rounded-md z-10
                                 bg-muted hover:bg-accent text-muted-foreground
                                 opacity-0 group-hover:opacity-100 transition"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              Chưa có danh mục nào.{" "}
              {isAdmin && (
                <button onClick={openCreate} className="text-primary hover:underline">
                  Tạo danh mục đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Dialog dùng chung Create / Edit / Delete */}
      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={selectedCategory}
      />
    </>
  );
}