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

  const totalUnlocked = data?.total_unlocked ?? 0;
  const totalPossible = data?.total_possible ?? 16;

  const getRarityStyle = (rarity: string) => {
    if (rarity === "legendary") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    if (rarity === "rare") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Achievements</p>
        <h1 className="text-3xl font-bold mb-3">Your wellness milestones</h1>
        <p className="text-purple-100 max-w-2xl">
          Unlock milestones by checking in, reflecting, protecting recovery, and
          building healthier routines.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-slate-500">Achievement Progress</p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">
          {totalUnlocked}/{totalPossible} unlocked
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.achievements?.length > 0 ? (
          data.achievements.map((item: any, index: number) => (
            <div
              key={index}
              className={`rounded-3xl border p-6 shadow-sm transition ${
                item.status === "unlocked"
                  ? "bg-white border-gray-100 hover:shadow-md"
                  : "bg-gray-50 border-gray-100 opacity-80"
              }`}
            >
              <div className="flex justify-between items-start mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                    item.status === "unlocked"
                      ? "bg-purple-50"
                      : "bg-gray-100 grayscale"
                  }`}
                >
                  {item.status === "unlocked" ? item.icon || "🏆" : "🔒"}
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border capitalize font-medium ${
                    item.status === "unlocked"
                      ? getRarityStyle(item.rarity)
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {item.status === "unlocked"
                    ? item.rarity || "common"
                    : "Locked"}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mb-2 ${
                  item.status === "unlocked"
                    ? "text-slate-900"
                    : "text-slate-500"
                }`}
              >
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 leading-6">
                {item.description}
              </p>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p
                  className={`text-xs font-semibold ${
                    item.status === "unlocked"
                      ? "text-green-600"
                      : "text-slate-500"
                  }`}
                >
                  {item.status === "unlocked"
                    ? "Unlocked"
                    : `${item.progress}/${item.target} completed`}
                </p>

                {item.status === "locked" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Complete {item.remaining} more to unlock.
                  </p>
                )}
              </div>
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