import { useEffect, useState } from "react";
import { getWeeklyReport, getTrendAnalysis,getBurnoutPrediction } from "../../api/analyticsApi";

type WeeklyReport = {
  average_burnout: number;
  average_stress: number;
  average_sleep: number;
  average_energy: number;
  summary: string[];
};

const ReportsPage = () => {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [reportData, trendData, predictionData] =
        await Promise.all([
          getWeeklyReport(),
          getTrendAnalysis(),
          getBurnoutPrediction()
        ]);

      setReport(reportData);
      setTrendAnalysis(trendData);
      setPrediction(predictionData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-sm text-slate-500">Generating weekly report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          No report available
        </h2>
        <p className="text-sm text-slate-500">
          Submit check-ins to generate your weekly wellness report.
        </p>
      </div>
    );
  }

  const metrics = [
  {
    label: "Burnout Score",
    value: report.average_burnout,
    suffix: "/100",
  },
  {
    label: "Stress Level",
    value: report.average_stress,
    suffix: "/10",
  },
  {
    label: "Sleep Duration",
    value: report.average_sleep,
    suffix: " hrs",
  },
  {
    label: "Energy Level",
    value: report.average_energy,
    suffix: "/10",
  },
];
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Weekly Report</p>

        <h1 className="text-3xl font-bold mb-3">
          Your last 7 days wellness summary
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause summarizes your recent check-ins into key wellness indicators,
          risk signals, and improvement suggestions.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        {metrics.map((item, index) => (
        <div
          key={item.label}
          className={`rounded-3xl border p-6 shadow-sm ${
            index === 0
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-gray-100"
          }`}
        >
            <p
              className={`text-sm mb-2 ${
                index === 0 ? "text-purple-100" : "text-slate-500"
              }`}
            >{item.label}</p>
            <h2
              className={`text-3xl font-bold ${
                index === 0 ? "text-white" : "text-slate-900"
              }`}
            >
              {item.value}
              <span
                className={`text-base ml-1 ${
                  index === 0 ? "text-purple-200" : "text-slate-400"
                }`}
              >
                {item.suffix}
              </span>
            </h2>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Weekly Insights
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            What your last 7 days of wellness data reveal.
          </p>

          <div className="space-y-3">
            {report.summary.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
  <h2 className="text-xl font-bold text-slate-900 mb-5">
    Weekly Reflection
  </h2>

  <div className="space-y-5">
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
        Strongest Area
      </p>
      <p className="font-semibold text-green-600">
        Energy & Recovery
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
        Needs Attention
      </p>
      <p className="font-semibold text-orange-600">
        Sleep Consistency
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
        Next Focus
      </p>
      <p className="text-sm text-slate-600 leading-6">
        Try maintaining your sleep goal and daily recovery routine for the next
        seven days to improve your overall wellness trend.
      </p>
    </div>
  </div>
</div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
    <p className="text-sm text-purple-600 font-medium mb-2">
      Trend Analysis
    </p>

    <h2 className="text-xl font-bold text-slate-900 mb-3 capitalize">
      {trendAnalysis?.trend_status || "No data"}
    </h2>

    <p className="text-sm text-slate-600 leading-6">
      {trendAnalysis?.message || "Submit more check-ins to generate trend analysis."}
    </p>
  </div>

  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
    <p className="text-sm text-purple-600 font-medium mb-2">
      Burnout Prediction
    </p>

    <h2 className="text-xl font-bold text-slate-900 mb-3">
      {prediction?.predicted_risk === "high"
        ? "High Risk Forecast"
        : prediction?.prediction_status === "stable_or_improving"
        ? "Stable Pattern"
        : "Prediction Pending"}
    </h2>

    <p className="text-sm text-slate-600 leading-6">
      {prediction?.message || "Submit more check-ins to generate prediction."}
    </p>
  </div>
</div>
    </div>
  );
};

export default ReportsPage;