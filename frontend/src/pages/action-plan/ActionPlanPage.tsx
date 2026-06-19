import { useEffect, useState } from "react";
import { getActionPlans, toggleActionPlan } from "../../api/analyticsApi";

const ActionPlanPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getActionPlans();
        setPlans(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleToggle = async (planId: number) => {
      try {
      const result = await toggleActionPlan(planId);

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId
            ? {
                ...plan,
                is_completed: result.is_completed,
              }
            : plan
        )
      );
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <p className="text-sm text-slate-500">Loading your action plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Recovery Action Plan</p>

        <h1 className="text-3xl font-bold mb-3">
          What you can do next
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Pause turns your wellness signals into small, practical actions that
          help reduce burnout risk and support recovery.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No action plan yet
          </h2>

          <p className="text-sm text-slate-500">
            Submit a daily check-in to generate your recovery action plan.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <button
                    onClick={() => handleToggle(plan.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition ${
                      plan.is_completed
                        ? "bg-green-50 text-green-600"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {plan.is_completed ? "✓" : "☐"}
                  </button>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-2">
                      {plan.title}
                    </h2>
                    {plan.is_completed && (
                    <p className="text-xs text-green-600 font-medium mb-2">
                      Completed
                    </p>
                    )}

                    <p className="text-sm text-slate-600 leading-6">
                      {plan.description}
                    </p>

                    <p className="text-xs text-slate-400 mt-4">
                      Generated from your latest check-in
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <p className="text-sm text-purple-600 font-medium mb-2">
                Plan Progress
              </p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${
                    plans.length
                      ? (plans.filter((p) => p.is_completed).length / plans.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {plans.filter((p) => p.is_completed).length}/{plans.length}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                actions completed
              </p>
            </div>

            <div className="bg-purple-50 rounded-3xl border border-purple-100 p-6">
              <p className="text-sm font-bold text-purple-700 mb-3">
                Why this matters
              </p>

              <p className="text-sm text-slate-700 leading-6">
                Small recovery actions help convert wellness insights into real
                behavior change.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default ActionPlanPage;