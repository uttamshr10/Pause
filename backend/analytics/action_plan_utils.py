def generate_action_plan(data):
    plans = []

    stress = int(data.get("stress_level", 5))
    sleep = float(data.get("sleep_hours", 7))
    workload = int(data.get("workload_level", 5))
    recovery = float(data.get("recovery_time", 1))
    energy = int(data.get("energy_level", 5))

    if stress >= 7:
        plans.append({
            "title": "Take two short breaks",
            "description": "Take two 10-minute breaks today to reduce stress buildup."
        })

    if sleep < 7:
        plans.append({
            "title": "Prioritize sleep tonight",
            "description": "Aim for at least 7 hours of sleep to support recovery."
        })

    if workload >= 7:
        plans.append({
            "title": "Reduce one non-essential task",
            "description": "Move or delay one low-priority task to reduce overload."
        })

    if recovery < 1:
        plans.append({
            "title": "Add recovery time",
            "description": "Spend at least 20 minutes away from work or screens."
        })

    if energy <= 4:
        plans.append({
            "title": "Do a light reset activity",
            "description": "Try a short walk, hydration break, or quiet rest period."
        })

    if not plans:
        plans.append({
            "title": "Maintain your routine",
            "description": "Your signals look stable. Keep your current wellness habits."
        })

    return plans