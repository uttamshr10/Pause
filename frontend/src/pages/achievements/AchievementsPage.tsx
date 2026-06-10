import { useEffect, useState } from "react";
import { getAchievements } from "../../api/analyticsApi";

const AchievementsPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const result = await getAchievements();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAchievements();
  }, []);
  const getAchievementIcon = (title: string) => {
  if (title.includes("First Check-in")) return "🎯";
  if (title.includes("Consistent")) return "🔥";
  if (title.includes("Reflection")) return "📔";
  if (title.includes("Sleep")) return "🌙";
  if (title.includes("Low Risk")) return "🛡️";

  return "🏆";
};
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Achievements</p>
        <h1 className="text-3xl font-bold mb-3">Your wellness milestones</h1>
        <p className="text-purple-100 max-w-2xl">
          Track progress, consistency, and positive wellness habits as you use Pause.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-slate-500">Unlocked achievements</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">
          {data?.total_unlocked ?? 0}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.achievements?.length > 0 ? (
          data.achievements.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                {getAchievementIcon(item.title)}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 leading-6">
                {item.description}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-2">
              No achievements yet
            </h2>
            <p className="text-sm text-slate-500">
              Start checking in daily to unlock wellness milestones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;