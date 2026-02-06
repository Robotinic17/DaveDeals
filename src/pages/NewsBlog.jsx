import { Link } from "react-router-dom";
import styles from "./NewsBlog.module.css";
import { blogPosts, featuredList, recentPosts } from "../data/blogPosts";

function FeaturedCard({ post }) {
  return (
    <article className={styles.featuredCard}>
      <img src={post.image} alt={post.title} />
      <div className={styles.featuredOverlay}>
        <span className={styles.categoryChip}>{post.category}</span>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <Link className={styles.readMore} to={`/news/${post.slug}`}>
          Read story
        </Link>
      </div>
    </article>
  );
}

function FeaturedListItem({ post }) {
  return (
    <Link className={styles.featuredItem} to={`/news/${post.slug}`}>
      <img src={post.image} alt={post.title} />
      <div>
        <p className={styles.featuredTitle}>{post.title}</p>
        <p className={styles.featuredMeta}>
          {post.author} · {post.readTime}
        </p>
      </div>
    </Link>
  );
}

function RecentCard({ post }) {
  return (
    <article className={styles.recentCard}>
      <Link to={`/news/${post.slug}`} className={styles.recentImage}>
        <img src={post.image} alt={post.title} />
      </Link>
      <div className={styles.recentBody}>
        <span className={styles.categoryPill}>{post.category}</span>
        <h3>
          <Link to={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <div className={styles.recentFooter}>
          <span>{post.author}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

export default function NewsBlog() {
  const featured = featuredList[0] || blogPosts[0];
  const secondary = blogPosts.filter((post) => post.id !== featured.id).slice(0, 5);

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <FeaturedCard post={featured} />
        </div>
        <aside className={styles.heroRight}>
          <h4>Other featured posts</h4>
          <div className={styles.featuredList}>
            {secondary.map((post) => (
              <FeaturedListItem key={post.id} post={post} />
            ))}
          </div>
        </aside>
      </div>

      <div className={styles.recentHeader}>
        <h2>Recent Posts</h2>
        <button type="button" className={styles.allBtn}>
          All Posts
        </button>
      </div>

      <div className={styles.recentGrid}>
        {recentPosts.slice(0, 6).map((post) => (
          <RecentCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
