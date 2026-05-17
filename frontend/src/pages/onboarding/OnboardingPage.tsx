import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../api/userApi";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    avg_sleep_hours: 7,
    avg_work_hours: 8,
    stress_baseline: 5,
    user_type: "employee",
    wellness_goal: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "number" || type === "range" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateUserProfile(form);
      navigate("/dashboard");
    } catch {
      setError("Could not save onboarding details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-800 mb-6">Pause</h1>

          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
            <p className="text-sm text-purple-100 mb-2">Onboarding</p>
            <h2 className="text-3xl font-bold mb-3">
              Let’s understand your baseline.
            </h2>
            <p className="text-purple-100 max-w-2xl">
              These details help Pause compare your daily check-ins with your normal routine.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-900">
                User Type
              </label>
              <select
                name="user_type"
                value={form.user_type}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">
                Average Sleep Hours
              </label>
              <input
                type="number"
                name="avg_sleep_hours"
                value={form.avg_sleep_hours}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900">
                Average Work Hours
              </label>
              <input
                type="number"
                name="avg_work_hours"
                value={form.avg_work_hours}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Stress Baseline
                </label>
                <span className="text-sm font-semibold text-purple-600">
                  {form.stress_baseline}/10
                </span>
              </div>

              <input
                type="range"
                name="stress_baseline"
                value={form.stress_baseline}
                onChange={handleChange}
                min="1"
                max="10"
                className="mt-4 w-full accent-purple-600"
              />

              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Calm</span>
                <span>High stress</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-900">
              Wellness Goal
            </label>
            <textarea
              name="wellness_goal"
              value={form.wellness_goal}
              onChange={handleChange}
              rows={4}
              placeholder="Example: I want to reduce stress and improve my sleep routine."
              className="mt-2 w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl hover:opacity-90 transition shadow-md disabled:opacity-60"
          >
            {loading ? "Saving..." : "Complete Onboarding"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;