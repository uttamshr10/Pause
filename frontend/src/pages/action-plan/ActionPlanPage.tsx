import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getActionPlans,
  toggleActionPlan,
} from "../../api/analyticsApi";

/* =========================================================
   TYPES
========================================================= */

type ActionPlan = {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
};

/* =========================================================
   PAGE
========================================================= */

const ActionPlanPage = () => {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH PLANS
  ======================================================= */

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getActionPlans();
        setPlans(data);
      } catch (err) {
        console.error(
          "Failed to load action plans:",
          err
        );

        setError(
          "We couldn't load your recovery actions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  /* =======================================================
     TOGGLE PLAN
  ======================================================= */

  const handleToggle = async (
    planId: number
  ) => {
    if (updatingId !== null) return;

    setUpdatingId(planId);
    setError("");

    try {
      const result =
        await toggleActionPlan(planId);

      setPlans((previous) =>
        previous.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                is_completed:
                  result.is_completed,
              }
            : plan
        )
      );
    } catch (err) {
      console.error(
        "Failed to update action:",
        err
      );

      setError(
        "We couldn't update that action. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const pendingPlans = useMemo(
    () =>
      plans.filter(
        (plan) => !plan.is_completed
      ),
    [plans]
  );

  const completedPlans = useMemo(
    () =>
      plans.filter(
        (plan) => plan.is_completed
      ),
    [plans]
  );

  const completedCount =
    completedPlans.length;

  const totalCount =
    plans.length;

  const completionRate =
    totalCount > 0
      ? Math.round(
          (completedCount / totalCount) * 100
        )
      : 0;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your recovery plan...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-purple-600 mb-2">
            Recovery Plan
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Your next steps
          </h1>

          <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
            Small actions based on your recent
            wellness check-in to help you make time
            for recovery.
          </p>
        </div>

        <Link
          to="/check-in"
          className="text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          Daily check-in →
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
          EMPTY STATE
      ===================================================== */}

      {plans.length === 0 ? (
        <EmptyPlanState />
      ) : (
        <>
          {/* =================================================
              PROGRESS OVERVIEW
          ================================================= */}

          <section className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-7 text-white shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
              <div>
                <p className="text-sm text-purple-100 mb-2">
                  Today&apos;s Recovery Progress
                </p>

                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-bold">
                    {completionRate}%
                  </h2>

                  <span className="text-sm text-purple-200 mb-1">
                    complete
                  </span>
                </div>

                <p className="text-sm text-purple-100 mt-3">
                  {getProgressMessage(
                    completedCount,
                    totalCount
                  )}
                </p>
              </div>

              <div className="lg:w-80">
                <div className="flex items-center justify-between text-xs text-purple-100 mb-2">
                  <span>
                    {completedCount} completed
                  </span>

                  <span>
                    {totalCount} total
                  </span>
                </div>

                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              REMAINING ACTIONS
          ================================================= */}

          <section>
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {pendingPlans.length > 0
                    ? "Focus for today"
                    : "Today's plan is complete"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {pendingPlans.length > 0
                    ? `${pendingPlans.length} ${
                        pendingPlans.length === 1
                          ? "action"
                          : "actions"
                      } remaining.`
                    : "You've completed all of your recovery actions."}
                </p>
              </div>
            </div>

            {pendingPlans.length > 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {pendingPlans.map(
                  (plan, index) => (
                    <PendingAction
                      key={plan.id}
                      plan={plan}
                      number={index + 1}
                      updating={
                        updatingId === plan.id
                      }
                      onToggle={() =>
                        handleToggle(plan.id)
                      }
                      isLast={
                        index ===
                        pendingPlans.length - 1
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <AllCompleteCard />
            )}
          </section>

          {/* =================================================
              COMPLETED
          ================================================= */}

          {completedPlans.length > 0 && (
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Completed
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Recovery actions you&apos;ve already
                  finished.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {completedPlans.map(
                  (plan, index) => (
                    <CompletedAction
                      key={plan.id}
                      plan={plan}
                      updating={
                        updatingId === plan.id
                      }
                      onToggle={() =>
                        handleToggle(plan.id)
                      }
                      isLast={
                        index ===
                        completedPlans.length - 1
                      }
                    />
                  )
                )}
              </div>
            </section>
          )}

          {/* =================================================
              CONTEXT
          ================================================= */}

          <section className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">
                i
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Where these actions come from
                </h3>

                <p className="text-sm text-slate-500 leading-6 mt-2 max-w-3xl">
                  Pause uses your latest check-in to
                  identify areas such as stress,
                  workload, sleep, energy, focus and
                  recovery that may need attention.
                  Your action plan turns those signals
                  into practical steps for the day.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

/* =========================================================
   PENDING ACTION
========================================================= */

const PendingAction = ({
  plan,
  number,
  updating,
  onToggle,
  isLast,
}: {
  plan: ActionPlan;
  number: number;
  updating: boolean;
  onToggle: () => void;
  isLast: boolean;
}) => {
  return (
    <div
      className={`p-6 ${
        !isLast
          ? "border-b border-gray-100"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Number */}

        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
          {String(number).padStart(
            2,
            "0"
          )}
        </div>

        {/* Content */}

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900">
            {plan.title}
          </h3>

          <p className="text-sm text-slate-500 leading-6 mt-2 max-w-2xl">
            {plan.description}
          </p>
        </div>

        {/* Complete button */}

        <button
          type="button"
          onClick={onToggle}
          disabled={updating}
          className="shrink-0 cursor-pointer rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating
            ? "Saving..."
            : "Mark complete"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   COMPLETED ACTION
========================================================= */

const CompletedAction = ({
  plan,
  updating,
  onToggle,
  isLast,
}: {
  plan: ActionPlan;
  updating: boolean;
  onToggle: () => void;
  isLast: boolean;
}) => {
  return (
    <div
      className={`p-5 ${
        !isLast
          ? "border-b border-gray-100"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold shrink-0">
          ✓
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-500 line-through">
            {plan.title}
          </h3>

          <p className="text-xs text-slate-400 leading-5 mt-1">
            {plan.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          disabled={updating}
          className="text-xs font-medium text-slate-400 hover:text-purple-600 transition cursor-pointer disabled:opacity-50"
        >
          {updating
            ? "Saving..."
            : "Undo"}
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   ALL COMPLETE
========================================================= */

const AllCompleteCard = () => {
  return (
    <div className="bg-green-50 rounded-3xl border border-green-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-white text-green-600 flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
          ✓
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Nice work. You&apos;ve completed
            today&apos;s plan.
          </h3>

          <p className="text-sm text-slate-600 leading-6 mt-2">
            Your recovery actions are complete. Keep
            the rest of your day manageable and check
            in again tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY PLAN
========================================================= */

const EmptyPlanState = () => {
  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 md:p-14">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-5 font-bold text-lg">
          ✓
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          No recovery plan yet
        </h2>

        <p className="text-sm text-slate-500 leading-6 mt-3">
          Complete today&apos;s wellness check-in and
          Pause will create practical recovery actions
          based on your responses.
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
};

/* =========================================================
   PROGRESS MESSAGE
========================================================= */

const getProgressMessage = (
  completed: number,
  total: number
) => {
  if (total === 0) {
    return "Complete a check-in to create your recovery plan.";
  }

  if (completed === 0) {
    return "Your recovery plan is ready. Start with one small action.";
  }

  if (completed === total) {
    return "You've completed every recovery action for today.";
  }

  const remaining =
    total - completed;

  return `${remaining} ${
    remaining === 1
      ? "action"
      : "actions"
  } left for today.`;
};

export default ActionPlanPage;