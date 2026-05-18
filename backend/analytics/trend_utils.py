def analyze_trend(checkins):
    if not checkins:
        return {
            "trend_status": "no_data",
            "message": "No check-in data available for trend analysis.",
            "warnings": []
        }

    scores = [c.burnout_score for c in checkins]
    stress = [c.stress_level for c in checkins]
    sleep = [c.sleep_hours for c in checkins]
    energy = [c.energy_level for c in checkins]
    focus = [c.focus_level for c in checkins]

    warnings = []

    first_score = scores[0]
    last_score = scores[-1]
    score_change = round(last_score - first_score, 2)

    if score_change >= 10:
        trend_status = "worsening"
        message = "Your burnout score is increasing compared to earlier check-ins."
    elif score_change <= -10:
        trend_status = "improving"
        message = "Your burnout score is decreasing, which indicates improvement."
    else:
        trend_status = "stable"
        message = "Your burnout score is mostly stable."

    if len(stress) >= 3 and all(value >= 7 for value in stress[-3:]):
        warnings.append("Stress has remained high for the last 3 check-ins.")

    if len(sleep) >= 3 and all(value < 6 for value in sleep[-3:]):
        warnings.append("Sleep duration has been low for the last 3 check-ins.")

    if len(energy) >= 3 and all(value <= 4 for value in energy[-3:]):
        warnings.append("Energy level has remained low for the last 3 check-ins.")

    if len(focus) >= 3 and all(value <= 4 for value in focus[-3:]):
        warnings.append("Focus level has remained low for the last 3 check-ins.")

    return {
        "trend_status": trend_status,
        "score_change": score_change,
        "message": message,
        "warnings": warnings
    }