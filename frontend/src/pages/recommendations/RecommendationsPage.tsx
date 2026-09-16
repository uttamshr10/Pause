import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations } from "../../api/analyticsApi";

/* =========================================================
   TYPES
========================================================= */

type Recommendation = {
  content: string;
};

/* =========================================================
   PAGE
========================================================= */

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    const fetchRecommendations =
      async () => {
        try {
          const data =
            await getRecommendations();

          setRecommendations(data);
        } catch (err) {
          console.error(
            "Failed to load recommendations:",
            err
          );

          setError(
            "We couldn't load your recommendations right now."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchRecommendations();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Preparing your recommendations...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-5xl mx-auto space-y-9 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-purple-600 mb-2">
            Recommendations
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Small changes worth considering
          </h1>

          <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
            Based on your latest wellness
            signals, Pause suggests a few
            practical ways to support your
            sleep, stress, workload and
            recovery.
          </p>
        </div>

        <Link
          to="/check-in"
          className="shrink-0 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Update Check-in
        </Link>
      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {recommendations.length === 0 ? (
        <EmptyRecommendations />
      ) : (
        <>
          {/* =================================================
              INTRODUCTION
          ================================================= */}

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <SparkIcon />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Your wellness suggestions
                </h2>

                <p className="text-sm text-slate-500 leading-6 mt-1">
                  You have{" "}
                  <span className="font-semibold text-slate-700">
                    {recommendations.length}
                  </span>{" "}
                  {recommendations.length === 1
                    ? "suggestion"
                    : "suggestions"}{" "}
                  based on your latest check-in.
                  Start with whichever feels most
                  useful today.
                </p>
              </div>

              <div className="shrink-0 rounded-full bg-slate-50 border border-gray-100 px-4 py-2">
                <p className="text-xs font-semibold text-slate-600">
                  Latest check-in
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              RECOMMENDATIONS
          ================================================= */}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Recommended for you
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Practical guidance based on the
                wellness areas that currently
                stand out.
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.map(
                (recommendation, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={
                      recommendation
                    }
                    number={index + 1}
                  />
                )
              )}
            </div>
          </section>

          {/* =================================================
              ACTION PLAN CONNECTION
          ================================================= */}

          <section className="rounded-3xl bg-purple-50 border border-purple-100 p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Want concrete next steps?
                </p>

                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  Check your Recovery Action Plan
                </h2>

                <p className="text-sm text-slate-600 leading-6 mt-2">
                  Recommendations provide
                  guidance, while your Action Plan
                  turns current wellness signals
                  into specific tasks you can work
                  through.
                </p>
              </div>

              <Link
                to="/action-plan"
                className="shrink-0 inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
              >
                View Action Plan
              </Link>
            </div>
          </section>

          {/* =================================================
              CONTEXT
          ================================================= */}

          <section className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 text-slate-400 flex items-center justify-center shrink-0">
                <InfoIcon />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  About your recommendations
                </p>

                <p className="text-xs text-slate-500 leading-6 mt-1">
                  These suggestions respond to
                  wellness signals from your
                  check-in, such as sleep, stress,
                  workload, energy, focus and
                  recovery. They are intended to
                  support everyday wellness
                  awareness rather than provide
                  medical or clinical advice.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

/* =========================================================
   RECOMMENDATION CARD
========================================================= */

const RecommendationCard = ({
  recommendation,
  number,
}: {
  recommendation: Recommendation;
  number: number;
}) => {
  return (
    <article className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="flex">
        {/* Accent */}

        <div className="w-1.5 bg-purple-500 shrink-0" />

        <div className="flex-1 p-6 md:p-7">
          <div className="flex items-start gap-5">
            {/* Number */}

            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">
              {String(number).padStart(
                2,
                "0"
              )}
            </div>

            {/* Content */}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Wellness suggestion
              </p>

              <p className="text-[15px] text-slate-700 leading-7 mt-3">
                {recommendation.content}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />

                <p className="text-xs text-slate-400">
                  Based on your latest wellness
                  signals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyRecommendations = () => (
  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-14">
    <div className="max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5">
        <SparkIcon />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        No recommendations yet
      </h2>

      <p className="text-sm text-slate-500 leading-6 mt-3">
        Complete a daily check-in so Pause can
        identify relevant wellness signals and
        suggest practical next steps.
      </p>

      <Link
        to="/check-in"
        className="inline-flex mt-7 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
      >
        Complete Daily Check-in
      </Link>
    </div>
  </section>
);

/* =========================================================
   ICONS
========================================================= */

const SparkIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3Z" />
    <path d="m19 15-.75 2.25L16 18l2.25.75L19 21l.75-2.25L22 18l-2.25-.75L19 15Z" />
    <path d="m5 3-.75 2.25L2 6l2.25.75L5 9l.75-2.25L8 6l-2.25-.75L5 3Z" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
    />

    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default RecommendationsPage;