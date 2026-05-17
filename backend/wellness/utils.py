def calculate_burnout_score(data):

    mood = float(data.get('mood_score', 5))
    stress = float(data.get('stress_level', 5))
    sleep = float(data.get('sleep_hours', 7))
    workload = float(data.get('workload_level', 5))
    energy = float(data.get('energy_level', 5))
    focus = float(data.get('focus_level', 5))
    recovery = float(data.get('recovery_time', 1))
    satisfaction = float(data.get('work_satisfaction', 5))

    # Normalize 1–10 values into 0–1 risk values
    stress_risk = stress / 10
    workload_risk = workload / 10
    mood_risk = 1 - (mood / 10)
    energy_risk = 1 - (energy / 10)
    focus_risk = 1 - (focus / 10)
    satisfaction_risk = 1 - (satisfaction / 10)

    # Sleep deficit risk
    # 7–8 hours = low risk
    if 7 <= sleep <= 8:
        sleep_risk = 0
    elif 6 <= sleep < 7 or 8 < sleep <= 9:
        sleep_risk = 0.35
    elif 5 <= sleep < 6 or 9 < sleep <= 10:
        sleep_risk = 0.65
    else:
        sleep_risk = 1

    # Recovery risk
    # 1 hour or more recovery/break time = healthy
    if recovery >= 1:
        recovery_risk = 0
    elif 0.5 <= recovery < 1:
        recovery_risk = 0.5
    else:
        recovery_risk = 1

    burnout = (
        stress_risk * 0.22 +
        workload_risk * 0.20 +
        sleep_risk * 0.15 +
        energy_risk * 0.13 +
        focus_risk * 0.12 +
        mood_risk * 0.08 +
        recovery_risk * 0.06 +
        satisfaction_risk * 0.04
    )

    return round(burnout * 100, 2)


def classify_risk(score):
    if score <= 30:
        return "low"
    elif score <= 60:
        return "moderate"
    elif score <= 80:
        return "high"
    else:
        return "critical"