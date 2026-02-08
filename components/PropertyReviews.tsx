"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string | null; phone: string };
};

type PropertyReviewsProps = {
  propertyId: string;
};

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?propertyId=${propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(data.totalReviews || 0);

        // Verificar se usuário já avaliou
        if (session?.user?.id) {
          const myReview = data.reviews?.find(
            (r: Review) => r.user.id === session.user.id,
          );
          if (myReview) {
            setMyRating(myReview.rating);
            setMyComment(myReview.comment || "");
          }
        }
        setLoading(false);
      });
  }, [propertyId, session]);

  const handleSubmit = async () => {
    if (!myRating || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          rating: myRating,
          comment: myComment || undefined,
        }),
      });

      if (res.ok) {
        // Recarregar reviews
        const updated = await fetch(`/api/reviews?propertyId=${propertyId}`);
        const data = await updated.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-xl" />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Avaliações</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} readonly size="sm" />
          <span className="text-sm text-gray-500">
            {avgRating.toFixed(1)} ({totalReviews})
          </span>
        </div>
      </div>

      {/* Formulário de avaliação */}
      {session?.user && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <p className="text-sm text-gray-500 mb-2">Sua avaliação:</p>
          <div className="flex items-center gap-4 mb-3">
            <StarRating rating={myRating} onChange={setMyRating} size="lg" />
          </div>
          <textarea
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Deixe um comentário (opcional)"
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!myRating || submitting}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Enviando..."
              : myRating
                ? "Avaliar"
                : "Selecione as estrelas"}
          </button>
        </div>
      )}

      {/* Lista de reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhuma avaliação ainda. Seja o primeiro!
          </p>
        ) : (
          reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">
                  {review.user.name || review.user.phone.slice(0, 8) + "..."}
                </span>
                <StarRating rating={review.rating} readonly size="sm" />
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {review.comment}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
