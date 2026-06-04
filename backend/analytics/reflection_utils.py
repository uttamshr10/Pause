def generate_static_reflection(checkins):
    notes = [
        c.notes.lower()
        for c in checkins
        if c.notes and c.notes.strip() != ""
    ]

    if not notes:
        return {
            "reflection": "No journal notes available yet.",
            "themes": [],
            "focus_area": "Start adding short notes during check-ins."
        }

    text = " ".join(notes)

    themes = []

    if "tired" in text or "exhausted" in text or "low energy" in text:
        themes.append("Low energy")

    if "stress" in text or "pressure" in text or "overload" in text:
        themes.append("Stress and pressure")

    if "sleep" in text or "slept" in text or "rest" in text:
        themes.append("Sleep and recovery")

    if "work" in text or "deadline" in text or "task" in text:
        themes.append("Workload")

    if "motivated" in text or "better" in text or "good" in text:
        themes.append("Positive momentum")

    if not themes:
        themes.append("General wellness reflection")

    if "Stress and pressure" in themes:
        focus_area = "Reduce stress through breaks, workload planning, and recovery time."
    elif "Sleep and recovery" in themes:
        focus_area = "Improve sleep consistency and recovery habits."
    elif "Low energy" in themes:
        focus_area = "Monitor energy levels and prioritize rest."
    else:
        focus_area = "Continue journaling to identify clearer patterns."

    return {
        "reflection": "Your journal entries show patterns that can help explain your wellness changes.",
        "themes": themes,
        "focus_area": focus_area
    }