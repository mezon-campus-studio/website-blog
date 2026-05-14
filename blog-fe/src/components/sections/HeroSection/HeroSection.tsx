"use client";
import React from "react";
import styles from "./HeroSection.module.css";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Post } from "@/features/posts/types";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

interface HeroSectionProps {
  post?: Post;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

export const HeroSection = ({ post }: HeroSectionProps) => {
  // Optimized: Use centralized hook with caching
  const { data: authorProfile } = useUserProfile(post?.userId || '');

  if (!post) {
    return (
      <section className={`${styles.section} animate-pulse bg-muted/10 h-[500px]`}></section>
    );
  }

  const fallbackImage = "https://images.unsplash.com/photo-1492724441997-5dc865305da7";
  const imageUrl = post.thumbnailUrl || fallbackImage;
  const authorName = post.user?.name || authorProfile?.name || "Unknown Author";
  const authorAvatar = post.user?.avatar_url || authorProfile?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName);

  const plainTextContent = stripHtml(post.content || "");
  const excerpt = plainTextContent.length > 200 
    ? plainTextContent.substring(0, 200) + "..."
    : plainTextContent;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT COLUMN */}
        <div className={styles.content}>
          {/* Meta */}
          <div className={styles.meta}>
            <span className={styles.badge}>FEATURED INSIGHT</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className={styles.excerpt}>
            {excerpt}
          </p>

          {/* Author */}
          <Link href={`/users/${post.userId}`} className={`${styles.author} hover:opacity-80 transition-opacity`}>
            <Image
              src={authorAvatar}
              alt="Author avatar"
              width={48}
              height={48}
              className={styles.avatar}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{authorName}</span>
              <span className={styles.authorRole}>
                Author
              </span>
            </div>
          </Link>

          {/* Action */}
          <div className={styles.action}>
            <Link href={`/posts/${post.id}`}>
              <Button variant="primary">Read Full Article →</Button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt="Featured article visual"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  );
};