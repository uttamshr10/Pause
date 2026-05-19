import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitDailyCheckIn, getCheckInHistory } from "../../api/wellnessApi";

const DailyCheckInPage = () => {
  const navigate = useNavigate();

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [checkingToday, setCheckingToday] = useState(true);

  const [form, setForm] = useState({
    mood_score: 5,
    stress_level: 5,
    sleep_hours: 7,
    workload_level: 5,
    energy_level: 5,
    focus_level: 5,
    recovery_time: 1,
    work_satisfaction: 5,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToday = async () => {
      try {
        const data = await getCheckInHistory();
        const today = new Date().toISOString().split("T")[0];

        const exists = data.some(
          (item: any) => item.checkin_date === today
        );

        setAlreadySubmitted(exists);
      } catch (err) {
        console.log(err);
      } finally {
        setCheckingToday(false);
      }
    };

    checkToday();
  }, []);

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
      setAlreadySubmitted(true);

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
  }: any) => (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <label className="text-sm font-semibold text-gray-900">{label}</label>
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
      {/* HEADER */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm text-purple-100 mb-2">Daily Wellness Check-in</p>
        <h1 className="text-3xl font-bold mb-3">
          How are you feeling today?
        </h1>
        <p className="text-purple-100 max-w-2xl">
          Your daily check-in helps Pause understand your wellness signals and detect burnout patterns over time.
        </p>
      </div>

      {/* 🔥 LOADING STATE */}
      {checkingToday ? (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Checking today’s check-in...
          </p>
        </div>
      ) : alreadySubmitted ? (
        /* ✅ COMPLETED STATE */
        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Check-in Completed ✅
          </h2>

          <p className="text-gray-500 text-sm">
            You have already submitted today's check-in. Come back tomorrow to log a new entry.
          </p>
        </div>
      ) : (
        /* ✅ FORM */
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
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <RangeInput label="Mood Score" name="mood_score" value={form.mood_score} helper="" lowLabel="Low" highLabel="High" />
              <RangeInput label="Stress Level" name="stress_level" value={form.stress_level} helper="" lowLabel="Calm" highLabel="Stress" />
              <RangeInput label="Workload" name="workload_level" value={form.workload_level} helper="" lowLabel="Light" highLabel="Heavy" />
              <RangeInput label="Energy" name="energy_level" value={form.energy_level} helper="" lowLabel="Low" highLabel="High" />
              <RangeInput label="Focus" name="focus_level" value={form.focus_level} helper="" lowLabel="Low" highLabel="High" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-8 py-3 rounded-xl"
            >
              {loading ? "Submitting..." : "Submit Check-in"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DailyCheckInPage;