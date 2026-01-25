import { useState } from "react";
import { Heart } from "lucide-react";
import styles from "./WeeklyPopular.module.css";
import RatingStars from "../category/RatingStars";
import headphonesImg from "../../assets/categories/headphone.jpg";
import duffelImg from "../../assets/bags.png";
import watchImg from "../../assets/gadgets.png";
import sneakersImg from "../../assets/categories/sneakers.png";
import techImg from "../../assets/categories/tech.png";
import handbagImg from "../../assets/categories/handbag.png";
import booksImg from "../../assets/categories/books.png";
import furnitureImg from "../../assets/categories/furniture.png";

const items = [
  {
    id: "gaming-headphone",
    name: "Gaming Headphone",
    price: 239,
    rating: 4.8,
    reviews: 121,
    description: "Table with air purifier, stained veneer/black",
    image: headphonesImg,
  },
  {
    id: "base-camp-duffel",
    name: "Base Camp Duffel M",
    price: 159,
    rating: 4.7,
    reviews: 121,
    description: "Table with air purifier, stained veneer/black",
    image: duffelImg,
  },
  {
    id: "tomford-watch",
    name: "Tomford Watch",
    price: 39,
    rating: 4.6,
    reviews: 121,
    description: "Table with air purifier, stained veneer/black",
    image: watchImg,
  },
  {
    id: "retro-sneakers",
    name: "Retro Sneakers",
    price: 89,
    rating: 4.5,
    reviews: 98,
    description: "Lightweight comfort with a clean finish",
    image: sneakersImg,
  },
  {
    id: "smart-speaker",
    name: "Smart Speaker",
    price: 129,
    rating: 4.6,
    reviews: 142,
    description: "Room-filling sound with deep bass",
    image: techImg,
  },
  {
    id: "urban-handbag",
    name: "Urban Handbag",
    price: 149,
    rating: 4.7,
    reviews: 88,
    description: "Soft leather feel with ample storage",
    image: handbagImg,
  },
  {
    id: "hardcover-set",
    name: "Hardcover Set",
    price: 59,
    rating: 4.4,
    reviews: 75,
    description: "Curated reads for your coffee table",
    image: booksImg,
  },
  {
    id: "accent-chair",
    name: "Accent Chair",
    price: 199,
    rating: 4.6,
    reviews: 64,
    description: "Modern lines with plush comfort",
    image: furnitureImg,
  },
];

export default function WeeklyPopular() {
  const [liked, setLiked] = useState(() => new Set());

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Weekly Popular Products</h2>
      </div>

      <div className={styles.scroller} role="list">
        {items.map((item) => (
          <article key={item.id} className={styles.card} role="listitem">
            <button
              type="button"
              className={`${styles.heartBtn} ${
                liked.has(item.id) ? styles.hearted : ""
              }`}
              onClick={() => toggleLike(item.id)}
              aria-label="Favorite"
            >
              <Heart size={18} />
            </button>

            <div className={styles.media}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/fallback-product.png";
                }}
              />
            </div>

            <div className={styles.body}>
              <div className={styles.row}>
                <h3 className={styles.name}>{item.name}</h3>
                <span className={styles.price}>${item.price.toFixed(2)}</span>
              </div>
              <p className={styles.desc}>{item.description}</p>
              <div className={styles.ratingRow}>
                <RatingStars value={item.rating} />
                <span className={styles.reviewText}>({item.reviews})</span>
              </div>
              <button type="button" className={styles.addBtn}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
