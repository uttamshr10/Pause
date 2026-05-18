def generate_weekly_report(checkins):
    if not checkins:
        return None

    total = len(checkins)

    avg_burnout = sum(c.burnout_score for c in checkins) / total
    avg_stress = sum(c.stress_level for c in checkins) / total
    avg_sleep = sum(c.sleep_hours for c in checkins) / total
    avg_energy = sum(c.energy_level for c in checkins) / total

    summary = []

    if avg_stress >= 7:
        summary.append("Your stress levels were consistently high this week.")

    if avg_sleep < 6:
        summary.append("Your average sleep duration was lower than recommended.")

    if avg_energy <= 4:
        summary.append("Your energy levels remained low throughout the week.")

    if not summary:
        summary.append("Your wellness indicators are relatively balanced.")

    return {
        "average_burnout": round(avg_burnout, 2),
        "average_stress": round(avg_stress, 2),
        "average_sleep": round(avg_sleep, 2),
        "average_energy": round(avg_energy, 2),
        "summary": summary
    }