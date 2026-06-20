import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../api/userApi";

const GoalSettingsPage = () => {
  const [form, setForm] = useState({
    sleep_goal: "",
    recovery_goal: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();

      setForm({
        sleep_goal: String(data.sleep_goal ?? 7),
        recovery_goal: String(data.recovery_goal ?? 1),
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const sleepGoal = Number(form.sleep_goal);
    const recoveryGoal = Number(form.recovery_goal);

    if (Number.isNaN(sleepGoal) || sleepGoal < 1 || sleepGoal > 24) {
      setError("Sleep goal must be between 1 and 24 hours.");
      return;
    }

    if (
      Number.isNaN(recoveryGoal) ||
      recoveryGoal < 0 ||
      recoveryGoal > 12
    ) {
      setError("Recovery goal must be between 0 and 12 hours.");
      return;
    }

    await updateUserProfile({
      sleep_goal: sleepGoal,
      recovery_goal: recoveryGoal,
    });

    setSuccess("Goals updated successfully.");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Goal Settings
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Set your personal wellness goals for sleep and recovery.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5"
      >
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-slate-900">
            Sleep Goal (hours)
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="sleep_goal"
            value={form.sleep_goal}
            onChange={handleChange}
            className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900">
            Recovery Goal (hours)
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="recovery_goal"
            value={form.recovery_goal}
            onChange={handleChange}
            className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold"
        >
          Save Goals
        </button>
      </form>
    </div>
  );
};

export default GoalSettingsPage;