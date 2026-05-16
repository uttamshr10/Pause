import { useEffect, useState } from "react";
import { getCheckInHistory } from "../../api/wellnessApi";

type CheckIn = {
  id: number;
  mood_score: number;
  stress_level: number;
  sleep_hours: number;
  workload_level: number;
  energy_level: number;
  work_satisfaction: number;
  burnout_score: number;
  risk_level: string;
  notes?: string;
  checkin_date: string;
  created_at: string;
};

const CheckInHistoryPage = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCheckIns();
  }, []);

  const fetchCheckIns = async () => {
    try {
      const data = await getCheckInHistory();
      setCheckIns(data);
    } catch {
      setError("Failed to load check-in history.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyle = (risk: string) => {
    if (risk === "high") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (risk === "medium" || risk === "moderate") {
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    }

    if (risk === "critical") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-green-50 text-green-600 border-green-100";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-gray-500">Loading wellness history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Wellness Records</p>

        <h1 className="text-3xl font-bold mb-3">Check-in History</h1>

        <p className="text-purple-100 max-w-2xl">
          Review your past wellness entries, burnout scores, and risk levels
          over time.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {checkIns.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No check-ins yet
          </h2>
          <p className="text-gray-500 text-sm">
            Submit your first daily check-in to start building your wellness
            history.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Check-ins
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your daily wellness signals and calculated burnout risk.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Burnout</th>
                  <th className="text-left p-4 font-medium">Risk</th>
                  <th className="text-left p-4 font-medium">Mood</th>
                  <th className="text-left p-4 font-medium">Stress</th>
                  <th className="text-left p-4 font-medium">Sleep</th>
                  <th className="text-left p-4 font-medium">Workload</th>
                  <th className="text-left p-4 font-medium">Energy</th>
                  <th className="text-left p-4 font-medium">Satisfaction</th>
                  <th className="text-left p-4 font-medium">Notes</th>
                </tr>
              </thead>

              <tbody>
                {checkIns.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="p-4 text-gray-900 font-medium">
                      {item.checkin_date}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-gray-900">
                        {item.burnout_score}
                      </span>
                      <span className="text-gray-400">/100</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getRiskStyle(
                          item.risk_level
                        )}`}
                      >
                        {item.risk_level}
                      </span>
                    </td>

                    <td className="p-4 text-gray-600">{item.mood_score}/10</td>
                    <td className="p-4 text-gray-600">
                      {item.stress_level}/10
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.sleep_hours} hrs
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.workload_level}/10
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.energy_level}/10
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.work_satisfaction}/10
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">
                      {item.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInHistoryPage;