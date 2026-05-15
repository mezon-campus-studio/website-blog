"use client";

import { use } from "react";
import { useTagById, usePostsByTagId } from "@/features/tag/hooks/useTags";
import { PostSection } from "@/components/sections/PostSection/PostSection";
import { Footer } from "@/components/layout/Footer/Footer";

export default function TagDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: tag, isLoading: isLoadingTag } = useTagById(id);
    const { data: posts, isLoading: isLoadingPosts } = usePostsByTagId(id);

    return (
        <>
            <div className="pt-24 pb-8 min-h-[70vh]">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            {isLoadingTag ? "Loading..." : (
                                <><span className="text-muted-foreground">#</span>{tag?.name || "Tag"}</>
                            )}
                        </h1>
                        {tag?.description && (
                            <p className="text-muted-foreground">{tag.description}</p>
                        )}
                    </div>

                    <PostSection
                        title={`Posts tagged "${tag?.name || ""}"`}
                        posts={posts || []}
                        isLoading={isLoadingPosts}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}