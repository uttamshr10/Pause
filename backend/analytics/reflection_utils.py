def generate_static_reflection(checkins):
    checkins = list(checkins)

    if not checkins:
        return {
            "summary": "Not enough data available.",
            "themes": [],
            "focus_area": "Submit more check-ins with notes to generate reflection insights.",
            "patterns": []
        }

    notes = [
        c.notes.lower()
        for c in checkins
        if c.notes and c.notes.strip() != ""
    ]

    combined_notes = " ".join(notes)

    themes = []

    theme_keywords = {
        "Stress": ["stress", "pressure", "overwhelmed", "anxious"],
        "Sleep": ["sleep", "tired", "exhausted", "rest"],
        "Workload": ["work", "deadline", "task", "busy", "overload"],
        "Energy": ["energy", "drained", "fresh", "active"],
        "Focus": ["focus", "distracted", "concentrate"],
    }

    for theme, keywords in theme_keywords.items():
        if any(word in combined_notes for word in keywords):
            themes.append(theme)

    avg_sleep = sum(c.sleep_hours for c in checkins) / len(checkins)
    avg_stress = sum(c.stress_level for c in checkins) / len(checkins)
    avg_energy = sum(c.energy_level for c in checkins) / len(checkins)
    avg_recovery = sum(c.recovery_time for c in checkins) / len(checkins)
    avg_burnout = sum(c.burnout_score for c in checkins) / len(checkins)

    low_sleep_days = [c for c in checkins if c.sleep_hours < 6]
    high_stress_days = [c for c in checkins if c.stress_level >= 7]
    low_recovery_days = [c for c in checkins if c.recovery_time < 1]
    high_burnout_days = [c for c in checkins if c.burnout_score >= 60]

    patterns = []

    if low_sleep_days:
        patterns.append(
            f"Sleep dropped below 6 hours on {len(low_sleep_days)} check-ins, which may have affected energy and recovery."
        )

    if high_stress_days:
        patterns.append(
            f"Stress reached a high level on {len(high_stress_days)} check-ins, suggesting pressure may be a recurring trigger."
        )

    if low_recovery_days:
        patterns.append(
            f"Recovery time was below 1 hour on {len(low_recovery_days)} check-ins, which may limit your ability to reset during busy periods."
        )

    if high_burnout_days:
        patterns.append(
            f"Burnout entered the high-risk range on {len(high_burnout_days)} check-ins, so recovery habits need attention."
        )

    if avg_burnout <= 30:
        summary = "Your recent check-ins show a generally stable wellness pattern with low burnout risk."
    elif avg_burnout <= 60:
        summary = "Your recent check-ins show a moderate burnout pattern, with some signals that may need attention."
    else:
        summary = "Your recent check-ins show a high burnout pattern, suggesting recovery and workload balance should become a priority."

    if notes:
        summary += " Your journal notes add context to these patterns and help identify recurring themes."

    if avg_recovery < 1:
        focus_area = "Increase recovery time by adding at least one intentional break or reset activity each day."
    elif avg_sleep < 7:
        focus_area = "Prioritize sleep consistency because it appears to be one of your weaker wellness signals."
    elif avg_stress > 6:
        focus_area = "Focus on stress regulation through smaller breaks, task prioritization, and workload boundaries."
    elif avg_energy < 5:
        focus_area = "Focus on energy recovery by improving sleep, hydration, and low-pressure rest time."
    else:
        focus_area = "Continue maintaining your current routine and watch for changes in stress, sleep, and recovery."

    if not themes:
        themes.append("General wellness")

    if not patterns:
        patterns.append(
            "No major negative pattern was detected from your recent check-ins."
        )

    return {
        "summary": summary,
        "themes": themes,
        "focus_area": focus_area,
        "patterns": patterns
    }