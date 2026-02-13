"use client";

import { useEffect } from "react";

export default function ViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    // Fire-and-forget POST request to track view
    fetch(`/api/property/${encodeURIComponent(propertyId)}/view`, {
      method: "POST",
    }).catch(() => {
      // Silently fail — analytics should never block UX
    });
  }, [propertyId]);

  return null;
}
