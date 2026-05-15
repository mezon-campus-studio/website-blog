<<<<<<< HEAD
"use client";
import React from "react";
=======
>>>>>>> mezon/dev-fe
import Image from "next/image";
import Link from "next/link";
import styles from "./ArticleCard.module.css";
import { Post } from "@/features/posts/types";
<<<<<<< HEAD
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
=======
>>>>>>> mezon/dev-fe

interface ArticleCardProps {
  post: Post;
}

// Simple helper to strip HTML tags for the excerpt
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export const ArticleCard = ({ post }: ArticleCardProps) => {
<<<<<<< HEAD
  // Optimized: Use centralized hook with caching
  const { data: authorProfile } = useUserProfile(post?.userId || '');

=======
>>>>>>> mezon/dev-fe
  const fallbackImage = "https://images.unsplash.com/photo-1492724441997-5dc865305da7";
  const imageUrl = post.thumbnailUrl || fallbackImage;
  const categoryName = post.category?.name || "Uncategorized";
  
<<<<<<< HEAD
  const authorName = post.user?.name || authorProfile?.name || "Unknown";
  const authorAvatar = post.user?.avatar_url || authorProfile?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName);

=======
>>>>>>> mezon/dev-fe
  const plainTextContent = stripHtml(post.content || "");
  const excerpt = plainTextContent.length > 120 
    ? plainTextContent.substring(0, 120) + "..."
    : plainTextContent;
<<<<<<< HEAD

=======
    
>>>>>>> mezon/dev-fe
  const wordCount = plainTextContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
<<<<<<< HEAD
    <div className={styles.card}>
      <article className="flex flex-col h-full">
        <Link href={`/posts/${post.id}`} className="flex-grow">
          {/* Image */}
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className={styles.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <span className={styles.badge}>{categoryName}</span>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Meta */}
            <div className={styles.meta}>
              <span>{readTime}</span>
              <span className={styles.dot}>•</span>
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>

            {/* Title */}
            <h3 className={styles.title}>{post.title}</h3>

            {/* Excerpt */}
            <p className={styles.excerpt}>{excerpt}</p>
          </div>
        </Link>

        {/* Author */}
        <div className="px-6 pb-6 mt-auto">
          <Link href={`/users/${post.userId}`} className={`${styles.author} hover:opacity-80 transition-opacity`}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={authorAvatar}
                alt={authorName}
=======
    <Link href={`/posts/${post.id}`} className={styles.card}>
      <article>
        {/* Image */}
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className={styles.badge}>{categoryName}</span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Meta */}
          <div className={styles.meta}>
            <span>{readTime}</span>
            <span className={styles.dot}>•</span>
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>

          {/* Title */}
          <h3 className={styles.title}>{post.title}</h3>

          {/* Excerpt */}
          <p className={styles.excerpt}>{excerpt}</p>

          {/* Author */}
          <div className={styles.author}>
            <div className={styles.avatarWrapper}>
              <Image 
                src={post.user?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.user?.name || 'U')}
                alt={post.user?.name || 'Author'}
>>>>>>> mezon/dev-fe
                width={24}
                height={24}
                className={styles.avatar}
              />
            </div>
<<<<<<< HEAD
            <span className={styles.authorName}>{authorName}</span>
          </Link>
        </div>
      </article>
    </div>
=======
            <span className={styles.authorName}>{post.user?.name || 'Unknown'}</span>
          </div>
        </div>
      </article>
    </Link>
>>>>>>> mezon/dev-fe
  );
};