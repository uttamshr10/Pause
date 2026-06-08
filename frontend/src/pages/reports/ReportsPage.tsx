import { useEffect, useState } from "react";
import { getWeeklyReport, getTrendAnalysis,getBurnoutPrediction } from "../../api/analyticsApi";
import { getUserProfile } from "../../api/userApi";

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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [reportData, trendData, predictionData, profileData] =
        await Promise.all([
          getWeeklyReport(),
          getTrendAnalysis(),
          getBurnoutPrediction(),
          getUserProfile(),
        ]);

      setReport(reportData);
      setTrendAnalysis(trendData);
      setPrediction(predictionData);
      setProfile(profileData);
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
      label: "Average Burnout",
      value: report.average_burnout,
      suffix: "/100",
    },
    {
      label: "Average Stress",
      value: report.average_stress,
      suffix: "/10",
    },
    {
      label: "Average Sleep",
      value: report.average_sleep,
      suffix: " hrs",
    },
    {
      label: "Average Energy",
      value: report.average_energy,
      suffix: "/10",
    },
  ];
  const riskLevel =
  report.average_burnout >= 61
    ? "High"
    : report.average_burnout >= 31
    ? "Moderate"
    : "Low";

const strongestArea =
  report.average_sleep >= 7
    ? "Sleep"
    : report.average_energy >= 6
    ? "Energy"
    : "Recovery";

const focusArea =
  report.average_stress >= 7
    ? "Stress"
    : report.average_sleep < 7
    ? "Sleep"
    : (report as any).average_recovery < 1
    ? "Recovery"
    : "Maintain Routine";

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
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500 mb-2">{item.label}</p>
            <h2 className="text-3xl font-bold text-slate-900">
              {item.value}
              <span className="text-base text-slate-400 ml-1">
                {item.suffix}
              </span>
            </h2>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Report Summary
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Key observations generated from your weekly wellness data.
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
  <p className="text-sm text-purple-600 font-medium mb-2">
    Report Snapshot
  </p>

  <h2 className="text-xl font-bold text-slate-900 mb-5">
    Weekly Overview
  </h2>

  <div className="space-y-4">
    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-slate-500 mb-1">Risk Level</p>
      <p className="text-lg font-bold text-slate-900">
        {riskLevel}
      </p>
    </div>

    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-slate-500 mb-1">Strongest Area</p>
      <p className="text-lg font-bold text-slate-900">
        {strongestArea}
      </p>
    </div>

    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
      <p className="text-xs text-purple-600 mb-1">Focus Area</p>
      <p className="text-lg font-bold text-purple-700">
        {focusArea}
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