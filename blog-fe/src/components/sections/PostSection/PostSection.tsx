import styles from "./PostSection.module.css";
import { ArticleCard } from "@/components/cards/ArticleCard/ArticleCard";
import { Button } from "@/components/ui";
import { Post } from "@/features/posts/types";

interface PostSectionProps {
  title: string;
  posts: Post[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  onLoadMore?: () => void;
}

export const PostSection = ({ title, posts, isLoading, isFetchingMore, onLoadMore }: PostSectionProps) => {
  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>{title}</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
          Loading posts...
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>{title}</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No posts found.
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      {/* Header */}
      <h2 className={styles.title}>{title}</h2>

      {/* Grid */}
      <div className={styles.grid}>
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {/* Footer */}
      {onLoadMore && (
        <div className={styles.footer}>
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? "Unfolding more stories..." : "Load More Archive Entries"}
          </Button>
        </div>
      )}
    </section>
  );
};