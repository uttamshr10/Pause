def predict_burnout_risk(checkins):
    if not checkins or len(checkins) < 2:
        return {
            "prediction_status": "not_enough_data",
            "predicted_risk": "unknown",
            "message": "Submit at least 2 check-ins to generate burnout prediction.",
            "days_to_high_risk": None,
        }

    scores = [c.burnout_score for c in checkins]

    first_score = scores[0]
    last_score = scores[-1]
    score_change = last_score - first_score

    average_daily_change = score_change / max(len(scores) - 1, 1)

    if average_daily_change <= 0:
        return {
            "prediction_status": "stable_or_improving",
            "predicted_risk": "low",
            "message": "Your burnout pattern is stable or improving based on recent check-ins.",
            "days_to_high_risk": None,
        }

    high_risk_threshold = 61

    if last_score >= high_risk_threshold:
        return {
            "prediction_status": "already_high_risk",
            "predicted_risk": "high",
            "message": "Your current burnout score is already in the high-risk range.",
            "days_to_high_risk": 0,
        }

    days_to_high = round((high_risk_threshold - last_score) / average_daily_change)

    if days_to_high <= 3:
        message = "Your burnout score is rising quickly. You may reach high risk soon if this pattern continues."
    elif days_to_high <= 7:
        message = "Your burnout score is increasing. Consider improving sleep, recovery time, and workload balance."
    else:
        message = "Your burnout risk is increasing slowly. Keep monitoring your wellness pattern."

    return {
        "prediction_status": "increasing_risk",
        "predicted_risk": "high",
        "message": message,
        "days_to_high_risk": days_to_high,
    }