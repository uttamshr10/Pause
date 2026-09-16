import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAchievements } from "../../api/analyticsApi";

/* =========================================================
   TYPES
========================================================= */

type Achievement = {
  title: string;
  description: string;
  icon?: string;
  rarity?: string;
  status: "unlocked" | "locked";
  progress: number;
  target: number;
  remaining: number;
};

type AchievementData = {
  total_unlocked: number;
  total_possible: number;
  achievements: Achievement[];
};

/* =========================================================
   PAGE
========================================================= */

const AchievementsPage = () => {
  const [data, setData] =
    useState<AchievementData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const result =
          await getAchievements();

        setData(result);
      } catch (err) {
        console.error(
          "Failed to load achievements:",
          err
        );

        setError(
          "We couldn't load your achievements right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const achievements =
    data?.achievements ?? [];

  const unlockedAchievements =
    useMemo(
      () =>
        achievements.filter(
          (item) =>
            item.status === "unlocked"
        ),
      [achievements]
    );

  const lockedAchievements =
    useMemo(
      () =>
        achievements.filter(
          (item) =>
            item.status !== "unlocked"
        ),
      [achievements]
    );

  /*
   * Sort locked achievements by completion percentage.
   * This lets us surface milestones the user is
   * genuinely closest to unlocking.
   */
  const nextAchievements =
    useMemo(() => {
      return [...lockedAchievements]
        .sort(
          (a, b) =>
            getAchievementProgress(b) -
            getAchievementProgress(a)
        )
        .slice(0, 3);
    }, [lockedAchievements]);

  const totalUnlocked =
    data?.total_unlocked ??
    unlockedAchievements.length;

  const totalPossible =
    data?.total_possible ??
    achievements.length;

  const overallProgress =
    totalPossible > 0
      ? Math.round(
          (totalUnlocked /
            totalPossible) *
            100
        )
      : 0;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your milestones...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-purple-600 mb-2">
            Achievements
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Your wellness milestones
          </h1>

          <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
            See the habits and milestones
            you've built through consistent
            check-ins, reflection, recovery
            and everyday wellness routines.
          </p>
        </div>

        <Link
          to="/check-in"
          className="shrink-0 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Daily Check-in
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

      {achievements.length === 0 ? (
        <EmptyAchievements />
      ) : (
        <>
          {/* =================================================
              OVERALL PROGRESS
          ================================================= */}

          <section className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-12">
              {/* Main progress */}

              <div className="lg:col-span-8 p-7 md:p-8 text-white">
                <p className="text-sm text-purple-100">
                  Milestone Progress
                </p>

                <div className="flex flex-wrap items-end gap-3 mt-2">
                  <h2 className="text-4xl md:text-5xl font-bold">
                    {totalUnlocked}
                  </h2>

                  <p className="text-purple-100 pb-1">
                    of {totalPossible} unlocked
                  </p>
                </div>

                <p className="text-sm text-purple-100 leading-6 mt-4 max-w-xl">
                  {getProgressMessage(
                    totalUnlocked,
                    totalPossible
                  )}
                </p>

                {/* Overall bar */}

                <div className="mt-7">
                  <div className="flex items-center justify-between text-xs text-purple-100 mb-2">
                    <span>
                      Overall progress
                    </span>

                    <span className="font-semibold text-white">
                      {overallProgress}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          overallProgress,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}

              <div className="lg:col-span-4 bg-white/10 border-t lg:border-t-0 lg:border-l border-white/10 p-7 md:p-8">
                <p className="text-xs font-semibold text-purple-100 uppercase tracking-wide">
                  Your Collection
                </p>

                <div className="space-y-5 mt-6">
                  <SummaryRow
                    label="Unlocked"
                    value={totalUnlocked}
                  />

                  <SummaryRow
                    label="Still ahead"
                    value={Math.max(
                      totalPossible -
                        totalUnlocked,
                      0
                    )}
                  />

                  <SummaryRow
                    label="Total milestones"
                    value={totalPossible}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              NEXT MILESTONES
          ================================================= */}

          {nextAchievements.length >
            0 && (
            <section>
              <SectionHeader
                title="You're getting close"
                description="These are the milestones currently nearest to completion."
              />

              <div className="grid md:grid-cols-3 gap-4">
                {nextAchievements.map(
                  (achievement, index) => (
                    <NextAchievementCard
                      key={`${achievement.title}-${index}`}
                      achievement={
                        achievement
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
              UNLOCKED
          ================================================= */}

          <section>
            <SectionHeader
              title="Unlocked milestones"
              description="A record of the wellness habits and routines you've already built."
              count={
                unlockedAchievements.length
              }
            />

            {unlockedAchievements.length >
            0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {unlockedAchievements.map(
                  (achievement, index) => (
                    <UnlockedAchievementCard
                      key={`${achievement.title}-${index}`}
                      achievement={
                        achievement
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8">
                <p className="text-sm text-slate-500">
                  Your first milestone is
                  still ahead. Keep checking
                  in to start building your
                  achievement history.
                </p>
              </div>
            )}
          </section>

          {/* =================================================
              LOCKED / IN PROGRESS
          ================================================= */}

          {lockedAchievements.length >
            0 && (
            <section>
              <SectionHeader
                title="Milestones ahead"
                description="Keep building your routines to make progress toward these achievements."
                count={
                  lockedAchievements.length
                }
              />

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {lockedAchievements.map(
                  (achievement, index) => (
                    <LockedAchievementRow
                      key={`${achievement.title}-${index}`}
                      achievement={
                        achievement
                      }
                      isLast={
                        index ===
                        lockedAchievements.length -
                          1
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
              EXPLANATION
          ================================================= */}

          <section className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 text-slate-400 flex items-center justify-center shrink-0">
                <InfoIcon />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  How milestones work
                </p>

                <p className="text-xs text-slate-500 leading-6 mt-1">
                  Achievements reflect
                  milestones reached through
                  your recorded check-ins and
                  wellness habits. Progress
                  updates as your wellness
                  history grows.
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
   NEXT ACHIEVEMENT
========================================================= */

const NextAchievementCard = ({
  achievement,
}: {
  achievement: Achievement;
}) => {
  const progress =
    getAchievementProgress(
      achievement
    );

  return (
    <article className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-xl flex items-center justify-center">
          {achievement.icon || "🏆"}
        </div>

        <span className="text-xs font-bold text-purple-600">
          {progress}%
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-900 mt-5">
        {achievement.title}
      </h3>

      <p className="text-sm text-slate-500 leading-6 mt-2">
        {achievement.description}
      </p>

      <div className="mt-5">
        <div className="h-2 bg-purple-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="flex justify-between gap-3 mt-3">
          <p className="text-xs text-slate-400">
            {achievement.progress}/
            {achievement.target}
          </p>

          <p className="text-xs font-semibold text-purple-600">
            {getRemainingText(
              achievement.remaining
            )}
          </p>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   UNLOCKED CARD
========================================================= */

const UnlockedAchievementCard = ({
  achievement,
}: {
  achievement: Achievement;
}) => (
  <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-2xl flex items-center justify-center">
        {achievement.icon || "🏆"}
      </div>

      <div className="flex items-center gap-2">
        {achievement.rarity && (
          <RarityBadge
            rarity={
              achievement.rarity
            }
          />
        )}

        <span className="rounded-full bg-green-50 border border-green-100 px-3 py-1 text-[10px] font-semibold text-green-700">
          Unlocked
        </span>
      </div>
    </div>

    <h3 className="text-lg font-bold text-slate-900 mt-5">
      {achievement.title}
    </h3>

    <p className="text-sm text-slate-500 leading-6 mt-2">
      {achievement.description}
    </p>

    <div className="mt-5 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <CheckIcon />
        </div>

        <p className="text-xs font-semibold text-green-700">
          Milestone completed
        </p>
      </div>
    </div>
  </article>
);

/* =========================================================
   LOCKED ROW
========================================================= */

const LockedAchievementRow = ({
  achievement,
  isLast,
}: {
  achievement: Achievement;
  isLast: boolean;
}) => {
  const progress =
    getAchievementProgress(
      achievement
    );

  return (
    <article
      className={`p-6 ${
        !isLast
          ? "border-b border-gray-100"
          : ""
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-5">
        {/* Icon */}

        <div className="w-11 h-11 rounded-2xl bg-slate-100 text-xl grayscale flex items-center justify-center shrink-0 opacity-70">
          {achievement.icon || "🏆"}
        </div>

        {/* Content */}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">
              {achievement.title}
            </h3>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              In progress
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-5 mt-1.5 max-w-2xl">
            {achievement.description}
          </p>
        </div>

        {/* Progress */}

        <div className="w-full md:w-64 shrink-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="text-xs text-slate-400">
              {achievement.progress}/
              {achievement.target}
            </p>

            <p className="text-xs font-semibold text-slate-600">
              {progress}%
            </p>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2 text-right">
            {getRemainingText(
              achievement.remaining
            )}
          </p>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count?: number;
}) => (
  <div className="flex items-end justify-between gap-4 mb-5">
    <div>
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>
    </div>

    {typeof count === "number" && (
      <span className="shrink-0 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-slate-500">
        {count}
      </span>
    )}
  </div>
);

/* =========================================================
   SUMMARY ROW
========================================================= */

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="flex items-center justify-between gap-5">
    <p className="text-sm text-purple-100">
      {label}
    </p>

    <p className="text-lg font-bold text-white">
      {value}
    </p>
  </div>
);

/* =========================================================
   RARITY
========================================================= */

const RarityBadge = ({
  rarity,
}: {
  rarity: string;
}) => {
  const normalized =
    rarity.toLowerCase();

  const style =
    normalized === "legendary"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : normalized === "rare"
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : "bg-slate-50 text-slate-500 border-slate-100";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${style}`}
    >
      {rarity}
    </span>
  );
};

/* =========================================================
   EMPTY
========================================================= */

const EmptyAchievements = () => (
  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-14">
    <div className="max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5">
        <TrophyIcon />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        Your first milestone is ahead
      </h2>

      <p className="text-sm text-slate-500 leading-6 mt-3">
        Start with a daily check-in.
        Your milestones will build as
        you continue recording your
        wellness habits.
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
   HELPERS
========================================================= */

const getAchievementProgress = (
  achievement: Achievement
) => {
  if (
    !achievement.target ||
    achievement.target <= 0
  ) {
    return achievement.status ===
      "unlocked"
      ? 100
      : 0;
  }

  return Math.min(
    Math.round(
      (achievement.progress /
        achievement.target) *
        100
    ),
    100
  );
};

const getRemainingText = (
  remaining: number
) => {
  if (remaining <= 0) {
    return "Ready to unlock";
  }

  return `${remaining} more to unlock`;
};

const getProgressMessage = (
  unlocked: number,
  total: number
) => {
  if (total <= 0) {
    return "Your wellness milestones will appear here as your history grows.";
  }

  if (unlocked === total) {
    return "You've reached every currently available wellness milestone.";
  }

  if (unlocked === 0) {
    return "Your milestone journey is just getting started. Small, consistent check-ins will begin building progress.";
  }

  const percentage =
    (unlocked / total) * 100;

  if (percentage >= 75) {
    return "You've built a strong collection of wellness milestones, with only a few still ahead.";
  }

  if (percentage >= 40) {
    return "Your wellness history is building steadily. Keep the routines that are helping you make progress.";
  }

  return "You're building momentum. Each check-in and healthy routine contributes to your milestone progress.";
};

/* =========================================================
   ICONS
========================================================= */

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const TrophyIcon = () => (
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
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v1a4 4 0 0 0 4 4" />
    <path d="M17 6h3v1a4 4 0 0 1-4 4" />
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

export default AchievementsPage;