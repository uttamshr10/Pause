import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCheckInHistory } from "../../api/wellnessApi";

/* =========================================================
   TYPES
========================================================= */

type JournalEntry = {
  id: number | string;
  checkin_date: string;
  notes: string;
  burnout_score: number;
  mood_score: number;
  stress_level: number;
};

/* =========================================================
   PAGE
========================================================= */

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH JOURNAL ENTRIES
  ======================================================= */

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getCheckInHistory();

        const journalEntries = data.filter(
          (item: JournalEntry) =>
            item.notes &&
            item.notes.trim() !== ""
        );

        setEntries(journalEntries);
      } catch (err) {
        console.error(
          "Failed to load journal entries:",
          err
        );

        setError(
          "We couldn't load your journal entries."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredEntries = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return entries;
    }

    return entries.filter((entry) =>
      entry.notes
        .toLowerCase()
        .includes(query)
    );
  }, [entries, search]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Opening your journal...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-purple-600 mb-2">
            Wellness Journal
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Your reflections
          </h1>

          <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
            Revisit the thoughts you recorded
            during your daily check-ins and
            reflect on how different days felt.
          </p>
        </div>

        <Link
          to="/check-in"
          className="shrink-0 inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
        >
          Daily Check-in
        </Link>
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
          NO JOURNAL YET
      ===================================================== */}

      {entries.length === 0 ? (
        <EmptyJournal />
      ) : (
        <>
          {/* =================================================
              SEARCH / JOURNAL SUMMARY
          ================================================= */}

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}

              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  placeholder="Search your reflections..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-2xl border border-gray-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Count */}

              <div className="md:border-l md:border-gray-100 md:pl-5 shrink-0">
                <p className="text-xs text-slate-400">
                  Reflections
                </p>

                <p className="text-sm font-bold text-slate-800 mt-1">
                  {entries.length}{" "}
                  {entries.length === 1
                    ? "entry"
                    : "entries"}
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              SEARCH STATUS
          ================================================= */}

          {search && (
            <div className="flex items-center justify-between gap-4 px-1">
              <p className="text-sm text-slate-500">
                {filteredEntries.length ===
                0
                  ? "No reflections match your search."
                  : `${filteredEntries.length} ${
                      filteredEntries.length ===
                      1
                        ? "reflection"
                        : "reflections"
                    } found`}
              </p>

              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}

          {/* =================================================
              NO SEARCH RESULTS
          ================================================= */}

          {filteredEntries.length === 0 ? (
            <NoSearchResults
              search={search}
              onClear={() =>
                setSearch("")
              }
            />
          ) : (
            /* ===============================================
               JOURNAL TIMELINE
            =============================================== */

            <section>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Reflection Timeline
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your written reflections from
                  daily wellness check-ins.
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}

                <div className="hidden sm:block absolute left-[19px] top-5 bottom-5 w-px bg-gray-200" />

                <div className="space-y-6">
                  {filteredEntries.map(
                    (entry, index) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        isLatest={
                          index === 0 &&
                          !search
                        }
                      />
                    )
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

/* =========================================================
   JOURNAL ENTRY
========================================================= */

const JournalEntryCard = ({
  entry,
  isLatest,
}: {
  entry: JournalEntry;
  isLatest: boolean;
}) => {
  return (
    <article className="relative sm:pl-14">
      {/* Timeline dot */}

      <div className="hidden sm:flex absolute left-0 top-6 w-10 h-10 rounded-full bg-white border-4 border-purple-100 items-center justify-center z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
      </div>

      {/* Card */}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-7">
          {/* Header */}

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  {formatJournalDate(
                    entry.checkin_date
                  )}
                </p>

                {isLatest && (
                  <span className="rounded-full bg-purple-50 border border-purple-100 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
                    Latest reflection
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-1">
                {entry.checkin_date}
              </p>
            </div>

            {/* Wellness context */}

            <div className="flex flex-wrap gap-2">
              <ContextBadge
                label="Mood"
                value={`${entry.mood_score}/10`}
              />

              <ContextBadge
                label="Stress"
                value={`${entry.stress_level}/10`}
              />

              <ContextBadge
                label="Burnout"
                value={`${entry.burnout_score}/100`}
              />
            </div>
          </div>

          {/* Reflection */}

          <div className="mt-6">
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-purple-200 shrink-0" />

              <p className="text-[15px] text-slate-700 leading-7 whitespace-pre-wrap">
                {entry.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   CONTEXT BADGE
========================================================= */

const ContextBadge = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-full bg-slate-50 border border-gray-100 px-3 py-1.5">
    <span className="text-[11px] text-slate-400">
      {label}
    </span>

    <span className="text-[11px] font-bold text-slate-700 ml-1.5">
      {value}
    </span>
  </div>
);

/* =========================================================
   EMPTY JOURNAL
========================================================= */

const EmptyJournal = () => (
  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-14">
    <div className="max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5">
        <JournalIcon />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        Your journal is waiting
      </h2>

      <p className="text-sm text-slate-500 leading-6 mt-3">
        Add an optional note during a daily
        check-in and it will appear here as part
        of your personal reflection timeline.
      </p>

      <Link
        to="/check-in"
        className="inline-flex mt-7 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
      >
        Complete Daily Check-in
      </Link>
    </div>
  </section>
);

/* =========================================================
   NO SEARCH RESULTS
========================================================= */

const NoSearchResults = ({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) => (
  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
      <SearchIcon />
    </div>

    <h2 className="text-lg font-bold text-slate-900">
      Nothing found
    </h2>

    <p className="text-sm text-slate-500 mt-2">
      No reflections contain &quot;{search}&quot;.
    </p>

    <button
      type="button"
      onClick={onClear}
      className="mt-5 text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
    >
      Show all reflections
    </button>
  </section>
);

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatJournalDate = (
  dateString: string
) => {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
};

/* =========================================================
   ICONS
========================================================= */

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="11"
      cy="11"
      r="8"
    />

    <path d="m21 21-4.35-4.35" />
  </svg>
);

const JournalIcon = () => (
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
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="M8 7h8" />
    <path d="M8 11h6" />
  </svg>
);

export default JournalPage;