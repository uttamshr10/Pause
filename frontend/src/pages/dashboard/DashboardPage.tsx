import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInsight } from "../../api/insightApi";
import {
  getWeeklyTrend,
  getTrendAnalysis,
  getWeeklyReport,
  getStreak,
  getBurnoutPrediction,
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
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const results = await Promise.allSettled([
        getWeeklyTrend(),
        getTrendAnalysis(),
        getWeeklyReport(),
        getInsight(),
        getStreak(),
        getBurnoutPrediction(),
        getUserProfile(),
      ]);

      if (results[0].status === "fulfilled") setTrendData(results[0].value);
      if (results[1].status === "fulfilled") setTrendAnalysis(results[1].value);
      if (results[2].status === "fulfilled") setWeeklyReport(results[2].value);
      if (results[3].status === "fulfilled") setInsight(results[3].value.insight);
      if (results[4].status === "fulfilled") setStreak(results[4].value);
      if (results[5].status === "fulfilled") setPrediction(results[5].value);
      if (results[6].status === "fulfilled") setProfile(results[6].value);
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
          Track burnout risk, wellness trends, goals, reports, and personalized insights.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Burnout Score" value={latest?.burnout_score ?? "--"} subtitle="Out of 100" />
        <StatCard title="Stress Level" value={latest?.stress ?? "--"} subtitle="Scale of 1 to 10" />
        <StatCard title="Mood Score" value={latest?.mood ?? "--"} subtitle="Scale of 1 to 10" />
        <StatCard title="Current Streak" value={`${streak?.current_streak ?? 0} days`} subtitle="Daily consistency" />
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
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
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
      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard to="/check-in" title="Submit Today’s Check-in" subtitle="Record mood, sleep, workload, stress, focus, and recovery." />
        <ActionCard to="/reports" title="View Weekly Report" subtitle="Review your weekly wellness summary and averages." />
      </div>
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

const TrendCard = ({ trendAnalysis }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-purple-600 font-medium mb-2">Trend Analysis</p>
    <h2 className="text-xl font-bold text-gray-900 mb-3 capitalize">
      {trendAnalysis?.trend_status || "No data"}
    </h2>
    <p className="text-sm text-gray-600 leading-6">
      {trendAnalysis?.trend_status === "no_data"
        ? "Submit at least 2 check-ins to start trend analysis."
        : trendAnalysis?.message || "Trend analysis unavailable."}
    </p>
  </div>
);

const PredictionCard = ({ prediction }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-purple-600 font-medium mb-2">Burnout Prediction</p>
    <h2 className="text-xl font-bold text-gray-900 mb-3">
      {prediction?.predicted_risk === "high"
        ? "High Risk Forecast"
        : prediction?.prediction_status === "stable_or_improving"
        ? "Stable Pattern"
        : "Prediction Pending"}
    </h2>
    <p className="text-sm text-gray-600 leading-6 mb-4">
      {prediction?.message || "Submit more check-ins to generate prediction."}
    </p>
  </div>
);

const GoalCard = ({ weeklyReport, profile }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-purple-600 font-medium mb-2">Goal Tracking</p>
    <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Goals</h2>

    <GoalBar
      label="Sleep Goal"
      current={weeklyReport?.average_sleep || 0}
      goal={profile?.sleep_goal || 8}
      suffix="hrs"
    />

    <div className="mt-5">
      <GoalBar
        label="Recovery Goal"
        current={weeklyReport?.average_recovery || 0}
        goal={profile?.recovery_goal || 1.5}
        suffix="hrs"
      />
    </div>
  </div>
);

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

const WeeklyReportCard = ({ weeklyReport }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
    <p className="text-sm text-purple-600 font-medium mb-2">Weekly Report</p>
    <h2 className="text-xl font-bold text-gray-900 mb-4">Last 7 Days Summary</h2>

    <div className="grid md:grid-cols-4 gap-4 mb-5">
      <MiniMetric label="Avg Burnout" value={weeklyReport?.average_burnout ?? "--"} />
      <MiniMetric label="Avg Stress" value={weeklyReport?.average_stress ?? "--"} />
      <MiniMetric label="Avg Sleep" value={weeklyReport?.average_sleep ?? "--"} />
      <MiniMetric label="Avg Energy" value={weeklyReport?.average_energy ?? "--"} />
    </div>

    <div className="space-y-2">
      {weeklyReport?.summary?.map((item: string, index: number) => (
        <div key={index} className="bg-purple-50 border border-purple-100 text-purple-700 text-sm p-3 rounded-xl">
          {item}
        </div>
      ))}
    </div>
  </div>
);

const MiniMetric = ({ label, value }: any) => (
  <div className="bg-gray-50 rounded-2xl p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <h3 className="text-xl font-bold text-gray-900">{value}</h3>
  </div>
);

const ActionCard = ({ to, title, subtitle }: any) => (
  <Link to={to} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
    <p className="text-sm text-purple-600 font-medium mb-2">Action</p>
    <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-sm text-gray-600">{subtitle}</p>
  </Link>
);

export default DashboardPage;