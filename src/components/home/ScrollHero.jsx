import { useEffect, useRef, useState } from "react";
import styles from "./ScrollHero.module.css";

const VIDEO_URL =
  "https://res.cloudinary.com/doxxgebme/video/upload/v1778063141/kling_20260506_%E4%BD%9C%E5%93%81_Cinematic__4679_0_qteaui.mp4";

const HERO_IMAGES = ["/NOIMGAVAL.png", "/transhero.png"];

export default function ScrollHero() {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const [heroImage, setHeroImage] = useState(() => {
    const index = Math.floor(Math.random() * HERO_IMAGES.length);
    return HERO_IMAGES[index] || HERO_IMAGES[0];
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const handleReady = () => {
      if (!mounted) return;
      setReady(true);
    };

    // If metadata already loaded (e.g. remount), mark ready immediately
    if (video.readyState >= 1) {
      handleReady();
    } else {
      video.addEventListener("loadedmetadata", handleReady, { once: true });
      video.addEventListener("canplay", handleReady, { once: true });
    }

    // Ensure muted/playsInline before attempting play to improve autoplay reliability
    try {
      video.muted = true;
      video.playsInline = true;
      // attempt to play; ignore if blocked
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch (err) {
      // swallow — we'll still show the hero once ready
      console.warn("video play error", err);
    }

    return () => {
      mounted = false;
      try {
        video.pause();
      } catch (e) {
        /* ignore */
      }
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("canplay", handleReady);
    };
  }, []);

  useEffect(() => {
    // Hide the scroll indicator after the user scrolls or interacts
    function hide() {
      setShowIndicator(false);
      removeListeners();
    }

    function removeListeners() {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchstart", hide);
    }

    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("wheel", hide, { passive: true });
    window.addEventListener("touchstart", hide, { passive: true });

    // auto-hide after 6s in case user doesn't interact
    const t = setTimeout(() => setShowIndicator(false), 6000);
    return () => {
      clearTimeout(t);
      removeListeners();
    };
  }, []);

  return (
    <div className={styles.heroOuter}>
      <video
        ref={videoRef}
        className={styles.video}
        src={VIDEO_URL}
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity: ready ? 1 : 0 }}
      />
      <div className={styles.overlay} />
      <div className={styles.heroLayout}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Best deals from DaveDeals in ₦</p>
          <h1 className={styles.heroTitle}>
            Shopping and department store.
            <br />
            <em></em>
          </h1>
          <p className={styles.heroSub}>
            Shopping is a bit of a relaxing hobby for me, which is sometimes
            troubling for the bank balance.
          </p>

          <div className={styles.heroCtas}>
            <a href="/products" className={styles.ctaPrimary}>
              Shop Deals
            </a>
            <a href="/become-seller" className={styles.ctaSecondary}>
              Become a Seller
            </a>
          </div>

          <div className={styles.trustRow} aria-hidden>
            <span className={styles.trustItem}>✓ Secure payments</span>
            <span className={styles.trustItem}>✓ Fast delivery</span>
            <span className={styles.trustItem}>✓ Easy returns</span>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden>
          <img
            src={heroImage}
            alt=""
            className={styles.heroImage}
            loading="eager"
            onError={(event) => {
              if (event.currentTarget.src.includes("/transhero.png")) return;
              event.currentTarget.onerror = null;
              setHeroImage("/transhero.png");
            }}
          />
          <div className={styles.heroVisualMeta}>
            <span className={styles.heroVisualLabel}>Featured pick</span>
            <span className={styles.heroVisualName}>
              Best deals, one tap away
            </span>
          </div>
        </div>
      </div>
      {showIndicator && (
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll to explore</span>
          <span className={styles.scrollArrow}>↓</span>
        </div>
      )}
    </div>
  );
}
