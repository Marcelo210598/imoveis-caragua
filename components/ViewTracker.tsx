"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Detect source from URL (utm_source, source, ref) or referrer
    const sourceParam =
      searchParams.get("utm_source") ||
      searchParams.get("source") ||
      searchParams.get("ref");

    const referrer = document.referrer;
    let source = sourceParam;

    if (!source && referrer) {
      if (referrer.includes("instagram")) source = "instagram";
      else if (referrer.includes("facebook")) source = "facebook";
      else if (referrer.includes("google")) source = "google";
      else if (referrer.includes(window.location.hostname)) source = "internal";
      else source = new URL(referrer).hostname;
    }

    // Fire-and-forget POST request to track view
    fetch(`/api/property/${encodeURIComponent(propertyId)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    }).catch(() => {
      // Silently fail — analytics should never block UX
    });
  }, [propertyId, searchParams]);

  return null;
}
