import { useEffect, useRef, useState } from "react";
import styles from "./ScrollHero.module.css";

const VIDEO_URL =
  "https://res.cloudinary.com/doxxgebme/video/upload/v1778063141/kling_20260506_%E4%BD%9C%E5%93%81_Cinematic__4679_0_qteaui.mp4";

export default function ScrollHero() {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setReady(true);
    video.addEventListener("loadedmetadata", onLoaded);
    video.play().catch(() => {});
    return () => video.removeEventListener("loadedmetadata", onLoaded);
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
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>Osun State · Nigeria</p>
        <h1 className={styles.heroTitle}>
          Shop local.
          <br />
          <em>Buy smart.</em>
        </h1>
        <p className={styles.heroSub}>
          The marketplace built for Ile-Ife and beyond.
        </p>
        <div className={styles.heroCtas}>
          <a href="/products" className={styles.ctaPrimary}>
            Shop now
          </a>
          <a href="/become-seller" className={styles.ctaSecondary}>
            Sell with us →
          </a>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>Scroll to explore</span>
        <span className={styles.scrollArrow}>↓</span>
      </div>
    </div>
  );
}
