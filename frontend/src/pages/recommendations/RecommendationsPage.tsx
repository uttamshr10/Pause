import { useEffect, useState } from "react";
import { getRecommendations } from "../../api/analyticsApi";

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          Loading recommendations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">
          Smart Recommendations
        </p>

        <h1 className="text-3xl font-bold mb-3">
          Personalized wellness actions
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause turns your check-in data into practical suggestions that help
          you improve sleep, stress, workload, focus, and recovery.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No recommendations yet
          </h2>

          <p className="text-sm text-slate-500">
            Submit a daily check-in to generate personalized wellness
            recommendations.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl mb-4">
                💡
              </div>

              <p className="text-sm text-purple-600 font-medium mb-2">
                Recommendation
              </p>

              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Action Suggestion
              </h2>

              <p className="text-sm text-slate-600 leading-6">
                {item.content}
              </p>

              <p className="text-xs text-slate-400 mt-5">
                Generated from your wellness data
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;