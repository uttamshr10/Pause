import { useEffect, useState } from "react";
import {
  getReflection,
  getWellnessPatterns,
} from "../../api/analyticsApi";

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

const ReflectionPage = () => {
  const [reflection, setReflection] =
    useState<ReflectionData | null>(null);

  const [wellnessPatterns, setWellnessPatterns] =
    useState<WellnessPatterns | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const [reflectionData, patternData] =
          await Promise.all([
            getReflection(),
            getWellnessPatterns(),
          ]);

        setReflection(reflectionData);
        setWellnessPatterns(patternData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReflection();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          Analyzing your reflections...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">
          Reflection Engine
        </p>

        <h1 className="text-3xl font-bold mb-3">
          Understand your wellness patterns
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause analyzes your journal notes and check-in signals
          to highlight recurring themes, wellness patterns, and
          focus areas.
        </p>
      </div>

      {/* Reflection Summary */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-purple-600 font-medium mb-2">
          Reflection Summary
        </p>

        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Personal Pattern Analysis
        </h2>

        <p className="text-sm text-slate-600 leading-7">
          {reflection?.summary ||
            "Not enough data available yet."}
        </p>
      </div>

      {/* Themes and Suggested Focus */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recurring Themes */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-purple-600 font-medium mb-2">
            Recurring Themes
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            What keeps showing up
          </h2>

          {reflection?.themes &&
          reflection.themes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {reflection.themes.map(
                (theme: string, index: number) => (
                  <span
                    key={index}
                    className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {theme}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Add journal notes during check-ins to reveal
              recurring themes.
            </p>
          )}
        </div>

        {/* Suggested Focus */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-purple-600 font-medium mb-2">
            Suggested Focus
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            This week
          </h2>

          <p className="text-sm text-slate-600 leading-6">
            {reflection?.focus_area ||
              "Add more check-ins and notes to generate a focus area."}
          </p>
        </div>

        {/* Existing Rule-Based Patterns */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-purple-600 font-medium mb-2">
            Detected Patterns
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            What your recent data suggests
          </h2>

          {reflection?.patterns &&
          reflection.patterns.length > 0 ? (
            <div className="space-y-3">
              {reflection.patterns.map(
                (item: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-slate-600 leading-6"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No major patterns detected yet. Add more
              check-ins to improve reflection analysis.
            </p>
          )}
        </div>
      </div>

      {/* K-Means Wellness Pattern Discovery */}
      {wellnessPatterns?.status === "success" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          {/* K-Means Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">
                Wellness Pattern Discovery
              </p>

              <h2 className="text-xl font-bold text-slate-900">
                K-Means Wellness Clusters
              </h2>

              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                Similar historical check-ins are grouped
                using K-Means clustering based on stress,
                sleep, workload, energy, focus, and recovery.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                {wellnessPatterns.data_points} check-ins
                analyzed
              </span>
            </div>
          </div>

          {/* Cluster Cards */}
          <div className="grid lg:grid-cols-3 gap-4">
            {wellnessPatterns.clusters.map(
              (cluster) => {
                const isCurrent =
                  cluster.cluster ===
                  wellnessPatterns.current_cluster;

                return (
                  <div
                    key={cluster.cluster}
                    className={`rounded-2xl border p-5 ${
                      isCurrent
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-100 bg-slate-50"
                    }`}
                  >
                    {/* Cluster Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        Pattern {cluster.cluster}
                      </p>

                      {isCurrent && (
                        <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                          Current Pattern
                        </span>
                      )}
                    </div>

                    {/* Pattern Name */}
                    <h3 className="font-bold text-slate-900 mb-2">
                      {cluster.pattern_name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-6 mb-4">
                      {cluster.description}
                    </p>

                    {/* Centroid Values */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Stress
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.stress}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Sleep
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.sleep}h
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Workload
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.workload}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Energy
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.energy}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Focus
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.focus}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-slate-500 mb-1">
                          Recovery
                        </p>
                        <p className="font-bold text-slate-900">
                          {cluster.centroid.recovery}h
                        </p>
                      </div>
                    </div>

                    {/* Cluster Size */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {cluster.size}
                        </span>{" "}
                        historical check-ins belong to this
                        pattern.
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Algorithm Information */}
          <div className="mt-6 rounded-2xl bg-slate-50 border border-gray-100 p-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className="text-xs text-slate-400">
                  Algorithm
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  K-Means Clustering
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Clusters
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {wellnessPatterns.k}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Data Points
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {wellnessPatterns.data_points}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Iterations
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {wellnessPatterns.iterations}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Converged
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {wellnessPatterns.converged
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionPage;