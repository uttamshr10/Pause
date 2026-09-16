import { useEffect, useState } from "react";
import {
  getReflection,
  getWellnessPatterns,
} from "../../api/analyticsApi";

/* =========================================================
   TYPES
========================================================= */

type ReflectionData = {
  summary: string;
  themes: string[];
  focus_area: string;
  patterns: string[];
};

type ClusterCentroid = {
  stress: number;
  sleep: number;
  workload: number;
  energy: number;
  focus: number;
  recovery: number;
};

type WellnessCluster = {
  cluster: number;
  size: number;
  pattern_name: string;
  centroid: ClusterCentroid;
  description: string;
};

type WellnessPatterns = {
  status: string;
  algorithm: string;
  k: number;
  data_points: number;
  iterations: number;
  converged: boolean;
  current_cluster: number;
  clusters: WellnessCluster[];
};

/* =========================================================
   PAGE
========================================================= */

const ReflectionPage = () => {
  const [reflection, setReflection] =
    useState<ReflectionData | null>(null);

  const [
    wellnessPatterns,
    setWellnessPatterns,
  ] = useState<WellnessPatterns | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    showPatternDetails,
    setShowPatternDetails,
  ] = useState(false);

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const results =
          await Promise.allSettled([
            getReflection(),
            getWellnessPatterns(),
          ]);

        if (
          results[0].status === "fulfilled"
        ) {
          setReflection(results[0].value);
        }

        if (
          results[1].status === "fulfilled"
        ) {
          setWellnessPatterns(
            results[1].value
          );
        }

        if (
          results[0].status === "rejected" &&
          results[1].status === "rejected"
        ) {
          setError(
            "We couldn't load your reflection right now."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReflection();
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
            Looking for patterns in your
            wellness history...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     DERIVED PATTERN DATA
  ======================================================= */

  const patternAnalysisAvailable =
    wellnessPatterns?.status === "success";

  const currentPattern =
    patternAnalysisAvailable
      ? wellnessPatterns.clusters.find(
          (cluster) =>
            cluster.cluster ===
            wellnessPatterns.current_cluster
        )
      : undefined;

  const otherPatterns =
    patternAnalysisAvailable
      ? wellnessPatterns.clusters.filter(
          (cluster) =>
            cluster.cluster !==
            wellnessPatterns.current_cluster
        )
      : [];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>
        <p className="text-sm font-semibold text-purple-600 mb-2">
          Reflection
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          What your wellness history is
          showing
        </h1>

        <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
          Step back from individual check-ins
          and look at the themes, signals and
          recurring patterns appearing across
          your wellness history.
        </p>
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
          REFLECTION SUMMARY
      ===================================================== */}

      <section>
        <SectionHeader
          title="Your Reflection"
          description="A summary of what your recent wellness information suggests."
        />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-7 md:p-8">
            <div className="flex items-start gap-5">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 items-center justify-center shrink-0">
                <ReflectionIcon />
              </div>

              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                  Recent Reflection
                </p>

                <p className="text-base text-slate-700 leading-8 mt-3 max-w-4xl">
                  {reflection?.summary ||
                    "Keep checking in and adding notes to build a more meaningful reflection."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          THEMES + FOCUS
      ===================================================== */}

      <section>
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Themes */}

          <div className="lg:col-span-7">
            <div className="h-full bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
              <p className="text-sm font-semibold text-purple-600">
                Recurring Themes
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-1">
                What keeps showing up
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Themes identified across your
                recent reflections.
              </p>

              {reflection?.themes &&
              reflection.themes.length >
                0 ? (
                <div className="flex flex-wrap gap-3 mt-6">
                  {reflection.themes.map(
                    (theme, index) => (
                      <div
                        key={`${theme}-${index}`}
                        className="flex items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-4 py-2.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />

                        <span className="text-sm font-medium text-purple-700">
                          {theme}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <EmptySmallState text="Add journal notes during your check-ins to reveal recurring themes." />
              )}
            </div>
          </div>

          {/* Focus */}

          <div className="lg:col-span-5">
            <div className="h-full rounded-3xl bg-gradient-to-br from-purple-600 to-purple-500 p-7 text-white shadow-lg">
              <p className="text-sm text-purple-100">
                Suggested Focus
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Where to place your
                attention
              </h2>

              <div className="w-10 h-1 rounded-full bg-white/40 my-5" />

              <p className="text-sm text-purple-50 leading-7">
                {reflection?.focus_area ||
                  "Keep adding check-ins and reflections to build a clearer focus area."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OBSERVED PATTERNS
      ===================================================== */}

      {reflection?.patterns &&
        reflection.patterns.length > 0 && (
          <section>
            <SectionHeader
              title="Recent Signals"
              description="Patterns identified from your recent wellness information."
            />

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-3">
                {reflection.patterns.map(
                  (pattern, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-gray-100 p-4"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-purple-600">
                        {index + 1}
                      </div>

                      <p className="text-sm text-slate-600 leading-6">
                        {pattern}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          RECURRING WELLNESS PATTERNS
      ===================================================== */}

      {patternAnalysisAvailable &&
        wellnessPatterns &&
        currentPattern && (
          <section>
            <SectionHeader
              title="Your Recurring Wellness Patterns"
              description="Similar check-ins across your history reveal a few recurring ways your wellness tends to look."
            />

            <div className="space-y-5">
              {/* =============================================
                  CURRENT PATTERN
              ============================================= */}

              <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="grid lg:grid-cols-12">
                  {/* Main interpretation */}

                  <div className="lg:col-span-8 p-7 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-purple-600 text-white px-3 py-1.5 text-xs font-semibold">
                        Current Pattern
                      </span>

                      <span className="text-xs text-slate-400">
                        Based on your latest
                        check-in
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-5">
                      {
                        currentPattern.pattern_name
                      }
                    </h3>

                    <p className="text-sm text-slate-600 leading-7 mt-4 max-w-2xl">
                      {
                        currentPattern.description
                      }
                    </p>
                  </div>

                  {/* Snapshot */}

                  <div className="lg:col-span-4 bg-purple-50 border-t lg:border-t-0 lg:border-l border-purple-100 p-7">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                      Pattern Snapshot
                    </p>

                    <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
                      <PatternSnapshot
                        label="Stress"
                        value={`${currentPattern.centroid.stress}/10`}
                      />

                      <PatternSnapshot
                        label="Workload"
                        value={`${currentPattern.centroid.workload}/10`}
                      />

                      <PatternSnapshot
                        label="Energy"
                        value={`${currentPattern.centroid.energy}/10`}
                      />

                      <PatternSnapshot
                        label="Focus"
                        value={`${currentPattern.centroid.focus}/10`}
                      />

                      <PatternSnapshot
                        label="Sleep"
                        value={`${currentPattern.centroid.sleep}h`}
                      />

                      <PatternSnapshot
                        label="Recovery"
                        value={`${currentPattern.centroid.recovery}h`}
                      />
                    </div>

                    <p className="text-xs text-purple-700/70 leading-5 mt-6">
                      These values represent the
                      typical profile of this
                      recurring pattern, not only
                      today's check-in.
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  OTHER HISTORICAL PATTERNS
              ============================================= */}

              {otherPatterns.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Other patterns in your
                      history
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Your past check-ins have also
                      shown these recurring wellness
                      profiles.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {otherPatterns.map(
                      (pattern) => (
                        <HistoricalPatternCard
                          key={
                            pattern.cluster
                          }
                          pattern={pattern}
                          total={
                            wellnessPatterns.data_points
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* =============================================
                  TECHNICAL ANALYSIS
              ============================================= */}

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setShowPatternDetails(
                      (previous) =>
                        !previous
                    )
                  }
                  className="w-full px-7 py-5 flex items-center justify-between gap-5 text-left hover:bg-slate-50 transition cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      View pattern analysis
                      details
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Technical information about
                      how these recurring patterns
                      were discovered
                    </p>
                  </div>

                  <span
                    className={`text-lg text-slate-400 transition-transform ${
                      showPatternDetails
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                {showPatternDetails && (
                  <div className="border-t border-gray-100 bg-slate-50 px-7 py-7">
                    {/* Algorithm overview */}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <TechnicalMetric
                        label="Method"
                        value="K-Means Clustering"
                      />

                      <TechnicalMetric
                        label="Clusters"
                        value={
                          wellnessPatterns.k
                        }
                      />

                      <TechnicalMetric
                        label="Data Used"
                        value={`${wellnessPatterns.data_points} check-ins`}
                      />

                      <TechnicalMetric
                        label="Iterations"
                        value={
                          wellnessPatterns.iterations
                        }
                      />

                      <TechnicalMetric
                        label="Converged"
                        value={
                          wellnessPatterns.converged
                            ? "Yes"
                            : "No"
                        }
                      />
                    </div>

                    {/* Explanation */}

                    <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-5">
                      <p className="text-sm font-bold text-slate-900">
                        How pattern discovery
                        works
                      </p>

                      <p className="text-xs text-slate-500 leading-6 mt-2">
                        Historical check-ins are
                        compared using six wellness
                        indicators: stress, sleep,
                        workload, energy, focus and
                        recovery. The clustering
                        process groups check-ins
                        with similar combinations
                        of these values. Pattern
                        names and descriptions are
                        then generated from the
                        resulting cluster profiles.
                      </p>
                    </div>

                    {/* Full cluster profiles */}

                    <div className="mt-7">
                      <p className="text-sm font-bold text-slate-900">
                        Cluster Profiles
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Centroid values represent
                        the average wellness
                        profile of each discovered
                        cluster.
                      </p>

                      <div className="grid lg:grid-cols-3 gap-4 mt-4">
                        {wellnessPatterns.clusters.map(
                          (cluster) => (
                            <TechnicalClusterCard
                              key={
                                cluster.cluster
                              }
                              cluster={
                                cluster
                              }
                              current={
                                cluster.cluster ===
                                wellnessPatterns.current_cluster
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          PATTERN NOT AVAILABLE
      ===================================================== */}

      {!patternAnalysisAvailable && (
        <section>
          <SectionHeader
            title="Your Recurring Wellness Patterns"
            description="As your check-in history grows, Pause can identify recurring wellness profiles."
          />

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <p className="text-sm text-slate-500 leading-6">
              More wellness history is needed
              before recurring patterns can be
              identified.
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTNOTE
      ===================================================== */}

      <section className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
        <p className="text-xs text-slate-500 leading-6">
          Reflection insights and wellness
          patterns are based on your
          self-reported check-ins. They are
          intended to support personal
          reflection and wellness awareness,
          not medical or clinical assessment.
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
   CURRENT PATTERN SNAPSHOT
========================================================= */

const PatternSnapshot = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs text-purple-600/70">
      {label}
    </p>

    <p className="text-lg font-bold text-slate-900 mt-1">
      {value}
    </p>
  </div>
);

/* =========================================================
   HISTORICAL PATTERN CARD
========================================================= */

const HistoricalPatternCard = ({
  pattern,
  total,
}: {
  pattern: WellnessCluster;
  total: number;
}) => {
  const percentage =
    total > 0
      ? Math.round(
          (pattern.size / total) * 100
        )
      : 0;

  return (
    <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">
      <h4 className="font-bold text-slate-900">
        {pattern.pattern_name}
      </h4>

      <p className="text-sm text-slate-500 leading-6 mt-2">
        {pattern.description}
      </p>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Historical frequency
          </p>

          <p className="text-xs font-semibold text-slate-600">
            {pattern.size} check-ins
          </p>
        </div>

        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-purple-400 rounded-full"
            style={{
              width: `${Math.min(
                percentage,
                100
              )}%`,
            }}
          />
        </div>

        <p className="text-[11px] text-slate-400 mt-2">
          About {percentage}% of your
          recorded check-ins
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   TECHNICAL CLUSTER CARD
========================================================= */

const TechnicalClusterCard = ({
  cluster,
  current,
}: {
  cluster: WellnessCluster;
  current: boolean;
}) => (
  <div
    className={`rounded-2xl border p-5 ${
      current
        ? "bg-purple-50 border-purple-200"
        : "bg-white border-gray-100"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Cluster {cluster.cluster}
      </p>

      {current && (
        <span className="rounded-full bg-purple-600 text-white px-2.5 py-1 text-[10px] font-semibold">
          Current
        </span>
      )}
    </div>

    <h4 className="text-sm font-bold text-slate-900 mt-3">
      {cluster.pattern_name}
    </h4>

    <p className="text-xs text-slate-500 leading-5 mt-2">
      {cluster.size} historical
      check-ins
    </p>

    <div className="grid grid-cols-2 gap-2 mt-4">
      <CentroidValue
        label="Stress"
        value={cluster.centroid.stress}
      />

      <CentroidValue
        label="Sleep"
        value={`${cluster.centroid.sleep}h`}
      />

      <CentroidValue
        label="Workload"
        value={cluster.centroid.workload}
      />

      <CentroidValue
        label="Energy"
        value={cluster.centroid.energy}
      />

      <CentroidValue
        label="Focus"
        value={cluster.centroid.focus}
      />

      <CentroidValue
        label="Recovery"
        value={`${cluster.centroid.recovery}h`}
      />
    </div>
  </div>
);

/* =========================================================
   CENTROID VALUE
========================================================= */

const CentroidValue = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-xl bg-white border border-gray-100 p-3">
    <p className="text-[10px] text-slate-400">
      {label}
    </p>

    <p className="text-xs font-bold text-slate-800 mt-1">
      {value}
    </p>
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
   EMPTY SMALL STATE
========================================================= */

const EmptySmallState = ({
  text,
}: {
  text: string;
}) => (
  <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5 mt-6">
    <p className="text-sm text-slate-500 leading-6">
      {text}
    </p>
  </div>
);

/* =========================================================
   ICON
========================================================= */

const ReflectionIcon = () => (
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
    <path d="M12 3a6 6 0 0 0-6 6c0 4 3 5 3 8" />
    <path d="M12 3a6 6 0 0 1 6 6c0 4-3 5-3 8" />
    <path d="M9 17h6" />
    <path d="M10 21h4" />
    <path d="M9 8h.01" />
    <path d="M15 8h.01" />
    <path d="M9.5 12c1.5 1 3.5 1 5 0" />
  </svg>
);

export default ReflectionPage;