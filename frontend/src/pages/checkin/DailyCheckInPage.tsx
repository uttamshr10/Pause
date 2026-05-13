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
    } catch (err: any) {
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
  }: {
    label: string;
    name: keyof typeof form;
    value: number;
    helper: string;
  }) => (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-semibold">{value}/10</span>
      </div>

      <input
        type="range"
        name={name}
        min="1"
        max="10"
        value={value}
        onChange={handleChange}
        className="w-full"
      />

      <p className="text-xs text-gray-500">{helper}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Daily Wellness Check-in</h1>
        <p className="text-gray-600 text-sm">
          Record your daily wellness signals. This helps Pause analyze burnout
          patterns over time.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow space-y-6"
      >
        {success && (
          <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
            {success}
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <RangeInput
          label="Mood Score"
          name="mood_score"
          value={form.mood_score}
          helper="1 = very low mood, 10 = very positive mood"
        />

        <RangeInput
          label="Stress Level"
          name="stress_level"
          value={form.stress_level}
          helper="1 = very low stress, 10 = very high stress"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Sleep Hours</label>
          <input
            type="number"
            name="sleep_hours"
            value={form.sleep_hours}
            onChange={handleChange}
            min="0"
            max="24"
            step="0.5"
            className="w-full border p-2 rounded-lg"
          />
          <p className="text-xs text-gray-500">
            Enter total sleep hours from last night.
          </p>
        </div>

        <RangeInput
          label="Workload Level"
          name="workload_level"
          value={form.workload_level}
          helper="1 = very light workload, 10 = overloaded"
        />

        <RangeInput
          label="Energy Level"
          name="energy_level"
          value={form.energy_level}
          helper="1 = very low energy, 10 = very energetic"
        />

        <RangeInput
          label="Work Satisfaction"
          name="work_satisfaction"
          value={form.work_satisfaction}
          helper="1 = very dissatisfied, 10 = very satisfied"
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes Optional
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="w-full border p-2 rounded-lg"
            placeholder="Write anything about your day..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Check-in"}
        </button>
      </form>
    </div>
  );
};

export default DailyCheckInPage;