import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInsight } from "../../api/insightApi";
import {
  getWeeklyTrend,
  getWeeklyReport,
  getStreak,
  getRecoveryProgress,
  getActionPlans,
} from "../../api/analyticsApi";
import { getUserProfile } from "../../api/userApi";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

/* =========================================================
   TYPES
========================================================= */

type TrendItem = {
  date: string;
  burnout_score: number;
  mood?: number;
};

type WeeklyReport = {
  average_burnout: number;
  average_stress: number;
  average_sleep: number;
  average_energy: number;
  average_recovery: number;
  average_focus?: number;
  average_workload?: number;
  summary: string[];
};

type StreakData = {
  current_streak: number;
};

type UserProfile = {
  sleep_goal?: number;
  recovery_goal?: number;
};

type RecoveryProgress = {
  completion_rate: number;
  completed_actions: number;
  total_actions: number;
};

type ActionPlan = {
  id: number | string;
  title: string;
  description: string;
  is_completed: boolean;
};

/* =========================================================
   PAGE
========================================================= */

const DashboardPage = () => {
  const username =
    localStorage.getItem("username") || "User";

  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [insight, setInsight] = useState("");
  const [weeklyReport, setWeeklyReport] =
    useState<WeeklyReport | null>(null);
  const [streak, setStreak] =
    useState<StreakData | null>(null);
  const [profile, setProfile] =
    useState<UserProfile | null>(null);
  const [recoveryProgress, setRecoveryProgress] =
    useState<RecoveryProgress | null>(null);
  const [actionPlans, setActionPlans] =
    useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const results = await Promise.allSettled([
        getWeeklyTrend(),
        getWeeklyReport(),
        getInsight(),
        getStreak(),
        getUserProfile(),
        getRecoveryProgress(),
        getActionPlans(),
      ]);

      if (results[0].status === "fulfilled") {
        setTrendData(results[0].value);
      }

      if (results[1].status === "fulfilled") {
        setWeeklyReport(results[1].value);
      }

      if (results[2].status === "fulfilled") {
        setInsight(
          results[2].value?.insight || ""
        );
      }

      if (results[3].status === "fulfilled") {
        setStreak(results[3].value);
      }

      if (results[4].status === "fulfilled") {
        setProfile(results[4].value);
      }

      if (results[5].status === "fulfilled") {
        setRecoveryProgress(results[5].value);
      }

      if (results[6].status === "fulfilled") {
        setActionPlans(results[6].value);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your wellness overview...
          </p>
        </div>
      </div>
    );
  }

  const latest =
    trendData.length > 0
      ? trendData[trendData.length - 1]
      : null;

  const previous =
    trendData.length > 1
      ? trendData[trendData.length - 2]
      : null;

  const currentBurnout =
    latest?.burnout_score ?? null;

  const currentMood =
    latest?.mood ?? null;

  const burnoutChange =
    latest && previous
      ? Number(
          (
            latest.burnout_score -
            previous.burnout_score
          ).toFixed(1)
        )
      : null;

  const getWeeklyRisk = () => {
    if (!weeklyReport) return null;

    const score =
      weeklyReport.average_burnout;

    if (score <= 30) return "Low";
    if (score <= 60) return "Moderate";
    if (score <= 80) return "High";

    return "Critical";
  };

  const weeklyRisk = getWeeklyRisk();

  const getBurnoutMessage = () => {
    if (currentBurnout === null) {
      return "Submit a check-in to start building your wellness overview.";
    }

    if (currentBurnout <= 30) {
      return "Your latest burnout score is within the low range.";
    }

    if (currentBurnout <= 60) {
      return "Your latest burnout score suggests some wellness signals need attention.";
    }

    if (currentBurnout <= 80) {
      return "Your latest burnout score is elevated. Prioritize recovery and workload balance.";
    }

    return "Your latest burnout score is very high. Give recovery and workload management immediate attention.";
  };

  return (
    <div className="space-y-10">
      {/* =====================================================
          COMPACT PAGE HEADER
      ===================================================== */}

      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-purple-600 mb-1">
            Welcome back
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Hi {username}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Here&apos;s what matters most for your wellness today.
          </p>
        </div>

        <Link
          to="/check-in"
          className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm"
        >
          Daily Check-in
        </Link>
      </section>

      {/* =====================================================
          CURRENT WELLNESS
      ===================================================== */}

      <section>
        <SectionHeader
          title="Current Wellness"
          description="Your latest check-in and recent wellness context."
        />

        <div className="grid xl:grid-cols-12 gap-5">
          {/* Primary card */}
          <div className="xl:col-span-6 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-500 text-white p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-purple-100">
                  Latest Burnout Score
                </p>

                <div className="flex items-end gap-2 mt-3">
                  <span className="text-5xl font-bold">
                    {currentBurnout ?? "--"}
                  </span>

                  {currentBurnout !== null && (
                    <span className="text-purple-200 mb-1">
                      /100
                    </span>
                  )}
                </div>
              </div>

              {weeklyRisk && (
                <div className="bg-white/15 border border-white/20 rounded-full px-4 py-2">
                  <p className="text-xs font-semibold">
                    {weeklyRisk} weekly risk
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-purple-100 leading-6 mt-6 max-w-xl">
              {getBurnoutMessage()}
            </p>

            {burnoutChange !== null && (
              <div className="mt-6 pt-5 border-t border-white/20">
                <p className="text-xs text-purple-200">
                  Since your previous check-in
                </p>

                <p className="text-sm font-semibold mt-1">
                  {burnoutChange === 0
                    ? "No change"
                    : burnoutChange > 0
                    ? `Up ${burnoutChange} points`
                    : `Down ${Math.abs(
                        burnoutChange
                      )} points`}
                </p>
              </div>
            )}
          </div>

          {/* Mood */}
          <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Latest Mood
              </p>

              <div className="flex items-end gap-1 mt-3">
                <h2 className="text-4xl font-bold text-slate-900">
                  {currentMood ?? "--"}
                </h2>

                {currentMood !== null && (
                  <span className="text-sm text-slate-400 mb-1">
                    /10
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-6">
              From your latest check-in
            </p>
          </div>

          {/* Streak */}
          <div className="xl:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Check-in Streak
              </p>

              <h2 className="text-4xl font-bold text-slate-900 mt-3">
                {streak?.current_streak ?? 0}
              </h2>

              <p className="text-sm font-medium text-purple-600 mt-1">
                days
              </p>
            </div>

            <p className="text-xs text-slate-400 mt-6">
              Keep building your wellness history
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          TODAY'S FOCUS
      ===================================================== */}

      <section>
        <SectionHeader
          title="Today's Focus"
          description="Turn your wellness data into small recovery actions."
        />

        <TodayFocusCard
          plans={actionPlans}
          recoveryProgress={recoveryProgress}
        />
      </section>

      {/* =====================================================
          YOUR WEEK
      ===================================================== */}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Week
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              The bigger picture from your recent check-ins.
            </p>
          </div>

          <Link
            to="/reports"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            View full report →
          </Link>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Trend */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Burnout Trend
                </p>

                <h3 className="text-lg font-bold text-slate-900">
                  Last 7 days
                </h3>
              </div>

              {weeklyReport && (
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Weekly average
                  </p>

                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {weeklyReport.average_burnout}
                  </p>
                </div>
              )}
            </div>

            {trendData.length === 0 ? (
              <EmptyState message="Submit check-ins to build your burnout trend." />
            ) : (
              <div className="h-72">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="burnoutGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#7C3AED"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="95%"
                          stopColor="#7C3AED"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />

                    <XAxis
                      dataKey="date"
                      interval={0}
                      tick={{
                        fontSize: 11,
                        fill: "#64748B",
                      }}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fontSize: 12,
                        fill: "#64748B",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="burnout_score"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      fill="url(#burnoutGradient)"
                      dot={{
                        r: 4,
                        fill: "#7C3AED",
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Insight */}
          <WeeklyInsightCard
            insight={insight}
            weeklyReport={weeklyReport}
          />
        </div>
      </section>

      {/* =====================================================
          GOALS
      ===================================================== */}

      <section>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Goals
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Keep an eye on the habits that support recovery.
            </p>
          </div>

          <Link
            to="/settings/goals"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            Edit goals →
          </Link>
        </div>

        <GoalCard
          weeklyReport={weeklyReport}
          profile={profile}
        />
      </section>
    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-5">
    <h2 className="text-xl font-bold text-slate-900">
      {title}
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      {description}
    </p>
  </div>
);

/* =========================================================
   TODAY'S FOCUS
========================================================= */

const TodayFocusCard = ({
  plans,
  recoveryProgress,
}: {
  plans: ActionPlan[];
  recoveryProgress: RecoveryProgress | null;
}) => {
  const latestPlans = plans.slice(0, 3);

  const completionRate =
    recoveryProgress?.completion_rate ?? 0;

  const safeRate = Math.min(
    Math.max(completionRate, 0),
    100
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid lg:grid-cols-12">
        {/* Progress */}
        <div className="lg:col-span-4 p-7 bg-slate-50 border-b lg:border-b-0 lg:border-r border-gray-100">
          <p className="text-sm font-medium text-purple-600">
            Recovery Progress
          </p>

          <div className="flex items-end gap-2 mt-3">
            <h3 className="text-4xl font-bold text-slate-900">
              {completionRate}%
            </h3>

            <span className="text-xs text-slate-400 mb-1">
              completed
            </span>
          </div>

          <div className="h-2 bg-white rounded-full overflow-hidden mt-5">
            <div
              className="h-full bg-purple-600 rounded-full"
              style={{
                width: `${safeRate}%`,
              }}
            />
          </div>

          <p className="text-sm text-slate-500 mt-4 leading-6">
            {recoveryProgress?.completed_actions ?? 0} of{" "}
            {recoveryProgress?.total_actions ?? 0} recovery
            actions completed.
          </p>
        </div>

        {/* Actions */}
        <div className="lg:col-span-8 p-7">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">
                Action Plan
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                What to focus on today
              </h3>
            </div>

            <Link
              to="/action-plan"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 shrink-0"
            >
              View all →
            </Link>
          </div>

          {latestPlans.length === 0 ? (
            <EmptyState message="Submit today's check-in to generate recovery actions." />
          ) : (
            <div className="space-y-3">
              {latestPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4"
                >
                  <div
                    className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                      plan.is_completed
                        ? "bg-green-100 text-green-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {plan.is_completed
                      ? "✓"
                      : "○"}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        plan.is_completed
                          ? "text-slate-400 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {plan.title}
                    </p>

                    <p className="text-xs text-slate-500 leading-5 mt-1">
                      {plan.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   WEEKLY INSIGHT
========================================================= */

const WeeklyInsightCard = ({
  insight,
  weeklyReport,
}: {
  insight: string;
  weeklyReport: WeeklyReport | null;
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <p className="text-sm font-medium text-purple-600 mb-1">
        Weekly Insight
      </p>

      <h3 className="text-lg font-bold text-slate-900 mb-4">
        What your data suggests
      </h3>

      <p className="text-sm text-slate-600 leading-7">
        {insight ||
          "Keep checking in to build a clearer picture of your wellness patterns."}
      </p>

      {weeklyReport && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            This week
          </p>

          <div className="space-y-3">
            <MiniMetric
              label="Stress"
              value={`${weeklyReport.average_stress}/10`}
            />

            <MiniMetric
              label="Sleep"
              value={`${weeklyReport.average_sleep} hrs`}
            />

            <MiniMetric
              label="Energy"
              value={`${weeklyReport.average_energy}/10`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const MiniMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">
      {label}
    </span>

    <span className="font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

/* =========================================================
   GOALS
========================================================= */

const GoalCard = ({
  weeklyReport,
  profile,
}: {
  weeklyReport: WeeklyReport | null;
  profile: UserProfile | null;
}) => {
  if (!weeklyReport) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <EmptyState message="Submit check-ins to start tracking your weekly goals." />
      </div>
    );
  }

  const sleepCurrent =
    weeklyReport.average_sleep ?? 0;

  const sleepGoal =
    profile?.sleep_goal &&
    profile.sleep_goal > 0
      ? profile.sleep_goal
      : 8;

  const recoveryCurrent =
    weeklyReport.average_recovery ?? 0;

  const recoveryGoal =
    profile?.recovery_goal &&
    profile.recovery_goal > 0
      ? profile.recovery_goal
      : 1.5;

  const sleepPercent = Math.round(
    (sleepCurrent / sleepGoal) * 100
  );

  const recoveryPercent = Math.round(
    (recoveryCurrent / recoveryGoal) * 100
  );

  const sleepRemaining = Math.max(
    sleepGoal - sleepCurrent,
    0
  );

  const recoveryRemaining = Math.max(
    recoveryGoal - recoveryCurrent,
    0
  );

  const sleepGoalMet =
    sleepCurrent >= sleepGoal;

  const recoveryGoalMet =
    recoveryCurrent >= recoveryGoal;

  let focusMessage = "";

  if (sleepGoalMet && recoveryGoalMet) {
    focusMessage =
      "You're meeting both goals. Keep your sleep and recovery routine consistent.";
  } else if (
    !sleepGoalMet &&
    recoveryGoalMet
  ) {
    focusMessage =
      `Sleep needs the most attention. You're ${sleepRemaining.toFixed(
        1
      )} hours below your daily goal.`;
  } else if (
    sleepGoalMet &&
    !recoveryGoalMet
  ) {
    focusMessage =
      `Recovery needs the most attention. You're ${recoveryRemaining.toFixed(
        1
      )} hours below your daily goal.`;
  } else if (
    recoveryPercent < sleepPercent
  ) {
    focusMessage =
      `Recovery is furthest from your goal. Try adding ${recoveryRemaining.toFixed(
        1
      )} hours of recovery time per day.`;
  } else {
    focusMessage =
      `Sleep is furthest from your goal. Try adding ${sleepRemaining.toFixed(
        1
      )} hours of sleep per day.`;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
      <div className="grid lg:grid-cols-2 gap-8">
        <GoalProgress
          label="Sleep"
          current={sleepCurrent}
          goal={sleepGoal}
          percent={sleepPercent}
          suffix="hrs"
        />

        <GoalProgress
          label="Recovery"
          current={recoveryCurrent}
          goal={recoveryGoal}
          percent={recoveryPercent}
          suffix="hrs"
        />
      </div>

      <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
            Focus this week
          </p>

          <p className="text-sm text-slate-600 mt-2">
            {focusMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

const GoalProgress = ({
  label,
  current,
  goal,
  percent,
  suffix,
}: {
  label: string;
  current: number;
  goal: number;
  percent: number;
  suffix: string;
}) => {
  const safePercent = Math.min(
    Math.max(percent, 0),
    100
  );

  const achieved = current >= goal;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-slate-900">
            {label}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Weekly average
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">
            {current} / {goal} {suffix}
          </p>

          <p
            className={`text-xs mt-1 ${
              achieved
                ? "text-green-600"
                : "text-slate-400"
            }`}
          >
            {achieved
              ? "Goal reached"
              : `${Math.max(
                  percent,
                  0
                )}% of goal`}
          </p>
        </div>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 rounded-full"
          style={{
            width: `${safePercent}%`,
          }}
        />
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  message,
}: {
  message: string;
}) => (
  <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">
    <p className="text-sm text-slate-500">
      {message}
    </p>
  </div>
);

export default DashboardPage;