import { useEffect, useState } from "react";
import { getReflection } from "../../api/analyticsApi";

const ReflectionPage = () => {
  const [reflection, setReflection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        const data = await getReflection();
        setReflection(data);
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
        <p className="text-sm text-slate-500">Analyzing your reflections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Reflection Engine</p>

        <h1 className="text-3xl font-bold mb-3">
          Understand your wellness patterns
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause analyzes your journal notes and check-in signals to highlight
          recurring themes, wellness patterns, and focus areas.
        </p>
      </div>

      <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-purple-600 font-medium mb-2">
          Reflection Summary
        </p>

        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Personal Pattern Analysis
        </h2>

        <p className="text-sm text-slate-600 leading-7">
          {reflection?.summary || "Not enough data available yet."}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-purple-600 font-medium mb-2">
            Recurring Themes
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            What keeps showing up
          </h2>

          {reflection?.themes?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {reflection.themes.map((theme: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-50 text-purple-700 border border-purple-100 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Add journal notes during check-ins to reveal recurring themes.
            </p>
          )}
        </div>

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
         <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <p className="text-sm text-purple-600 font-medium mb-2">
            Detected Patterns
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            What your data suggests
          </h2>

          {reflection?.patterns?.length > 0 ? (
            <div className="space-y-3">
              {reflection.patterns.map((item: string, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-slate-600 leading-6"
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No major patterns detected yet. Add more check-ins to improve reflection analysis.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionPage;