import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInsight } from "../../api/insightApi";
import {
  getWeeklyTrend,
  getWeeklyReport,
  getStreak,
  getRecoveryProgress,
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

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  const [trendData, setTrendData] = useState<any[]>([]);
  const [insight, setInsight] = useState("");
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recoveryProgress, setRecoveryProgress] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const results = await Promise.allSettled([
        getWeeklyTrend(),
        getWeeklyReport(),
        getInsight(),
        getStreak(),
        getUserProfile(),
        getRecoveryProgress(),
      ]);

      if (results[0].status === "fulfilled") setTrendData(results[0].value);
      if (results[1].status === "fulfilled") setWeeklyReport(results[1].value);
      if (results[2].status === "fulfilled") setInsight(results[2].value.insight);
      if (results[3].status === "fulfilled") setStreak(results[3].value);
      if (results[4].status === "fulfilled") setProfile(results[4].value);
      if (results[5].status === "fulfilled") setRecoveryProgress(results[5].value);
    };

    fetchDashboardData();
  }, []);

  const latest = trendData[trendData.length - 1];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Welcome back</p>
        <h1 className="text-3xl font-bold mb-3">
          Hi {username}, here’s your wellness overview.
        </h1>
        <p className="text-purple-100 max-w-2xl">
          Track burnout risk, wellness trends, goals, reports and personalized insights.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Burnout Score" value={latest?.burnout_score ?? "--"} subtitle="Out of 100" />
        <StatCard
          title="Risk Level"
          value={weeklyReport?.average_burnout >= 61 ? "High" : weeklyReport?.average_burnout >= 31 ? "Moderate" : "Low"}
          subtitle="Based on weekly burnout"
        />
        <StatCard title="Mood Score" value={latest?.mood ?? "--"} subtitle="Scale of 1 to 10" />
        <StatCard title="Current Streak" value={`${streak?.current_streak ?? 0} days`} subtitle="Daily consistency" />
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
  <div className="flex justify-between items-start gap-4">
    <div>
      <p className="text-sm text-purple-600 font-medium mb-2">
        Recovery Progress
      </p>

      <h2 className="text-3xl font-bold text-gray-900">
        {recoveryProgress?.completion_rate ?? 0}%
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        {recoveryProgress?.completed_actions ?? 0} of{" "}
        {recoveryProgress?.total_actions ?? 0} action plans completed
      </p>
    </div>
  </div>

  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-5">
    <div
      className="h-full bg-purple-600 rounded-full"
      style={{
        width: `${recoveryProgress?.completion_rate ?? 0}%`,
      }}
    />
    </div>
  </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Burnout Trend</h2>
          <p className="text-sm text-gray-500 mb-6">Last 7 days wellness pattern</p>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                dataKey="date"
                interval={0}
                tick={{ fontSize: 11, fill: "#64748B" }}
                angle={-20}
                textAnchor="end"
                height={60}
                axisLine={false}
                tickLine={false}
              />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="burnout_score"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  fill="url(#burnoutGradient)"
                  dot={{ r: 4, fill: "#7C3AED" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <InsightCard insight={insight} />
      </div>
      <GoalCard weeklyReport={weeklyReport} profile={profile} />
    </div>
  );
};

const StatCard = ({ title, value, subtitle }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
    <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
  </div>
);

const InsightCard = ({ insight }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-purple-600 font-medium mb-2">AI Insight</p>
    <h2 className="text-xl font-bold text-gray-900 mb-4">Wellness Summary</h2>
    <p className="text-sm text-gray-600 leading-6">
      {insight || "Generating your wellness insight..."}
    </p>
  </div>
);


const GoalCard = ({ weeklyReport, profile }: any) => {
  const sleepCurrent = weeklyReport?.average_sleep || 0;
  const sleepGoal = profile?.sleep_goal || 8;

  const recoveryCurrent = weeklyReport?.average_recovery || 0;
  const recoveryGoal = profile?.recovery_goal || 1.5;

  const sleepPercent = Math.round((sleepCurrent / sleepGoal) * 100);
  const recoveryPercent = Math.round((recoveryCurrent / recoveryGoal) * 100);

  const focusMessage =
    recoveryPercent < sleepPercent
      ? `Increase recovery time by ${(recoveryGoal - recoveryCurrent).toFixed(
          1
        )} hrs/day`
      : `Increase sleep by ${(sleepGoal - sleepCurrent).toFixed(
          1
        )} hrs/day`;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <p className="text-sm text-purple-600 font-medium mb-2">
        Goal Tracking
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Weekly Goals
      </h2>

      <GoalBar
        label={`Sleep Goal (${sleepPercent}%)`}
        current={sleepCurrent}
        goal={sleepGoal}
        suffix="hrs"
      />

      <div className="mt-6">
        <GoalBar
          label={`Recovery Goal (${recoveryPercent}%)`}
          current={recoveryCurrent}
          goal={recoveryGoal}
          suffix="hrs"
        />
      </div>

      <div className="mt-6 bg-purple-50 border border-purple-100 rounded-2xl p-4">
        <p className="text-xs text-purple-600 font-medium mb-1">
          Focus This Week
        </p>

        <p className="text-sm text-purple-800">
          {focusMessage}
        </p>
        <Link
          to="/settings/goals"
          className="inline-flex mt-4 text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          Edit Goals →
        </Link>
      </div>
    </div>
  );
};

const GoalBar = ({ label, current, goal, suffix }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">
        {current} / {goal} {suffix}
      </span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-purple-600 rounded-full"
        style={{ width: `${Math.min((current / goal) * 100, 100)}%` }}
      />
    </div>
  </div>
);

export default DashboardPage;