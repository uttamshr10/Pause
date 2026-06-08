import { useEffect, useState } from "react";
import { getCheckInHistory } from "../../api/wellnessApi";

const JournalPage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getCheckInHistory();

        const journalEntries = data.filter(
          (item: any) => item.notes && item.notes.trim() !== ""
        );

        setEntries(journalEntries);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((entry) =>
    entry.notes.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-sm text-slate-500">Loading journal entries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Wellness Journal</p>

        <h1 className="text-3xl font-bold mb-3">
          Your reflection timeline
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Review notes you wrote during daily check-ins and look back on how
          your thoughts, workload, and mood changed over time.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
        <input
          type="text"
          placeholder="Search your journal notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No journal entries found
          </h2>

          <p className="text-sm text-slate-500">
            Add notes during your daily check-ins to build your wellness
            journal.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-slate-900">
                    {entry.checkin_date}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Burnout Score: {entry.burnout_score}/100
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="bg-purple-50 text-purple-700 border border-purple-100 text-xs px-3 py-1 rounded-full">
                    Mood {entry.mood_score}/10
                  </span>

                  <span className="bg-gray-50 text-slate-600 border border-gray-100 text-xs px-3 py-1 rounded-full">
                    Stress {entry.stress_level}/10
                  </span>
                </div>
              </div>

              <p className="text-slate-700 leading-7 text-sm">
                {entry.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalPage;