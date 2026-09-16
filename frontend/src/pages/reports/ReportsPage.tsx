import { useEffect, useState } from "react";
import { getWeeklyReport, getTrendAnalysis,getBurnoutPrediction, getKNNRiskAnalysis } from "../../api/analyticsApi";

type WeeklyReport = {
  average_burnout: number;
  average_stress: number;
  average_sleep: number;
  average_energy: number;
  summary: string[];
};

type KNNNeighbor = {
  date: string;
  risk_level: string;
  burnout_score: number;
  distance: number;
};

type KNNClassResult = {
  total: number;
  correct: number;
  accuracy: number;
};

type KNNEvaluation = {
  status: string;
  evaluation_method: string;
  k: number;
  total_tested: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  class_results: Record<string, KNNClassResult>;
};

type KNNAnalysis = {
  status: string;
  algorithm: string;
  k: number;
  data_points: number;
  target_date: string;
  actual_risk: string;
  predicted_risk: string;
  votes: Record<string, number>;
  neighbors: KNNNeighbor[];
  risk_distribution: Record<string, number>;
  evaluation: KNNEvaluation;
};

const ReportsPage = () => {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [knnAnalysis, setKnnAnalysis] = useState<KNNAnalysis | null>(null);
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [
          reportData,
          trendData,
          predictionData,
          knnData,
        ] = await Promise.all([
          getWeeklyReport(),
          getTrendAnalysis(),
          getBurnoutPrediction(),
          getKNNRiskAnalysis(),
        ]);

        setReport(reportData);
        setTrendAnalysis(trendData);
        setPrediction(predictionData);
        setKnnAnalysis(knnData);
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
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <p className="text-sm text-purple-600 font-medium mb-1">
        Burnout Prediction
      </p>

      <h2 className="text-xl font-bold text-slate-900">
        Linear Regression Forecast
      </h2>
    </div>

    {prediction?.predicted_risk && (
      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold capitalize">
        {prediction.predicted_risk} Risk
      </span>
    )}
  </div>

  {prediction?.prediction_status === "not_enough_data" ? (
    <p className="text-sm text-slate-600">
      {prediction.message}
    </p>
  ) : (
    <>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500 mb-1">
            Tomorrow
          </p>
          <p className="font-bold text-slate-900">
            {prediction?.predicted_tomorrow}/100
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500 mb-1">
            3 Days
          </p>
          <p className="font-bold text-slate-900">
            {prediction?.predicted_3_days}/100
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500 mb-1">
            7 Days
          </p>
          <p className="font-bold text-slate-900">
            {prediction?.predicted_7_days}/100
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Trend
          </span>

          <span className="font-semibold text-slate-900 capitalize">
            {prediction?.prediction_status}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Slope
          </span>

          <span className="font-semibold text-slate-900">
            {prediction?.slope}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            R²
          </span>

          <span className="font-semibold text-slate-900">
            {prediction?.r_squared}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Data Used
          </span>

          <span className="font-semibold text-slate-900">
            {prediction?.data_points} check-ins
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-6">
        {prediction?.message}
      </p>
    </>
  )}
</div>
</div>
{knnAnalysis?.status === "success" && (
  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
      <div>
        <p className="text-sm text-purple-600 font-medium mb-1">
          Historical Risk Similarity
        </p>

        <h2 className="text-xl font-bold text-slate-900">
          K-Nearest Neighbors Analysis
        </h2>

        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Your latest wellness check-in is compared with
          similar historical check-ins using K-Nearest
          Neighbors.
        </p>
      </div>

      <span className="shrink-0 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold capitalize">
        {knnAnalysis.predicted_risk} Risk
      </span>
    </div>

    {/* Main Result */}
    <div className="grid md:grid-cols-3 gap-3 mb-6">
      <div className="rounded-2xl bg-slate-50 border border-gray-100 p-4">
        <p className="text-xs text-slate-500 mb-1">
          Predicted Risk
        </p>

        <p className="text-lg font-bold text-slate-900 capitalize">
          {knnAnalysis.predicted_risk}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-gray-100 p-4">
        <p className="text-xs text-slate-500 mb-1">
          Stored Risk
        </p>

        <p className="text-lg font-bold text-slate-900 capitalize">
          {knnAnalysis.actual_risk}
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-gray-100 p-4">
        <p className="text-xs text-slate-500 mb-1">
          Historical Records
        </p>

        <p className="text-lg font-bold text-slate-900">
          {knnAnalysis.data_points}
        </p>
      </div>
    </div>

    {/* Neighbor Voting */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Nearest Historical Check-ins
          </p>

          <p className="text-xs text-slate-500 mt-1">
            The {knnAnalysis.k} closest observations used
            for majority voting.
          </p>
        </div>

        <span className="text-xs font-medium text-purple-700 bg-purple-50 rounded-full px-3 py-1">
          K = {knnAnalysis.k}
        </span>
      </div>

      <div className="space-y-2">
        {knnAnalysis.neighbors.map(
          (neighbor, index) => (
            <div
              key={`${neighbor.date}-${index}`}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl bg-slate-50 border border-gray-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Neighbor {index + 1}
                </p>

                <p className="text-xs text-slate-500">
                  {neighbor.date}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-500">
                  Burnout{" "}
                  <strong className="text-slate-800">
                    {neighbor.burnout_score}
                  </strong>
                </span>

                <span className="text-slate-500">
                  Distance{" "}
                  <strong className="text-slate-800">
                    {neighbor.distance}
                  </strong>
                </span>

                <span className="capitalize rounded-full bg-white border border-gray-200 px-3 py-1 font-semibold text-slate-700">
                  {neighbor.risk_level}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>

    {/* Voting Result */}
    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 mb-6">
      <p className="text-xs text-purple-600 font-medium mb-2">
        Majority Vote
      </p>

      <div className="flex flex-wrap gap-2">
        {Object.entries(knnAnalysis.votes).map(
          ([risk, votes]) => (
            <span
              key={risk}
              className="bg-white rounded-full px-3 py-1 text-sm font-semibold text-purple-700 capitalize"
            >
              {risk}: {votes} vote
              {votes !== 1 ? "s" : ""}
            </span>
          )
        )}
      </div>
    </div>

    {/* Evaluation */}
    <div className="border-t border-gray-100 pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Algorithm Evaluation
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Leave-One-Out Cross-Validation across historical
            check-ins.
          </p>
        </div>

        <div>
          <p className="text-2xl font-bold text-purple-600">
            {knnAnalysis.evaluation.accuracy}%
          </p>

          <p className="text-xs text-slate-500">
            overall accuracy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Tested
          </p>

          <p className="font-bold text-slate-900 mt-1">
            {knnAnalysis.evaluation.total_tested}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Correct
          </p>

          <p className="font-bold text-slate-900 mt-1">
            {knnAnalysis.evaluation.correct}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            Incorrect
          </p>

          <p className="font-bold text-slate-900 mt-1">
            {knnAnalysis.evaluation.incorrect}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">
            K Value
          </p>

          <p className="font-bold text-slate-900 mt-1">
            {knnAnalysis.k}
          </p>
        </div>
      </div>

      {/* Class-level Evaluation */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Accuracy by Risk Category
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(
            knnAnalysis.evaluation.class_results
          ).map(([risk, result]) => (
            <div
              key={risk}
              className="rounded-2xl border border-gray-100 p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-slate-800 capitalize">
                  {risk}
                </p>

                <p className="text-sm font-bold text-purple-600">
                  {result.accuracy}%
                </p>
              </div>

              <p className="text-xs text-slate-500">
                {result.correct} of {result.total} correctly
                classified
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Algorithm Details */}
    <div className="mt-6 rounded-2xl bg-slate-50 border border-gray-100 p-4">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <p className="text-xs text-slate-400">
            Algorithm
          </p>

          <p className="text-sm font-semibold text-slate-700">
            K-Nearest Neighbors
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Features
          </p>

          <p className="text-sm font-semibold text-slate-700">
            6 wellness indicators
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Distance
          </p>

          <p className="text-sm font-semibold text-slate-700">
            Euclidean
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Evaluation
          </p>

          <p className="text-sm font-semibold text-slate-700">
            LOOCV
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ReportsPage;