import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCheckInHistory } from "../../api/wellnessApi";

/* =========================================================
   TYPES
========================================================= */

type CheckIn = {
  id: number;
  mood_score: number;
  stress_level: number;
  sleep_hours: number;
  workload_level: number;
  focus_level: number;
  recovery_time: number;
  energy_level: number;
  work_satisfaction: number;
  burnout_score: number;
  risk_level: string;
  notes?: string;
  checkin_date: string;
  created_at: string;
};

type RiskFilter =
  | "all"
  | "low"
  | "moderate"
  | "high"
  | "critical";

/* =========================================================
   PAGE
========================================================= */

const CheckInHistoryPage = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] =
    useState<RiskFilter>("all");

  const [selectedCheckIn, setSelectedCheckIn] =
    useState<CheckIn | null>(null);

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    const fetchCheckIns = async () => {
      try {
        const data = await getCheckInHistory();
        setCheckIns(data);
      } catch (err) {
        console.error(
          "Failed to load check-in history:",
          err
        );

        setError(
          "We couldn't load your check-in history right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();
  }, []);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const latestCheckIn = checkIns[0];

  const filteredCheckIns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return checkIns.filter((checkIn) => {
      const normalizedRisk =
        normalizeRisk(checkIn.risk_level);

      const matchesRisk =
        riskFilter === "all" ||
        normalizedRisk === riskFilter;

      const matchesSearch =
        !query ||
        checkIn.checkin_date
          .toLowerCase()
          .includes(query) ||
        (checkIn.notes ?? "")
          .toLowerCase()
          .includes(query);

      return matchesRisk && matchesSearch;
    });
  }, [checkIns, search, riskFilter]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your wellness history...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-9 pb-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-purple-600 mb-2">
              Check-in History
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Your wellness record
            </h1>

            <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
              Look back through your daily
              check-ins and review how your
              wellness signals have changed over
              time.
            </p>
          </div>

          <Link
            to="/check-in"
            className="shrink-0 inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
          >
            Daily Check-in
          </Link>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {checkIns.length === 0 ? (
          <EmptyHistory />
        ) : (
          <>
            {/* =============================================
                HISTORY OVERVIEW
            ============================================= */}

            <section>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard
                  label="Total Check-ins"
                  value={checkIns.length}
                  description="Days recorded"
                />

                <OverviewCard
                  label="Latest Burnout"
                  value={`${formatNumber(
                    latestCheckIn.burnout_score
                  )}/100`}
                  description="Latest calculated score"
                />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-medium text-slate-400">
                    Latest Risk
                  </p>

                  <div className="mt-3">
                    <RiskBadge
                      risk={latestCheckIn.risk_level}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-3">
                    Latest check-in classification
                  </p>
                </div>

                <OverviewCard
                  label="Latest Check-in"
                  value={formatShortDate(
                    latestCheckIn.checkin_date
                  )}
                  description={
                    latestCheckIn.checkin_date
                  }
                />
              </div>
            </section>

            {/* =============================================
                FILTERS
            ============================================= */}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}

                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <SearchIcon />
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search by date or journal note..."
                    className="w-full rounded-2xl border border-gray-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Risk filters */}

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "all",
                      "low",
                      "moderate",
                      "high",
                      "critical",
                    ] as RiskFilter[]
                  ).map((risk) => (
                    <button
                      key={risk}
                      type="button"
                      onClick={() =>
                        setRiskFilter(risk)
                      }
                      className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold capitalize transition cursor-pointer ${
                        riskFilter === risk
                          ? "bg-purple-600 text-white"
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {risk === "all"
                        ? "All"
                        : risk}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* =============================================
                RECORDS
            ============================================= */}

            <section>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Daily records
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Select a check-in to review
                    all recorded wellness
                    details.
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-400">
                  {filteredCheckIns.length}{" "}
                  {filteredCheckIns.length === 1
                    ? "record"
                    : "records"}
                </p>
              </div>

              {filteredCheckIns.length === 0 ? (
                <NoResults
                  onClear={() => {
                    setSearch("");
                    setRiskFilter("all");
                  }}
                />
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Desktop header */}

                  <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_100px] gap-4 px-6 py-3.5 bg-slate-50 border-b border-gray-100">
                    <TableHeading>
                      Date
                    </TableHeading>

                    <TableHeading>
                      Burnout
                    </TableHeading>

                    <TableHeading>
                      Risk
                    </TableHeading>

                    <TableHeading>
                      Mood
                    </TableHeading>

                    <TableHeading>
                      Stress
                    </TableHeading>

                    <span />
                  </div>

                  {/* Rows */}

                  {filteredCheckIns.map(
                    (checkIn, index) => (
                      <HistoryRow
                        key={checkIn.id}
                        checkIn={checkIn}
                        isLatest={
                          checkIn.id ===
                          latestCheckIn.id
                        }
                        isLast={
                          index ===
                          filteredCheckIns.length -
                            1
                        }
                        onView={() =>
                          setSelectedCheckIn(
                            checkIn
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ===================================================
          DETAILS MODAL
      =================================================== */}

      {selectedCheckIn && (
        <CheckInDetailsModal
          checkIn={selectedCheckIn}
          onClose={() =>
            setSelectedCheckIn(null)
          }
        />
      )}
    </>
  );
};

/* =========================================================
   HISTORY ROW
========================================================= */

const HistoryRow = ({
  checkIn,
  isLatest,
  isLast,
  onView,
}: {
  checkIn: CheckIn;
  isLatest: boolean;
  isLast: boolean;
  onView: () => void;
}) => (
  <article
    className={`${
      !isLast
        ? "border-b border-gray-100"
        : ""
    }`}
  >
    {/* Desktop */}

    <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr_100px] gap-4 items-center px-6 py-5 hover:bg-slate-50/60 transition">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800">
            {formatShortDate(
              checkIn.checkin_date
            )}
          </p>

          {isLatest && (
            <span className="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-600 uppercase tracking-wide">
              Latest
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          {checkIn.checkin_date}
        </p>
      </div>

      <p className="text-sm font-bold text-slate-800">
        {formatNumber(
          checkIn.burnout_score
        )}
        <span className="font-normal text-slate-400">
          /100
        </span>
      </p>

      <div>
        <RiskBadge
          risk={checkIn.risk_level}
        />
      </div>

      <p className="text-sm text-slate-600">
        {checkIn.mood_score}/10
      </p>

      <p className="text-sm text-slate-600">
        {checkIn.stress_level}/10
      </p>

      <button
        type="button"
        onClick={onView}
        className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
      >
        View details
      </button>
    </div>

    {/* Mobile */}

    <div className="md:hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-900">
              {formatShortDate(
                checkIn.checkin_date
              )}
            </p>

            {isLatest && (
              <span className="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold text-purple-600 uppercase tracking-wide">
                Latest
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            {checkIn.checkin_date}
          </p>
        </div>

        <RiskBadge
          risk={checkIn.risk_level}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <MobileMetric
          label="Burnout"
          value={`${formatNumber(
            checkIn.burnout_score
          )}/100`}
        />

        <MobileMetric
          label="Mood"
          value={`${checkIn.mood_score}/10`}
        />

        <MobileMetric
          label="Stress"
          value={`${checkIn.stress_level}/10`}
        />
      </div>

      <button
        type="button"
        onClick={onView}
        className="w-full mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-purple-600 hover:bg-purple-50 cursor-pointer transition"
      >
        View complete check-in
      </button>
    </div>
  </article>
);

/* =========================================================
   DETAILS MODAL
========================================================= */

const CheckInDetailsModal = ({
  checkIn,
  onClose,
}: {
  checkIn: CheckIn;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}

        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 md:px-7 py-5 flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Daily Check-in
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {formatFullDate(
                checkIn.checkin_date
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {checkIn.checkin_date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 md:p-7 space-y-7">
          {/* Burnout summary */}

          <section className="rounded-3xl bg-purple-50 border border-purple-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-xs text-purple-600 font-semibold">
                  Burnout Score
                </p>

                <div className="flex items-end gap-2 mt-1">
                  <p className="text-4xl font-bold text-slate-900">
                    {formatNumber(
                      checkIn.burnout_score
                    )}
                  </p>

                  <p className="text-sm text-slate-400 pb-1">
                    /100
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-purple-600 font-semibold mb-2">
                  Risk Level
                </p>

                <RiskBadge
                  risk={checkIn.risk_level}
                />
              </div>
            </div>
          </section>

          {/* How you felt */}

          <DetailSection
            number="01"
            title="How you felt"
          >
            <div className="grid sm:grid-cols-3 gap-3">
              <DetailMetric
                label="Mood"
                value={`${checkIn.mood_score}/10`}
              />

              <DetailMetric
                label="Stress"
                value={`${checkIn.stress_level}/10`}
              />

              <DetailMetric
                label="Energy"
                value={`${checkIn.energy_level}/10`}
              />
            </div>
          </DetailSection>

          {/* Work */}

          <DetailSection
            number="02"
            title="Work & focus"
          >
            <div className="grid sm:grid-cols-3 gap-3">
              <DetailMetric
                label="Workload"
                value={`${checkIn.workload_level}/10`}
              />

              <DetailMetric
                label="Focus"
                value={`${checkIn.focus_level}/10`}
              />

              <DetailMetric
                label="Work Satisfaction"
                value={`${checkIn.work_satisfaction}/10`}
              />
            </div>
          </DetailSection>

          {/* Rest */}

          <DetailSection
            number="03"
            title="Rest & recovery"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <DetailMetric
                label="Sleep"
                value={`${checkIn.sleep_hours} hrs`}
              />

              <DetailMetric
                label="Recovery Time"
                value={`${checkIn.recovery_time} hrs`}
              />
            </div>
          </DetailSection>

          {/* Note */}

          <DetailSection
            number="04"
            title="Your note"
          >
            {checkIn.notes &&
            checkIn.notes.trim() ? (
              <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">
                <p className="text-sm text-slate-600 leading-7 whitespace-pre-wrap">
                  {checkIn.notes}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 border border-gray-100 p-5">
                <p className="text-sm text-slate-400">
                  No note was added for this
                  check-in.
                </p>
              </div>
            )}
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DETAIL SECTION
========================================================= */

const DetailSection = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[10px] font-bold text-purple-500">
        {number}
      </span>

      <h3 className="text-sm font-bold text-slate-900">
        {title}
      </h3>
    </div>

    {children}
  </section>
);

/* =========================================================
   DETAIL METRIC
========================================================= */

const DetailMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl bg-slate-50 border border-gray-100 p-4">
    <p className="text-xs text-slate-400">
      {label}
    </p>

    <p className="text-lg font-bold text-slate-800 mt-1">
      {value}
    </p>
  </div>
);

/* =========================================================
   OVERVIEW CARD
========================================================= */

const OverviewCard = ({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
    <p className="text-xs font-medium text-slate-400">
      {label}
    </p>

    <p className="text-2xl font-bold text-slate-900 mt-2">
      {value}
    </p>

    <p className="text-xs text-slate-400 mt-2">
      {description}
    </p>
  </div>
);

/* =========================================================
   RISK BADGE
========================================================= */

const RiskBadge = ({
  risk,
}: {
  risk: string;
}) => {
  const normalized =
    normalizeRisk(risk);

  const styles: Record<
    string,
    string
  > = {
    low: "bg-green-50 text-green-700 border-green-100",
    moderate:
      "bg-amber-50 text-amber-700 border-amber-100",
    high: "bg-orange-50 text-orange-700 border-orange-100",
    critical:
      "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
        styles[normalized] ??
        "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {normalized}
    </span>
  );
};

/* =========================================================
   TABLE HEADING
========================================================= */

const TableHeading = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
    {children}
  </p>
);

/* =========================================================
   MOBILE METRIC
========================================================= */

const MobileMetric = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-[10px] text-slate-400">
      {label}
    </p>

    <p className="text-xs font-bold text-slate-700 mt-1">
      {value}
    </p>
  </div>
);

/* =========================================================
   NO RESULTS
========================================================= */

const NoResults = ({
  onClear,
}: {
  onClear: () => void;
}) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
      <SearchIcon />
    </div>

    <h3 className="text-lg font-bold text-slate-900">
      No matching check-ins
    </h3>

    <p className="text-sm text-slate-500 mt-2">
      Try changing your search or risk
      filter.
    </p>

    <button
      type="button"
      onClick={onClear}
      className="text-sm font-semibold text-purple-600 hover:text-purple-700 mt-5 cursor-pointer"
    >
      Clear filters
    </button>
  </div>
);

/* =========================================================
   EMPTY HISTORY
========================================================= */

const EmptyHistory = () => (
  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-14">
    <div className="max-w-xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5">
        <HistoryIcon />
      </div>

      <h2 className="text-2xl font-bold text-slate-900">
        Your wellness history starts here
      </h2>

      <p className="text-sm text-slate-500 leading-6 mt-3">
        Complete your first daily check-in
        to begin building a record of your
        wellness signals over time.
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
   HELPERS
========================================================= */

const normalizeRisk = (
  risk: string
) => {
  const normalized =
    risk?.toLowerCase() || "unknown";

  /*
   * Supports historical "medium" values
   * while presenting the current system
   * terminology as "moderate".
   */
  if (normalized === "medium") {
    return "moderate";
  }

  return normalized;
};

const formatNumber = (
  value: number
) => {
  if (
    typeof value !== "number" ||
    Number.isNaN(value)
  ) {
    return "--";
  }

  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
};

const formatShortDate = (
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const formatFullDate = (
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

const HistoryIcon = () => (
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
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export default CheckInHistoryPage;