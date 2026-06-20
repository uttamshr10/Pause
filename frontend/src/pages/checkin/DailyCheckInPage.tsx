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
    work_satisfaction: 5,
    focus_level: 5,
    recovery_time: 1,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToday = async () => {
      try {
        const data = await getCheckInHistory();
        const today = new Date().toISOString().split("T")[0];
        const exists = data.some((item: any) => item.checkin_date === today);
        setAlreadySubmitted(exists);
      } catch (err) {
        console.log(err);
      } finally {
        setCheckingToday(false);
      }
    };

    checkToday();
  }, []);

  const updateField = (name: keyof typeof form, value: number | string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await submitDailyCheckIn(form);
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

  const NumberScale = ({
  title,
  subtitle,
  name,
  value,
  leftLabel,
  rightLabel,
}: {
  title: string;
  subtitle: string;
  name: keyof typeof form;
  value: number;
  leftLabel: string;
  rightLabel: string;
}) => (
  <div className="p-5">
    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 mb-4">{subtitle}</p>

    <div className="grid grid-cols-10 gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => updateField(name, num)}
          className={`h-9 rounded-lg text-xs font-semibold cursor-pointer transition ${
            value === num
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-slate-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-300"
          }`}
        >
          {num}
        </button>
      ))}
    </div>

    <div className="flex justify-between text-xs text-slate-500 mt-3">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);

  const MoodScale = () => {
  const options = [
    { label: "Very Bad", emoji: "😞", value: 2 },
    { label: "Bad", emoji: "🙁", value: 4 },
    { label: "Average", emoji: "😐", value: 6 },
    { label: "Good", emoji: "🙂", value: 8 },
    { label: "Excellent", emoji: "😊", value: 10 },
  ];

  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-slate-900">1. Mood</h3>
      <p className="text-xs text-slate-500 mt-1 mb-4">
        How would you describe your overall mood today?
      </p>

      <div className="grid grid-cols-5 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateField("mood_score", option.value)}
            className={`rounded-xl border px-2 py-4 min-h-[88px] cursor-pointer flex flex-col items-center justify-center transition ${
            form.mood_score === option.value
              ? "border-purple-600 bg-purple-50"
              : "border-gray-200 bg-white hover:bg-purple-50"
          }`}
          >
            <div className="text-xl mb-2">{option.emoji}</div>
            <p className="text-[11px] font-semibold text-slate-700 leading-tight text-center">
              {option.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-slate-900">
          Daily Wellness Check-in
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Take a few minutes to share how you're feeling. Your responses help
          Pause understand your wellness and provide better insights.
        </p>
      </div>

      {checkingToday ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">Checking today’s check-in...</p>
        </div>
      ) : alreadySubmitted ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Check-in Completed ✅
          </h2>
          <p className="text-sm text-slate-500">
            You have already submitted today's check-in. Come back tomorrow to
            log a new entry.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {error && (
                <div className="m-5 rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <MoodScale/>

                <NumberScale
                  title="2. Stress Level"
                  subtitle="How stressed have you felt today?"
                  name="stress_level"
                  value={form.stress_level}
                  leftLabel="No stress"
                  rightLabel="Extreme stress"
                />
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                <NumberScale
                  title="3. Energy Level"
                  subtitle="How would you rate your energy today?"
                  name="energy_level"
                  value={form.energy_level}
                  leftLabel="Low energy"
                  rightLabel="High energy"
                />

                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    4. Sleep Hours
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    How many hours did you sleep last night?
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="text" inputMode="decimal"
                      value={form.sleep_hours}
                      onChange={(e) =>
                        updateField("sleep_hours", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="text-sm text-slate-500">hrs</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                <NumberScale
                  title="5. Focus Level"
                  subtitle="How focused were you today?"
                  name="focus_level"
                  value={form.focus_level}
                  leftLabel="Very low"
                  rightLabel="Very high"
                />

                <NumberScale
                  title="6. Workload"
                  subtitle="How would you rate your workload today?"
                  name="workload_level"
                  value={form.workload_level}
                  leftLabel="Very light"
                  rightLabel="Very heavy"
                />
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                <NumberScale
                  title="7. Work Satisfaction"
                  subtitle="How satisfied did you feel with your work?"
                  name="work_satisfaction"
                  value={form.work_satisfaction}
                  leftLabel="Low"
                  rightLabel="Satisfied"
                />

                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    8. Recovery Time
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Total rest, pause, or break time today.
                  </p>

                  <div className="flex items-center gap-3">
                    <input
                      type="text" inputMode="decimal"
                      value={form.recovery_time}
                      onChange={(e) =>
                        updateField("recovery_time", e.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="text-sm text-slate-500">hrs</span>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-gray-100">
                <h3 className="text-sm font-bold text-slate-900">
                  9. Additional Notes{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Anything you'd like to share about your day?
                </p>

                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your thoughts here..."
                />

                <div className="text-right text-xs text-slate-400 mt-2">
                  {form.notes.length} / 500
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-xl bg-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Check-in"}
                </button>
              </div>
            </div>

            <aside className="space-y-5">
             <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Your Check-in Powers
            </h3>

            <div className="space-y-4 text-sm text-slate-600">
              <p>📈 Burnout Trend Tracking</p>
              <p>📝 Weekly Wellness Reports</p>
              <p>🎯 Goal Progress Monitoring</p>
              <p>📔 Personal Wellness Journal</p>
            </div>
          </div>
            </aside>
          </div>
        </form>
      )}
    </div>
  );
};

export default DailyCheckInPage;