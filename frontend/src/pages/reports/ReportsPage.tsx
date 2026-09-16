import { useEffect, useState } from "react";
import {
  getWeeklyReport,
  getTrendAnalysis,
  getBurnoutPrediction,
  getKNNRiskAnalysis,
} from "../../api/analyticsApi";

/* =========================================================
   TYPES
========================================================= */

type WeeklyReport = {
  average_burnout: number;
  average_stress: number;
  average_sleep: number;
  average_energy: number;
  summary: string[];
};

type TrendAnalysis = {
  trend_status?: string;
  message?: string;
};

type BurnoutPrediction = {
  algorithm?: string;
  prediction_status: string;
  data_points?: number;
  slope?: number;
  intercept?: number;
  r_squared?: number;
  current_score?: number;
  predicted_tomorrow?: number;
  predicted_3_days?: number;
  predicted_7_days?: number;
  predicted_risk?: string;
  message?: string;
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

/* =========================================================
   PAGE
========================================================= */

const ReportsPage = () => {
  const [report, setReport] =
    useState<WeeklyReport | null>(null);

  const [trendAnalysis, setTrendAnalysis] =
    useState<TrendAnalysis | null>(null);

  const [prediction, setPrediction] =
    useState<BurnoutPrediction | null>(null);

  const [knnAnalysis, setKnnAnalysis] =
    useState<KNNAnalysis | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    showPredictionDetails,
    setShowPredictionDetails,
  ] = useState(false);

  const [
    showKNNDetails,
    setShowKNNDetails,
  ] = useState(false);

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const results =
          await Promise.allSettled([
            getWeeklyReport(),
            getTrendAnalysis(),
            getBurnoutPrediction(),
            getKNNRiskAnalysis(),
          ]);

        if (
          results[0].status === "fulfilled"
        ) {
          setReport(results[0].value);
        }

        if (
          results[1].status === "fulfilled"
        ) {
          setTrendAnalysis(
            results[1].value
          );
        }

        if (
          results[2].status === "fulfilled"
        ) {
          setPrediction(results[2].value);
        }

        if (
          results[3].status === "fulfilled"
        ) {
          setKnnAnalysis(
            results[3].value
          );
        }

        if (
          results[0].status === "rejected"
        ) {
          setError(
            "We couldn't generate your weekly report."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
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
            Preparing your wellness report...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO REPORT
  ======================================================= */

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5 font-bold">
            ↗
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No weekly report yet
          </h2>

          <p className="text-sm text-slate-500 leading-6 mt-3">
            Keep submitting daily check-ins.
            Pause will use them to build your
            weekly wellness summary.
          </p>

          {error && (
            <p className="text-sm text-red-600 mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     DERIVED VALUES
  ======================================================= */

  const weeklyRisk =
    getRiskFromScore(
      report.average_burnout
    );

  const forecastAvailable =
    prediction &&
    prediction.prediction_status !==
      "not_enough_data";

  const knnAvailable =
    knnAnalysis?.status === "success";

  const metrics = [
    {
      label: "Stress",
      value: report.average_stress,
      suffix: "/10",
      helper: getStressDescription(
        report.average_stress
      ),
    },
    {
      label: "Sleep",
      value: report.average_sleep,
      suffix: " hrs",
      helper: "Average per night",
    },
    {
      label: "Energy",
      value: report.average_energy,
      suffix: "/10",
      helper: getEnergyDescription(
        report.average_energy
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>
        <p className="text-sm font-semibold text-purple-600 mb-2">
          Weekly Report
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          Your week at a glance
        </h1>

        <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
          A clearer look at your recent
          wellness, burnout trend and the
          patterns emerging from your check-ins.
        </p>
      </section>

      {/* =====================================================
          WEEKLY OVERVIEW
      ===================================================== */}

      <section>
        <SectionHeader
          title="This Week"
          description="Your main wellness signals across the last seven days."
        />

        <div className="grid xl:grid-cols-12 gap-5">
          {/* Burnout */}

          <div className="xl:col-span-6 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-500 text-white p-7 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-purple-100">
                  Average Burnout
                </p>

                <div className="flex items-end gap-2 mt-3">
                  <h2 className="text-5xl font-bold">
                    {report.average_burnout}
                  </h2>

                  <span className="text-purple-200 mb-1">
                    /100
                  </span>
                </div>
              </div>

              <span className="px-4 py-2 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
                {weeklyRisk} range
              </span>
            </div>

            <p className="text-sm text-purple-100 leading-6 mt-6 max-w-lg">
              {getBurnoutDescription(
                report.average_burnout
              )}
            </p>
          </div>

          {/* Supporting metrics */}

          <div className="xl:col-span-6 grid sm:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
              >
                <p className="text-sm text-slate-500">
                  {metric.label}
                </p>

                <div className="flex items-end gap-1 mt-3">
                  <h3 className="text-3xl font-bold text-slate-900">
                    {metric.value}
                  </h3>

                  <span className="text-xs text-slate-400 mb-1">
                    {metric.suffix}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-5 mt-4">
                  {metric.helper}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WEEKLY INSIGHTS
      ===================================================== */}

      <section>
        <SectionHeader
          title="What Stood Out"
          description="A summary of the signals identified across your recent check-ins."
        />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          {report.summary &&
          report.summary.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {report.summary.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-2xl bg-purple-50 border border-purple-100 p-4"
                  >
                    <div className="w-7 h-7 shrink-0 rounded-lg bg-white text-purple-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>

                    <p className="text-sm text-slate-700 leading-6">
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Keep checking in to build your
              weekly wellness summary.
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          TREND
      ===================================================== */}

      <section>
        <SectionHeader
          title="How Your Week Is Changing"
          description="Your recent check-ins help show whether burnout is moving up, down or staying relatively stable."
        />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-purple-600 mb-2">
                Recent Trend
              </p>

              <h3 className="text-2xl font-bold text-slate-900 capitalize">
                {formatTrendStatus(
                  trendAnalysis?.trend_status
                )}
              </h3>

              <p className="text-sm text-slate-500 leading-6 mt-3">
                {trendAnalysis?.message ||
                  "Continue checking in to build a clearer trend."}
              </p>
            </div>

            <TrendIndicator
              status={
                trendAnalysis?.trend_status
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FORECAST
      ===================================================== */}

      <section>
        <SectionHeader
          title="Looking Ahead"
          description="A short-term estimate based on how your recent burnout scores have been changing over time."
        />

        {!forecastAvailable ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-slate-500">
              {prediction?.message ||
                "More check-ins are needed before Pause can estimate your short-term burnout direction."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Main forecast */}

            <div className="p-7">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-2">
                    Burnout Forecast
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-slate-900 capitalize">
                      {formatPredictionStatus(
                        prediction?.prediction_status
                      )}
                    </h3>

                    {prediction?.predicted_risk && (
                      <RiskBadge
                        risk={
                          prediction.predicted_risk
                        }
                      />
                    )}
                  </div>

                  <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
                    {prediction?.message}
                  </p>
                </div>
              </div>

              {/* Forecast cards */}

              <div className="grid sm:grid-cols-3 gap-4 mt-7">
                <ForecastCard
                  label="Tomorrow"
                  value={
                    prediction?.predicted_tomorrow
                  }
                />

                <ForecastCard
                  label="In 3 days"
                  value={
                    prediction?.predicted_3_days
                  }
                  featured
                />

                <ForecastCard
                  label="In 7 days"
                  value={
                    prediction?.predicted_7_days
                  }
                />
              </div>
            </div>

            {/* Technical disclosure */}

            <AnalysisDisclosure
              open={showPredictionDetails}
              onToggle={() =>
                setShowPredictionDetails(
                  (previous) => !previous
                )
              }
              label="Forecast analysis details"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TechnicalMetric
                  label="Method"
                  value="Linear Regression"
                />

                <TechnicalMetric
                  label="Slope"
                  value={
                    prediction?.slope ?? "--"
                  }
                />

                <TechnicalMetric
                  label="R²"
                  value={
                    prediction?.r_squared ??
                    "--"
                  }
                />

                <TechnicalMetric
                  label="Data Used"
                  value={
                    prediction?.data_points
                      ? `${prediction.data_points} check-ins`
                      : "--"
                  }
                />
              </div>

              <p className="text-xs text-slate-400 leading-5 mt-5">
                The forecast fits a linear
                relationship between recent
                check-in dates and burnout scores,
                then extends that trend to estimate
                short-term values. It is a wellness
                trend estimate, not a clinical
                prediction.
              </p>
            </AnalysisDisclosure>
          </div>
        )}
      </section>

      {/* =====================================================
          HISTORICAL SIMILARITY
      ===================================================== */}

      {knnAvailable && knnAnalysis && (
        <section>
          <SectionHeader
            title="Similar Days"
            description="See how your latest wellness pattern compares with similar days from your own history."
          />

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* User-facing KNN result */}

            <div className="p-7">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium text-purple-600 mb-2">
                    Historical Similarity
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Your latest check-in most
                      closely resembles{" "}
                      <span className="capitalize">
                        {
                          knnAnalysis.predicted_risk
                        }
                      </span>
                      -risk days.
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 leading-6 mt-3">
                    {getSimilarityMessage(
                      knnAnalysis
                    )}
                  </p>
                </div>

                <RiskBadge
                  risk={
                    knnAnalysis.predicted_risk
                  }
                />
              </div>

              {/* Useful summary only */}

              <div className="grid sm:grid-cols-3 gap-4 mt-7">
                <SimpleResultCard
                  label="Similar Past Days"
                  value={`${knnAnalysis.k}`}
                  helper="Closest historical check-ins"
                />

                <SimpleResultCard
                  label="Majority Result"
                  value={capitalize(
                    knnAnalysis.predicted_risk
                  )}
                  helper={getVoteSummary(
                    knnAnalysis
                  )}
                />

                <SimpleResultCard
                  label="Historical Data"
                  value={`${knnAnalysis.data_points}`}
                  helper="Check-ins available for comparison"
                />
              </div>

              {/* Simple neighbor summary */}

              {knnAnalysis.neighbors.length >
                0 && (
                <div className="mt-7 rounded-2xl bg-slate-50 border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Similar burnout scores
                  </p>

                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {getNeighborScoreRange(
                      knnAnalysis.neighbors
                    )}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Across the closest historical
                    check-ins used for this
                    comparison.
                  </p>
                </div>
              )}
            </div>

            {/* Technical details */}

            <AnalysisDisclosure
              open={showKNNDetails}
              onToggle={() =>
                setShowKNNDetails(
                  (previous) => !previous
                )
              }
              label="Similarity analysis details"
            >
              {/* Algorithm overview */}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TechnicalMetric
                  label="Method"
                  value="K-Nearest Neighbors"
                />

                <TechnicalMetric
                  label="K Value"
                  value={knnAnalysis.k}
                />

                <TechnicalMetric
                  label="Features"
                  value="6 wellness indicators"
                />

                <TechnicalMetric
                  label="Distance"
                  value="Euclidean"
                />
              </div>

              {/* Neighbors */}

              <div className="mt-7">
                <p className="text-sm font-bold text-slate-900">
                  Nearest Historical Check-ins
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Historical observations ordered
                  from most similar to less similar.
                </p>

                <div className="space-y-2 mt-4">
                  {knnAnalysis.neighbors.map(
                    (
                      neighbor,
                      index
                    ) => (
                      <div
                        key={`${neighbor.date}-${index}`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white border border-gray-100 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Neighbor{" "}
                            {index + 1}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {neighbor.date}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <span className="text-slate-500">
                            Burnout{" "}
                            <strong className="text-slate-800">
                              {
                                neighbor.burnout_score
                              }
                            </strong>
                          </span>

                          <span className="text-slate-500">
                            Distance{" "}
                            <strong className="text-slate-800">
                              {
                                neighbor.distance
                              }
                            </strong>
                          </span>

                          <span className="capitalize rounded-full bg-slate-50 border border-gray-200 px-3 py-1 font-semibold text-slate-700">
                            {
                              neighbor.risk_level
                            }
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Vote */}

              <div className="mt-7">
                <p className="text-sm font-bold text-slate-900">
                  Majority Vote
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(
                    knnAnalysis.votes
                  ).map(
                    ([risk, votes]) => (
                      <span
                        key={risk}
                        className="rounded-full bg-purple-50 border border-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 capitalize"
                      >
                        {risk}: {votes}{" "}
                        {votes === 1
                          ? "vote"
                          : "votes"}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Evaluation */}

              <div className="mt-8 pt-7 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Algorithm Evaluation
                    </p>

                    <p className="text-xs text-slate-500 leading-5 mt-1">
                      Leave-One-Out
                      Cross-Validation on this
                      historical dataset.
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-3xl font-bold text-purple-600">
                      {
                        knnAnalysis
                          .evaluation
                          .accuracy
                      }
                      %
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      overall LOOCV accuracy
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5">
                  <TechnicalMetric
                    label="Tested"
                    value={
                      knnAnalysis
                        .evaluation
                        .total_tested
                    }
                  />

                  <TechnicalMetric
                    label="Correct"
                    value={
                      knnAnalysis
                        .evaluation
                        .correct
                    }
                  />

                  <TechnicalMetric
                    label="Incorrect"
                    value={
                      knnAnalysis
                        .evaluation
                        .incorrect
                    }
                  />
                </div>

                <div className="mt-7">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Performance by risk
                    category
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(
                      knnAnalysis
                        .evaluation
                        .class_results
                    ).map(
                      ([
                        risk,
                        result,
                      ]) => (
                        <div
                          key={risk}
                          className="rounded-2xl bg-white border border-gray-100 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-800 capitalize">
                              {risk}
                            </p>

                            <p className="text-sm font-bold text-purple-600">
                              {
                                result.accuracy
                              }
                              %
                            </p>
                          </div>

                          <p className="text-xs text-slate-400 mt-2">
                            {
                              result.correct
                            }{" "}
                            of{" "}
                            {
                              result.total
                            }{" "}
                            correctly
                            classified
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mt-6">
                  <p className="text-xs text-amber-800 leading-5">
                    Overall accuracy should be
                    interpreted alongside the
                    category-level results. The
                    historical risk categories may
                    contain very different numbers
                    of observations, so performance
                    can vary substantially between
                    categories.
                  </p>
                </div>
              </div>
            </AnalysisDisclosure>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <section className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
        <p className="text-xs text-slate-500 leading-6">
          Pause uses your self-reported check-ins
          to provide wellness monitoring and
          burnout-oriented insights. Forecasts and
          historical comparisons are intended to
          support personal reflection and are not
          medical or clinical assessments.
        </p>
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
   FORECAST CARD
========================================================= */

const ForecastCard = ({
  label,
  value,
  featured = false,
}: {
  label: string;
  value?: number;
  featured?: boolean;
}) => (
  <div
    className={`rounded-2xl border p-5 ${
      featured
        ? "bg-purple-50 border-purple-100"
        : "bg-slate-50 border-gray-100"
    }`}
  >
    <p
      className={`text-xs font-medium ${
        featured
          ? "text-purple-600"
          : "text-slate-500"
      }`}
    >
      {label}
    </p>

    <div className="flex items-end gap-1 mt-2">
      <p className="text-2xl font-bold text-slate-900">
        {value ?? "--"}
      </p>

      <span className="text-xs text-slate-400 mb-1">
        /100
      </span>
    </div>
  </div>
);

/* =========================================================
   SIMPLE RESULT CARD
========================================================= */

const SimpleResultCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => (
  <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">
    <p className="text-xs text-slate-500">
      {label}
    </p>

    <p className="text-lg font-bold text-slate-900 mt-2">
      {value}
    </p>

    <p className="text-xs text-slate-400 leading-5 mt-2">
      {helper}
    </p>
  </div>
);

/* =========================================================
   ANALYSIS DISCLOSURE
========================================================= */

const AnalysisDisclosure = ({
  open,
  onToggle,
  label,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-100">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left cursor-pointer hover:bg-slate-50 transition"
    >
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {label}
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Technical information about how
          this result was produced
        </p>
      </div>

      <span
        className={`text-lg text-slate-400 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      >
       ⌄
      </span>
    </button>

    {open && (
      <div className="px-7 pb-7 bg-slate-50 border-t border-gray-100">
        <div className="pt-6">
          {children}
        </div>
      </div>
    )}
  </div>
);

/* =========================================================
   TECHNICAL METRIC
========================================================= */

const TechnicalMetric = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-2xl bg-white border border-gray-100 p-4">
    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="text-sm font-bold text-slate-800 mt-2">
      {value}
    </p>
  </div>
);

/* =========================================================
   RISK BADGE
========================================================= */

const RiskBadge = ({
  risk,
}: {
  risk: string;
}) => {
  const normalized =
    risk.toLowerCase();

  let styles =
    "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "low") {
    styles =
      "bg-green-50 text-green-700 border-green-100";
  } else if (
    normalized === "moderate"
  ) {
    styles =
      "bg-amber-50 text-amber-700 border-amber-100";
  } else if (
    normalized === "high"
  ) {
    styles =
      "bg-orange-50 text-orange-700 border-orange-100";
  } else if (
    normalized === "critical"
  ) {
    styles =
      "bg-red-50 text-red-700 border-red-100";
  }

  return (
    <span
      className={`shrink-0 inline-flex px-4 py-2 rounded-full border text-xs font-semibold capitalize ${styles}`}
    >
      {risk} risk
    </span>
  );
};

/* =========================================================
   TREND INDICATOR
========================================================= */

const TrendIndicator = ({
  status,
}: {
  status?: string;
}) => {
  const normalized =
    status?.toLowerCase() || "";

  if (
    normalized === "improving" ||
    normalized === "decreasing"
  ) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold shrink-0">
        ↓
      </div>
    );
  }

  if (
    normalized === "worsening" ||
    normalized === "increasing"
  ) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl font-bold shrink-0">
        ↑
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center text-xl font-bold shrink-0">
      →
    </div>
  );
};

/* =========================================================
   DISPLAY HELPERS
========================================================= */

const getRiskFromScore = (
  score: number
) => {
  if (score <= 30) return "Low";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "High";

  return "Critical";
};

const getBurnoutDescription = (
  score: number
) => {
  if (score <= 30) {
    return "Your average burnout score remained within the lower range across this week's check-ins.";
  }

  if (score <= 60) {
    return "Your weekly average shows moderate burnout signals. Recovery and workload balance may deserve some attention.";
  }

  if (score <= 80) {
    return "Your weekly average shows elevated burnout signals. Prioritizing rest and manageable workload may be helpful.";
  }

  return "Your weekly average shows very high burnout signals. Recovery and workload management should be given close attention.";
};

const getStressDescription = (
  value: number
) => {
  if (value <= 3) return "Lower stress";
  if (value <= 6) return "Moderate stress";

  return "Higher stress";
};

const getEnergyDescription = (
  value: number
) => {
  if (value <= 3) return "Lower energy";
  if (value <= 6) return "Moderate energy";

  return "Higher energy";
};

const formatTrendStatus = (
  status?: string
) => {
  if (!status) return "Not enough data";

  return status.replaceAll("_", " ");
};

const formatPredictionStatus = (
  status?: string
) => {
  if (!status) {
    return "Forecast unavailable";
  }

  if (status === "decreasing") {
    return "Burnout is trending downward";
  }

  if (status === "increasing") {
    return "Burnout is trending upward";
  }

  if (status === "stable") {
    return "Burnout is relatively stable";
  }

  return status.replaceAll("_", " ");
};

const capitalize = (
  value: string
) => {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
};

/* =========================================================
   KNN HELPERS
========================================================= */

const getSimilarityMessage = (
  analysis: KNNAnalysis
) => {
  const predicted =
    capitalize(
      analysis.predicted_risk
    );

  const voteCount =
    analysis.votes[
      analysis.predicted_risk
    ] ?? 0;

  if (
    voteCount === analysis.k
  ) {
    return `All ${analysis.k} of the closest historical check-ins were ${predicted} risk, giving a consistent similarity result for your latest check-in.`;
  }

  return `${voteCount} of the ${analysis.k} closest historical check-ins were ${predicted} risk, which produced the majority result.`;
};

const getVoteSummary = (
  analysis: KNNAnalysis
) => {
  const count =
    analysis.votes[
      analysis.predicted_risk
    ] ?? 0;

  return `${count} of ${analysis.k} similar days`;
};

const getNeighborScoreRange = (
  neighbors: KNNNeighbor[]
) => {
  if (neighbors.length === 0) {
    return "No similar check-ins";
  }

  const scores =
    neighbors.map(
      (neighbor) =>
        neighbor.burnout_score
    );

  const minimum =
    Math.min(...scores);

  const maximum =
    Math.max(...scores);

  if (minimum === maximum) {
    return `${minimum}/100`;
  }

  return `${minimum} – ${maximum} /100`;
};

export default ReportsPage;