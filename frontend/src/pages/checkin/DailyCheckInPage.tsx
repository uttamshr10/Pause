import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitDailyCheckIn } from "../../api/wellnessApi";

const DailyCheckInPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mood_score: 5,
    stress_level: 5,
    sleep_hours: 7,
    workload_level: 5,
    energy_level: 5,
    work_satisfaction: 5,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setSuccess("");
    setError("");

    try {
      await submitDailyCheckIn(form);
      setSuccess("Daily check-in submitted successfully.");

      setTimeout(() => {
        navigate("/check-in/history");
      }, 800);
    } catch {
      setError("You may have already submitted today's check-in.");
    } finally {
      setLoading(false);
    }
  };

  const RangeInput = ({
    label,
    name,
    value,
    helper,
    lowLabel,
    highLabel,
  }: {
    label: string;
    name: keyof typeof form;
    value: number;
    helper: string;
    lowLabel: string;
    highLabel: string;
  }) => (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">
            {label}
          </label>
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        </div>

        <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
          {value}/10
        </span>
      </div>

      <input
        type="range"
        name={name}
        min="1"
        max="10"
        value={value}
        onChange={handleChange}
        className="w-full accent-purple-600"
      />

      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Daily Wellness Check-in</p>

        <h1 className="text-3xl font-bold mb-3">
          How are you feeling today?
        </h1>

        <p className="text-purple-100 max-w-2xl">
          Your daily check-in helps Pause understand your wellness signals and
          detect burnout patterns over time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Wellness Signals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Rate each factor based on your current condition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <RangeInput
              label="Mood Score"
              name="mood_score"
              value={form.mood_score}
              helper="How positive or low your mood feels today."
              lowLabel="Low mood"
              highLabel="Positive"
            />

            <RangeInput
              label="Stress Level"
              name="stress_level"
              value={form.stress_level}
              helper="How much pressure or stress you feel."
              lowLabel="Calm"
              highLabel="Stressed"
            />

            <RangeInput
              label="Workload Level"
              name="workload_level"
              value={form.workload_level}
              helper="How heavy your workload feels."
              lowLabel="Light"
              highLabel="Overloaded"
            />

            <RangeInput
              label="Energy Level"
              name="energy_level"
              value={form.energy_level}
              helper="How much energy you have right now."
              lowLabel="Low energy"
              highLabel="Energized"
            />

            <RangeInput
              label="Work Satisfaction"
              name="work_satisfaction"
              value={form.work_satisfaction}
              helper="How satisfied you feel with your work today."
              lowLabel="Low"
              highLabel="Satisfied"
            />

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <label className="text-sm font-semibold text-gray-900">
                Sleep Hours
              </label>

              <p className="text-xs text-gray-500 mt-1 mb-3">
                Enter total sleep duration from last night.
              </p>

              <input
                type="number"
                name="sleep_hours"
                value={form.sleep_hours}
                onChange={handleChange}
                min="0"
                max="24"
                step="0.5"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
              />

              <p className="text-xs text-gray-400 mt-2">
                Recommended range: 7 to 8 hours
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Reflection Note
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Optional, but useful for AI-assisted weekly insights later.
          </p>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="Write anything about your day, workload, mood, or stress..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-3 rounded-xl hover:opacity-90 transition shadow-md disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Check-in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyCheckInPage;