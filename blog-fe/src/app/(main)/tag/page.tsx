"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { useAllTags } from "@/features/tag/hooks/useTags";
import { TagFormDialog } from "@/features/tag/components/TagFormDialog";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Footer } from "@/components/layout/Footer/Footer";
import { Tag } from "@/features/tag/types";

export default function TagsPage() {
  const { data: tags, isLoading } = useAllTags();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | undefined>();

  function openCreate() {
    setSelectedTag(undefined);
    setDialogOpen(true);
  }

  function openEdit(e: React.MouseEvent, tag: Tag) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag(tag);
    setDialogOpen(true);
  }

  return (
    <>
      <div className="pt-24 pb-16 min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground">Explore Tags</h1>
            {isAdmin && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary
                           text-primary-foreground text-sm font-medium
                           hover:bg-primary/90 transition"
              >
                <Plus className="w-4 h-4" />
                Tạo tag
              </button>
            )}
          </div>

          {/* Tags */}
          {isLoading ? (
            <div className="flex flex-wrap gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-9 w-24 rounded-full bg-muted/60 animate-pulse" />
              ))}
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div key={tag.id} className="relative group">
                  <Link href={`/tag/${tag.id}`}>
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full
                                    border border-border/40 bg-card text-sm font-medium
                                    transition-all duration-200 hover:border-primary/50
                                    hover:bg-primary/5 hover:text-primary pr-8">
                      <span className="text-muted-foreground">#</span>
                      {tag.name}
                    </div>
                  </Link>

                  {/* Edit button — ADMIN only */}
                  {isAdmin && (
                    <button
                      onClick={(e) => openEdit(e, tag)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full z-10
                                 hover:bg-muted text-muted-foreground
                                 opacity-0 group-hover:opacity-100 transition"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Chưa có tag nào.{" "}
              {isAdmin && (
                <button onClick={openCreate} className="text-primary hover:underline">
                  Tạo tag đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <TagFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        tag={selectedTag}
      />
    </>
  );
}