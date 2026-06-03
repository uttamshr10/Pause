import { useEffect, useState } from "react";
import { getCheckInHistory } from "../../api/wellnessApi";

const JournalPage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getCheckInHistory();

        const filtered = data.filter(
          (item: any) =>
            item.notes &&
            item.notes.trim() !== ""
        );

        setEntries(filtered);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEntries();
  }, []);

  const filteredEntries = entries.filter((entry) =>
    entry.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white">
        <p className="text-sm text-purple-100 mb-2">
          Wellness Journal
        </p>

        <h1 className="text-3xl font-bold mb-3">
          Your personal reflections
        </h1>

        <p className="text-purple-100">
          Review thoughts, feelings, and wellness notes
          captured during your daily check-ins.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-5">
        <input
          type="text"
          placeholder="Search journal entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3"
        />
      </div>

      <div className="space-y-5">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
            <h2 className="font-bold text-gray-900 mb-2">
              No journal entries found
            </h2>

            <p className="text-gray-500 text-sm">
              Add notes during your daily check-ins to build your journal.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {entry.checkin_date}
                  </p>

                  <p className="text-sm text-gray-500">
                    Burnout Score: {entry.burnout_score}
                  </p>
                </div>

                <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">
                  Mood {entry.mood_score}/10
                </span>
              </div>

              <p className="text-gray-700 leading-7">
                {entry.notes}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JournalPage;