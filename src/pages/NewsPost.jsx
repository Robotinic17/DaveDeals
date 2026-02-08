import { Link, useParams } from "react-router-dom";
import styles from "./NewsPost.module.css";
import { blogPosts } from "../data/blogPosts";

export default function NewsPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className={styles.page}>
        <div className={styles.empty}>
          <h2>Post not found</h2>
          <p>The story you are looking for does not exist yet.</p>
          <Link to="/news" className={styles.backBtn}>
            Back to News
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Link to="/news" className={styles.backLink}>
        ? Back to News
      </Link>

      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.category}>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className={styles.meta}>
            <span>{post.author}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
        </div>
        <div className={styles.heroMedia}>
          <img src={post.image} alt={post.title} decoding="async" />
        </div>
      </div>

      <article className={styles.body}>
        {post.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </section>
  );
}

