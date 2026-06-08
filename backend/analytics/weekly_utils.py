def generate_weekly_report(checkins):
    if not checkins:
        return None

    total = len(checkins)

    avg_burnout = sum(c.burnout_score for c in checkins) / total
    avg_stress = sum(c.stress_level for c in checkins) / total
    avg_sleep = sum(c.sleep_hours for c in checkins) / total
    avg_energy = sum(c.energy_level for c in checkins) / total
    avg_recovery = sum(c.recovery_time for c in checkins) / total
    avg_focus = sum(c.focus_level for c in checkins) / total
    avg_workload = sum(c.workload_level for c in checkins) / total

    summary = []
    strengths = []
    focus_areas = []

    if avg_burnout <= 30:
        summary.append("Your overall burnout level stayed within a low-risk range this week.")
    elif avg_burnout <= 60:
        summary.append("Your burnout level was moderate this week, which means some wellness signals need attention.")
    else:
        summary.append("Your burnout level was high this week and may need immediate lifestyle or workload adjustments.")

    if avg_sleep >= 7:
        strengths.append("Sleep consistency was a positive factor this week.")
    else:
        focus_areas.append("Sleep duration was below the recommended range.")

    if avg_stress <= 4:
        strengths.append("Stress levels were generally manageable.")
    elif avg_stress >= 7:
        focus_areas.append("Stress levels were consistently high.")

    if avg_energy >= 6:
        strengths.append("Energy levels were fairly stable.")
    elif avg_energy <= 4:
        focus_areas.append("Energy levels were lower than ideal.")

    if avg_focus >= 6:
        strengths.append("Focus levels were generally healthy.")
    elif avg_focus <= 4:
        focus_areas.append("Focus levels showed signs of difficulty.")

    if avg_recovery >= 1:
        strengths.append("Recovery time supported your wellness this week.")
    else:
        focus_areas.append("Recovery time was limited and should be improved.")

    if avg_workload >= 7:
        focus_areas.append("Workload appeared heavy this week.")

    if strengths:
        summary.append("Strengths: " + " ".join(strengths))

    if focus_areas:
        summary.append("Focus areas: " + " ".join(focus_areas))

    if not focus_areas:
        summary.append("Your wellness indicators look balanced overall. Continue maintaining your current routine.")

    return {
        "average_burnout": round(avg_burnout, 2),
        "average_stress": round(avg_stress, 2),
        "average_sleep": round(avg_sleep, 2),
        "average_energy": round(avg_energy, 2),
        "average_recovery": round(avg_recovery, 2),
        "average_focus": round(avg_focus, 2),
        "average_workload": round(avg_workload, 2),
        "summary": summary,
    }