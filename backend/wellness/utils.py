def calculate_burnout_score(data):

    mood = data['mood_score']
    stress = data['stress_level']
    sleep = data['sleep_hours']
    workload = data['workload_level']
    energy = data['energy_level']
    satisfaction = data['work_satisfaction']

    # normalize to 0–1
    mood = mood / 10
    stress = stress / 10
    workload = workload / 10
    energy = energy / 10
    satisfaction = satisfaction / 10

    # sleep scoring
    if sleep >= 7 and sleep <= 8:
        sleep_score = 1
    elif sleep >= 5:
        sleep_score = 0.6
    else:
        sleep_score = 0.3

    # burnout formula
    burnout = (
        (stress * 0.3) +
        (workload * 0.25) +
        ((1 - mood) * 0.15) +
        ((1 - energy) * 0.15) +
        ((1 - satisfaction) * 0.1) +
        ((1 - sleep_score) * 0.05)
    )

    # scale to 0–100
    burnout_score = round(burnout * 100, 2)

    return burnout_score


def classify_risk(score):
    if score < 30:
        return "low"
    elif score < 60:
        return "medium"
    else:
        return "high"