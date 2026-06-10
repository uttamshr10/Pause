def generate_recommendations(data):
    recommendations = []

    sleep = float(data.get("sleep_hours", 0))
    stress = int(data.get("stress_level", 0))
    energy = int(data.get("energy_level", 0))
    workload = int(data.get("workload_level", 0))
    recovery = float(data.get("recovery_time", 0))
    focus = int(data.get("focus_level", 0))

    if sleep < 7:
        recommendations.append(
            "Aim for 7–8 hours of sleep to improve recovery and reduce burnout risk."
        )

    if stress >= 7:
        recommendations.append(
            "Schedule short breaks during the day to manage stress levels."
        )

    if workload >= 7:
        recommendations.append(
            "Consider prioritizing tasks and reducing unnecessary workload."
        )

    if recovery < 1:
        recommendations.append(
            "Increase daily recovery time through walks, breaks, or relaxation."
        )

    if energy <= 4:
        recommendations.append(
            "Low energy was detected. Focus on sleep, hydration, and recovery."
        )

    if focus <= 4:
        recommendations.append(
            "Reduce distractions and schedule focused work sessions."
        )

    if not recommendations:
        recommendations.append(
            "Your wellness indicators look healthy. Continue your current routine."
        )

    return recommendations