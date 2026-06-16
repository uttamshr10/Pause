def generate_static_reflection(checkins):
    if not checkins:
        return {
            "summary": "Not enough data available.",
            "themes": [],
            "focus_area": ""
        }

    notes = []

    for c in checkins:
        if c.notes:
            notes.append(c.notes.lower())

    combined_notes = " ".join(notes)

    themes = []

    if any(word in combined_notes for word in [
        "stress",
        "pressure",
        "overwhelmed"
    ]):
        themes.append("Stress")

    if any(word in combined_notes for word in [
        "sleep",
        "tired",
        "exhausted"
    ]):
        themes.append("Sleep")

    if any(word in combined_notes for word in [
        "work",
        "deadline",
        "task"
    ]):
        themes.append("Workload")

    avg_sleep = sum(c.sleep_hours for c in checkins) / len(checkins)
    avg_stress = sum(c.stress_level for c in checkins) / len(checkins)
    avg_energy = sum(c.energy_level for c in checkins) / len(checkins)
    avg_recovery = sum(c.recovery_time for c in checkins) / len(checkins)

    observations = []

    if avg_sleep < 7:
        observations.append(
            "Sleep duration remained below the recommended range."
        )

    if avg_stress > 6:
        observations.append(
            "Stress levels were elevated throughout the period."
        )

    if avg_energy < 5:
        observations.append(
            "Energy levels frequently remained low."
        )

    summary = (
        "Your recent journal entries and wellness signals reveal recurring patterns. "
        + " ".join(observations)
    )

    if avg_recovery < 1:
        focus_area = (
            "Increase daily recovery time through breaks, walks, or relaxation."
        )
    elif avg_sleep < 7:
        focus_area = (
            "Prioritize sleep consistency to improve overall wellness."
        )
    else:
        focus_area = (
            "Continue maintaining your current wellness habits."
        )

    return {
        "summary": summary,
        "themes": themes,
        "focus_area": focus_area
    }