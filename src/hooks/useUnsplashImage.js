import { useState, useEffect } from 'react';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function useUnsplashImage(query) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!query || !ACCESS_KEY) return;

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${ACCESS_KEY}&per_page=1&orientation=landscape`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setImageUrl(data.results[0].urls.regular);
        }
      } catch (err) {
        console.error("Unsplash fetch failed", err);
      }
    };

    fetchImage();
  }, [query]);

  return imageUrl;
}