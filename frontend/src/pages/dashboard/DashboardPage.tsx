import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInsight } from "../../api/insightApi";
import { getWeeklyTrend, getTrendAnalysis } from "../../api/analyticsApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  const [trendData, setTrendData] = useState<any[]>([]);
  const [insight, setInsight] = useState("");
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const trend = await getWeeklyTrend();
        setTrendData(trend);

        const analysis = await getTrendAnalysis();
        setTrendAnalysis(analysis);

        // const insightData = await getInsight();
        // setInsight(insightData.insight);
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

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="burnout_score"
                  stroke="#7C3AED"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
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