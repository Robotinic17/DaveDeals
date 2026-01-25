import { useEffect, useState } from "react";
import { getCategoryImage, triggerDownloadOnce } from "../lib/unsplash";

export function useUnsplashImage(query, cacheKey) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!query || !cacheKey) {
        setImage(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const unsplashImage = await getCategoryImage(query, cacheKey);
      if (!active) return;

      if (unsplashImage) {
        setImage({
          url: unsplashImage.url,
          name: unsplashImage.name,
          userLink: unsplashImage.userLink,
          unsplashLink: unsplashImage.unsplashLink,
        });
        triggerDownloadOnce(unsplashImage);
      } else {
        setImage(null);
      }

      setLoading(false);
    }

    load();

    return () => {
      active = false;
    };
  }, [query, cacheKey]);

  return { image, loading };
}
