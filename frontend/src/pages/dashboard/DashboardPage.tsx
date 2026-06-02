import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInsight } from "../../api/insightApi";
import { getWeeklyTrend, getTrendAnalysis, getWeeklyReport, getStreak, getBurnoutPrediction } from "../../api/analyticsApi";
import {
  LineChart,
  Line,
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

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [
        trend,
        analysis,
        report,
        insightData,
        streakData,
        predictionData,
      ] = await Promise.all([
        getWeeklyTrend(),
        getTrendAnalysis(),
        getWeeklyReport(),
        getInsight(),
        getStreak(),
        getBurnoutPrediction(),
      ]);

      setTrendData(trend);
      setTrendAnalysis(analysis);
      setWeeklyReport(report);
      setInsight(insightData.insight);
      setStreak(streakData);
      setPrediction(predictionData);
    } catch (err) {
      console.log(err);
    }
  };

  fetchDashboardData();
}, []);

  const latest = trendData[trendData.length - 1];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Welcome back</p>

        <h1 className="text-3xl font-bold mb-3">
          Hi {username}, here’s your wellness overview.
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause helps you understand burnout patterns through daily check-ins,
          trend analysis, and personalized wellness insights.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-2">Current Streak</p>
        <h2 className="text-3xl font-bold text-gray-900">
          {streak?.current_streak ?? 0} days
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Daily check-in consistency
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Latest Burnout Score</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {latest ? latest.burnout_score : "--"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Out of 100</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Latest Stress Level</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {latest ? latest.stress : "--"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Scale of 1 to 10</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Latest Mood Score</p>
          <h2 className="text-3xl font-bold text-gray-900">
            {latest ? latest.mood : "--"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Scale of 1 to 10</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Burnout Trend
              </h2>
              <p className="text-sm text-gray-500">
                Last 7 days wellness pattern
              </p>
            </div>
          </div>
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
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
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
              dot={{ r: 4, fill: "#7C3AED" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-sm text-purple-600 font-medium mb-2">
            AI Insight
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Wellness Summary
          </h2>

          <p className="text-sm text-gray-600 leading-6">
            {insight || "Generating your wellness insight..."}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
  <p className="text-sm text-purple-600 font-medium mb-2">
    Trend Analysis
  </p>

  <h2 className="text-xl font-bold text-gray-900 mb-3 capitalize">
    {trendAnalysis?.trend_status || "No data"}
  </h2>

  <p className="text-sm text-gray-600 leading-6 mb-4">
  {trendAnalysis?.trend_status === "no_data"
    ? "Submit at least 2 check-ins to start trend analysis."
    : trendAnalysis?.message}
</p>

  {trendAnalysis?.warnings?.length > 0 && (
    <div className="space-y-2">
      {trendAnalysis.warnings.map((warning: string, index: number) => (
        <div
          key={index}
          className="bg-yellow-50 border border-yellow-100 text-yellow-700 text-sm p-3 rounded-xl"
        >
          {warning}
        </div>
      ))}
    </div>
  )}
</div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
  <p className="text-sm text-purple-600 font-medium mb-2">
    Weekly Report
  </p>

  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Last 7 Days Summary
  </h2>

  <div className="grid md:grid-cols-4 gap-4 mb-5">
    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-gray-500">Avg Burnout</p>
      <h3 className="text-xl font-bold text-gray-900">
        {weeklyReport?.average_burnout ?? "--"}
      </h3>
    </div>

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-gray-500">Avg Stress</p>
      <h3 className="text-xl font-bold text-gray-900">
        {weeklyReport?.average_stress ?? "--"}
      </h3>
    </div>

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-gray-500">Avg Sleep</p>
      <h3 className="text-xl font-bold text-gray-900">
        {weeklyReport?.average_sleep ?? "--"}
      </h3>
    </div>

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-gray-500">Avg Energy</p>
      <h3 className="text-xl font-bold text-gray-900">
        {weeklyReport?.average_energy ?? "--"}
      </h3>
    </div>
  </div>

  <div className="space-y-2">
    {weeklyReport?.summary?.map((item: string, index: number) => (
      <div
        key={index}
        className="bg-purple-50 border border-purple-100 text-purple-700 text-sm p-3 rounded-xl"
      >
        {item}
      </div>
    ))}
  </div>
</div>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
  <p className="text-sm text-purple-600 font-medium mb-2">
    Burnout Prediction
  </p>

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

  {prediction?.days_to_high_risk !== null &&
    prediction?.days_to_high_risk !== undefined && (
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
        <p className="text-xs text-purple-600 font-medium">
          Estimated days to high risk
        </p>
        <h3 className="text-2xl font-bold text-purple-700 mt-1">
          {prediction.days_to_high_risk} days
        </h3>
      </div>
    )}
</div>

      {/* ACTION CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/check-in"
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <p className="text-sm text-purple-600 font-medium mb-2">
            Daily Action
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Submit Today’s Check-in
          </h2>
          <p className="text-sm text-gray-600">
            Record your mood, sleep, workload, stress, and energy signals.
          </p>
        </Link>

        <Link
          to="/check-in/history"
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <p className="text-sm text-purple-600 font-medium mb-2">
            History
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            View Wellness Records
          </h2>
          <p className="text-sm text-gray-600">
            Review your previous check-ins and understand your patterns.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;