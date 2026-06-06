import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../api/userApi";

const GoalSettingsPage = () => {
  const [form, setForm] = useState({
    sleep_goal: 7,
    recovery_goal: 1,
  });

  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setForm({
        sleep_goal: data.sleep_goal,
        recovery_goal: data.recovery_goal,
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    await updateUserProfile(form);

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

        <div>
          <label className="text-sm font-semibold text-slate-900">
            Sleep Goal (hours)
          </label>
          <input
            type="number"
            name="sleep_goal"
            value={form.sleep_goal}
            onChange={handleChange}
            min="0"
            max="24"
            step="0.5"
            className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900">
            Recovery Goal (hours)
          </label>
          <input
            type="number"
            name="recovery_goal"
            value={form.recovery_goal}
            onChange={handleChange}
            min="0"
            max="12"
            step="0.5"
            className="mt-2 w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold"
        >
          Save Goals
        </button>
      </form>
    </div>
  );
};

export default GoalSettingsPage;