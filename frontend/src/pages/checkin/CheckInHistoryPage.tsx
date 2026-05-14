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
  notes?: string;
  checkin_date: string;
  burnout_score: number;
  risk_level: string;
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
    } catch (err: any) {
      setError("Failed to load check-in history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading check-in history...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Check-in History</h1>
        <p className="text-gray-600 text-sm">
          Review your previous wellness check-ins.
        </p>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      {checkIns.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <p className="text-gray-500">No check-ins submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Mood</th>
                <th className="p-3">Stress</th>
                <th className="p-3">Sleep</th>
                <th className="p-3">Workload</th>
                <th className="p-3">Energy</th>
                <th className="p-3">Satisfaction</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>

            <tbody>
              {checkIns.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.checkin_date}</td>
                  <td className="p-3">{item.mood_score}/10</td>
                  <td className="p-3">{item.stress_level}/10</td>
                  <td className="p-3">{item.sleep_hours} hrs</td>
                  <td className="p-3">{item.workload_level}/10</td>
                  <td className="p-3">{item.energy_level}/10</td>
                  <td className="p-3">{item.work_satisfaction}/10</td>
                  <td className="p-3 text-gray-500">
                    {item.notes || "-"}
                  </td>
                  <td>{item.burnout_score}</td>
                  <td className={
                    item.risk_level === "high"
                    ? "text-red-500"
                    : item.risk_level === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                  }>{item.risk_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckInHistoryPage;