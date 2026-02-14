"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

// Replace with your actual AdSense publisher ID
const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "";

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!ADSENSE_PUB_ID || loaded.current) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      loaded.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  // Don't render if no AdSense ID configured
  if (!ADSENSE_PUB_ID) {
    return null;
  }

  return (
    <div className={`ad-container overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
