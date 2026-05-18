def generate_recommendations(data):
    recommendations = []

    stress = float(data.get("stress_level", 5))
    sleep = float(data.get("sleep_hours", 7))
    workload = float(data.get("workload_level", 5))
    energy = float(data.get("energy_level", 5))
    focus = float(data.get("focus_level", 5))
    recovery = float(data.get("recovery_time", 1))

    if stress >= 7:
        recommendations.append(
            "Consider taking short breaks or practicing relaxation techniques to reduce stress."
        )

    if sleep < 6:
        recommendations.append(
            "Your sleep duration is low. Aim for at least 7 hours of sleep."
        )

    if workload >= 8:
        recommendations.append(
            "Your workload seems high. Try prioritizing tasks or delegating if possible."
        )

    if energy <= 3:
        recommendations.append(
            "Low energy detected. Consider light physical activity or rest."
        )

    if focus <= 3:
        recommendations.append(
            "Your focus level is low. Try minimizing distractions or using focused work sessions."
        )

    if recovery < 0.5:
        recommendations.append(
            "You may need more recovery time. Take short breaks during work."
        )

    if not recommendations:
        recommendations.append(
            "Your wellness looks balanced. Keep maintaining your routine."
        )

    return recommendations