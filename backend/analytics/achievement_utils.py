def generate_achievements(checkins):
    achievements = []

    total_checkins = len(checkins)

    notes_count = len([
        c for c in checkins
        if c.notes and c.notes.strip() != ""
    ])

    low_risk_days = len([
        c for c in checkins
        if c.risk_level == "low"
    ])

    good_sleep_days = len([
        c for c in checkins
        if c.sleep_hours >= 7
    ])

    if total_checkins >= 1:
        achievements.append({
            "title": "First Check-in",
            "description": "You completed your first wellness check-in.",
            "status": "unlocked"
        })

    if total_checkins >= 7:
        achievements.append({
            "title": "Consistent Tracker",
            "description": "You completed at least 7 check-ins.",
            "status": "unlocked"
        })

    if notes_count >= 1:
        achievements.append({
            "title": "First Reflection",
            "description": "You added your first journal note.",
            "status": "unlocked"
        })

    if good_sleep_days >= 5:
        achievements.append({
            "title": "Sleep Builder",
            "description": "You slept 7+ hours on at least 5 days.",
            "status": "unlocked"
        })

    if low_risk_days >= 5:
        achievements.append({
            "title": "Low Risk Week",
            "description": "You maintained low burnout risk across multiple check-ins.",
            "status": "unlocked"
        })

    return achievements