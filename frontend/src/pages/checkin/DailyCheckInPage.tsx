import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  submitDailyCheckIn,
  getCheckInHistory,
} from "../../api/wellnessApi";

/* =========================================================
   TYPES
========================================================= */

type CheckInForm = {
  mood_score: number;
  stress_level: number;
  sleep_hours: number | string;
  workload_level: number;
  energy_level: number;
  work_satisfaction: number;
  focus_level: number;
  recovery_time: number | string;
  notes: string;
};

/* =========================================================
   PAGE
========================================================= */

const DailyCheckInPage = () => {
  const navigate = useNavigate();

  const [alreadySubmitted, setAlreadySubmitted] =
    useState(false);

  const [checkingToday, setCheckingToday] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState<CheckInForm>({
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

  /* =======================================================
     CHECK IF TODAY IS ALREADY SUBMITTED
  ======================================================= */

  useEffect(() => {
    const checkToday = async () => {
      try {
        const data =
          await getCheckInHistory();

        const today = new Date()
          .toISOString()
          .split("T")[0];

        const exists = data.some(
          (item: any) =>
            item.checkin_date === today
        );

        setAlreadySubmitted(exists);
      } catch (err) {
        console.error(
          "Failed to check today's entry:",
          err
        );
      } finally {
        setCheckingToday(false);
      }
    };

    checkToday();
  }, []);

  /* =======================================================
     HELPERS
  ======================================================= */

  const updateField = (
    name: keyof CheckInForm,
    value: number | string
  ) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    const sleepHours =
      Number(form.sleep_hours);

    const recoveryTime =
      Number(form.recovery_time);

    if (
      Number.isNaN(sleepHours) ||
      sleepHours < 0 ||
      sleepHours > 24
    ) {
      setError(
        "Please enter a valid sleep duration between 0 and 24 hours."
      );
      return;
    }

    if (
      Number.isNaN(recoveryTime) ||
      recoveryTime < 0 ||
      recoveryTime > 24
    ) {
      setError(
        "Please enter a valid recovery time between 0 and 24 hours."
      );
      return;
    }

    setLoading(true);

    try {
      await submitDailyCheckIn({
        ...form,
        sleep_hours: sleepHours,
        recovery_time: recoveryTime,
      });

      setAlreadySubmitted(true);

      setTimeout(() => {
        navigate("/check-in/history");
      }, 700);
    } catch {
      setError(
        "We couldn't submit today's check-in. You may have already submitted an entry today."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (checkingToday) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Preparing today&apos;s check-in...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ALREADY COMPLETED
  ======================================================= */

  if (alreadySubmitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-10 md:p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">
                ✓
              </span>
            </div>

            <p className="text-sm font-semibold text-green-600 mb-2">
              Today&apos;s check-in is complete
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              You&apos;re all checked in.
            </h1>

            <p className="text-sm text-slate-500 leading-6 mt-4 max-w-lg mx-auto">
              Pause has saved today&apos;s wellness
              entry. Your data will contribute to your
              burnout trends, recovery guidance and
              wellness insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition"
              >
                Back to Dashboard
              </Link>

              <Link
                to="/check-in/history"
                className="w-full sm:w-auto rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                View Check-in History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     CHECK-IN FORM
  ======================================================= */

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-purple-600 mb-2">
              Daily Check-in
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              How are you doing today?
            </h1>

            <p className="text-sm text-slate-500 leading-6 mt-3 max-w-2xl">
              Take a moment to reflect on your day.
              There are no right or wrong answers.
            </p>
          </div>

          <Link
            to="/check-in/history"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            View history →
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ERROR */}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            SECTION 1 - HOW YOU FEEL
        ================================================= */}

        <CheckInSection
          number="01"
          title="How you feel"
          description="Start with how today has felt physically and emotionally."
        >
          <div className="grid lg:grid-cols-2 gap-5">
            <ScaleCard
              title="Mood"
              question="How would you rate your overall mood today?"
              value={form.mood_score}
              onChange={(value) =>
                updateField(
                  "mood_score",
                  value
                )
              }
              lowLabel="Very low"
              highLabel="Excellent"
              valueLabel={getMoodLabel(
                form.mood_score
              )}
            />

            <ScaleCard
              title="Stress"
              question="How stressed have you felt today?"
              value={form.stress_level}
              onChange={(value) =>
                updateField(
                  "stress_level",
                  value
                )
              }
              lowLabel="No stress"
              highLabel="Extreme"
              valueLabel={getStressLabel(
                form.stress_level
              )}
            />

            <ScaleCard
              title="Energy"
              question="How would you rate your energy today?"
              value={form.energy_level}
              onChange={(value) =>
                updateField(
                  "energy_level",
                  value
                )
              }
              lowLabel="Very low"
              highLabel="Very high"
              valueLabel={getEnergyLabel(
                form.energy_level
              )}
            />
          </div>
        </CheckInSection>

        {/* =================================================
            SECTION 2 - WORK AND FOCUS
        ================================================= */}

        <CheckInSection
          number="02"
          title="Work & focus"
          description="Think about the demands of your day and how well you were able to engage with them."
        >
          <div className="grid lg:grid-cols-2 gap-5">
            <ScaleCard
              title="Workload"
              question="How demanding was your workload today?"
              value={form.workload_level}
              onChange={(value) =>
                updateField(
                  "workload_level",
                  value
                )
              }
              lowLabel="Very light"
              highLabel="Very heavy"
              valueLabel={getWorkloadLabel(
                form.workload_level
              )}
            />

            <ScaleCard
              title="Focus"
              question="How focused were you today?"
              value={form.focus_level}
              onChange={(value) =>
                updateField(
                  "focus_level",
                  value
                )
              }
              lowLabel="Very low"
              highLabel="Very high"
              valueLabel={getFocusLabel(
                form.focus_level
              )}
            />

            <ScaleCard
              title="Work Satisfaction"
              question="How satisfied did you feel with your work today?"
              value={
                form.work_satisfaction
              }
              onChange={(value) =>
                updateField(
                  "work_satisfaction",
                  value
                )
              }
              lowLabel="Very low"
              highLabel="Very high"
              valueLabel={
                getSatisfactionLabel(
                  form.work_satisfaction
                )
              }
            />
          </div>
        </CheckInSection>

        {/* =================================================
            SECTION 3 - REST AND RECOVERY
        ================================================= */}

        <CheckInSection
          number="03"
          title="Rest & recovery"
          description="Recovery matters just as much as workload. Tell Pause how much rest you were able to get."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <NumberInputCard
              title="Sleep"
              question="How much did you sleep last night?"
              value={form.sleep_hours}
              onChange={(value) =>
                updateField(
                  "sleep_hours",
                  value
                )
              }
              suffix="hours"
              helper="Enter your total sleep duration."
              step="0.1"
            />

            <NumberInputCard
              title="Recovery Time"
              question="How much time did you spend resting or taking meaningful breaks today?"
              value={form.recovery_time}
              onChange={(value) =>
                updateField(
                  "recovery_time",
                  value
                )
              }
              suffix="hours"
              helper="Include intentional rest, pauses or breaks."
              step="0.1"
            />
          </div>
        </CheckInSection>

        {/* =================================================
            SECTION 4 - REFLECTION
        ================================================= */}

        <CheckInSection
          number="04"
          title="A note about today"
          description="Optional. Add anything that might help you remember the context behind today's numbers."
        >
          <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5">
            <textarea
              value={form.notes}
              onChange={(e) =>
                updateField(
                  "notes",
                  e.target.value
                )
              }
              rows={5}
              maxLength={500}
              className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Maybe today felt unusually busy, you slept poorly, something went really well..."
            />

            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-slate-400">
                Optional reflection
              </p>

              <p className="text-xs text-slate-400">
                {form.notes.length}/500
              </p>
            </div>
          </div>
        </CheckInSection>

        {/* =================================================
            SUBMIT
        ================================================= */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ready to save today&apos;s check-in?
              </h3>

              <p className="text-xs text-slate-500 mt-2 max-w-xl leading-5">
                Your responses will update your
                burnout score, wellness history,
                recovery guidance and trend analysis.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer shrink-0 rounded-2xl bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving check-in..."
                : "Complete Check-in"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* =========================================================
   SECTION
========================================================= */

const CheckInSection = ({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
            {number}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1 leading-6">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
};

/* =========================================================
   SCALE CARD
========================================================= */

const ScaleCard = ({
  title,
  question,
  value,
  onChange,
  lowLabel,
  highLabel,
  valueLabel,
}: {
  title: string;
  question: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  valueLabel: string;
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="text-xs text-slate-500 leading-5 mt-1">
            {question}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="inline-flex items-center justify-center min-w-[42px] h-9 px-3 rounded-xl bg-purple-600 text-white text-sm font-bold">
            {value}
          </div>

          <p className="text-[10px] text-purple-600 font-semibold mt-1">
            {valueLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1.5">
        {[
          1, 2, 3, 4, 5,
          6, 7, 8, 9, 10,
        ].map((number) => (
          <button
            key={number}
            type="button"
            onClick={() =>
              onChange(number)
            }
            aria-label={`${title}: ${number} out of 10`}
            className={`h-9 rounded-lg text-xs font-semibold transition cursor-pointer ${
              value === number
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-3 mt-3">
        <span className="text-[11px] text-slate-400">
          {lowLabel}
        </span>

        <span className="text-[11px] text-slate-400 text-right">
          {highLabel}
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   NUMBER INPUT
========================================================= */

const NumberInputCard = ({
  title,
  question,
  value,
  onChange,
  suffix,
  helper,
  step,
}: {
  title: string;
  question: string;
  value: number | string;
  onChange: (value: string) => void;
  suffix: string;
  helper: string;
  step: string;
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
      <h3 className="text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-xs text-slate-500 leading-5 mt-1">
        {question}
      </p>

      <div className="relative mt-5">
        <input
          type="number"
          min="0"
          max="24"
          step={step}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 pr-20 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          {suffix}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mt-3">
        {helper}
      </p>
    </div>
  );
};

/* =========================================================
   HUMAN-FRIENDLY SCALE LABELS
========================================================= */

const getMoodLabel = (
  value: number
) => {
  if (value <= 2) return "Very low";
  if (value <= 4) return "Low";
  if (value <= 6) return "Okay";
  if (value <= 8) return "Good";

  return "Excellent";
};

const getStressLabel = (
  value: number
) => {
  if (value <= 2) return "Very low";
  if (value <= 4) return "Low";
  if (value <= 6) return "Moderate";
  if (value <= 8) return "High";

  return "Very high";
};

const getEnergyLabel = (
  value: number
) => {
  if (value <= 2) return "Very low";
  if (value <= 4) return "Low";
  if (value <= 6) return "Moderate";
  if (value <= 8) return "Good";

  return "Very high";
};

const getWorkloadLabel = (
  value: number
) => {
  if (value <= 2) return "Very light";
  if (value <= 4) return "Light";
  if (value <= 6) return "Moderate";
  if (value <= 8) return "Heavy";

  return "Very heavy";
};

const getFocusLabel = (
  value: number
) => {
  if (value <= 2) return "Very low";
  if (value <= 4) return "Low";
  if (value <= 6) return "Moderate";
  if (value <= 8) return "Good";

  return "Very high";
};

const getSatisfactionLabel = (
  value: number
) => {
  if (value <= 2) return "Very low";
  if (value <= 4) return "Low";
  if (value <= 6) return "Moderate";
  if (value <= 8) return "Satisfied";

  return "Very satisfied";
};

export default DailyCheckInPage;