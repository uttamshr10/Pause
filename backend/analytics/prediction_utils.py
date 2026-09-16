def calculate_mean(values):
    """
    Calculate arithmetic mean manually.
    """
    if not values:
        return 0

    total = 0

    for value in values:
        total += value

    return total / len(values)


def calculate_linear_regression(x_values, y_values):
    """
    Implement Simple Linear Regression from scratch
    using the least-squares method.

    y = intercept + slope * x
    """

    if len(x_values) != len(y_values):
        raise ValueError("X and Y must contain the same number of values.")

    if len(x_values) < 2:
        raise ValueError("At least two data points are required.")

    x_mean = calculate_mean(x_values)
    y_mean = calculate_mean(y_values)

    numerator = 0
    denominator = 0

    for i in range(len(x_values)):
        x_difference = x_values[i] - x_mean
        y_difference = y_values[i] - y_mean

        numerator += x_difference * y_difference
        denominator += x_difference ** 2

    if denominator == 0:
        slope = 0
    else:
        slope = numerator / denominator

    intercept = y_mean - (slope * x_mean)

    return slope, intercept


def predict_value(x, slope, intercept):
    """
    Predict Y for a given X using the regression equation.
    """
    return intercept + (slope * x)


def calculate_r_squared(x_values, y_values, slope, intercept):
    """
    Calculate coefficient of determination (R²) manually.

    R² indicates how much of the variation in burnout scores
    is explained by the fitted linear trend.
    """

    y_mean = calculate_mean(y_values)

    total_sum_of_squares = 0
    residual_sum_of_squares = 0

    for i in range(len(y_values)):
        actual = y_values[i]
        predicted = predict_value(
            x_values[i],
            slope,
            intercept
        )

        total_sum_of_squares += (actual - y_mean) ** 2
        residual_sum_of_squares += (actual - predicted) ** 2

    # All Y values are identical
    if total_sum_of_squares == 0:
        return 1.0

    r_squared = 1 - (
        residual_sum_of_squares / total_sum_of_squares
    )

    return r_squared


def score_to_risk(score):
    """
    Convert predicted burnout score into the
    existing Pause risk categories.
    """

    if score <= 30:
        return "low"

    if score <= 60:
        return "moderate"

    if score <= 80:
        return "high"

    return "critical"


def clamp_score(score):
    """
    Keep predicted burnout score within the
    valid Pause burnout-score range.
    """

    if score < 0:
        return 0

    if score > 100:
        return 100

    return score


def predict_burnout_risk(checkins):
    """
    Predict future burnout scores using Simple Linear Regression.

    The algorithm uses chronological check-in sequence as X
    and burnout score as Y.

    No machine-learning library is used.
    """

    if not checkins or len(checkins) < 3:
        return {
            "algorithm": "simple_linear_regression",
            "prediction_status": "not_enough_data",
            "predicted_risk": "unknown",
            "message": "Submit at least 3 check-ins to generate burnout prediction.",
            "data_points": len(checkins) if checkins else 0,
        }

    # X = actual elapsed calendar days
    # Y = burnout scores

    first_date = checkins[0].checkin_date

    x_values = []
    y_values = []

    for checkin in checkins:
        days_since_start = (
            checkin.checkin_date - first_date
        ).days

        x_values.append(days_since_start)
        y_values.append(float(checkin.burnout_score))

    slope, intercept = calculate_linear_regression(
        x_values,
        y_values
    )

    r_squared = calculate_r_squared(
        x_values,
        y_values,
        slope,
        intercept
    )

    last_x = x_values[-1]

    predicted_tomorrow = predict_value(
    last_x + 1,
    slope,
    intercept
    )

    predicted_3_days = predict_value(
        last_x + 3,
        slope,
        intercept
    )

    predicted_7_days = predict_value(
        last_x + 7,
        slope,
        intercept
    )

    predicted_tomorrow = clamp_score(predicted_tomorrow)
    predicted_3_days = clamp_score(predicted_3_days)
    predicted_7_days = clamp_score(predicted_7_days)

    predicted_risk = score_to_risk(predicted_3_days)

    # Interpret regression slope
    if slope > 0:
        prediction_status = "increasing"
        message = (
            "Linear regression indicates an increasing burnout trend "
            "across your recent check-ins."
        )

    elif slope < 0:
        prediction_status = "decreasing"
        message = (
            "Linear regression indicates a decreasing burnout trend "
            "across your recent check-ins."
        )

    else:
        prediction_status = "stable"
        message = (
            "Linear regression indicates a stable burnout trend "
            "across your recent check-ins."
        )

    return {
    "algorithm": "simple_linear_regression",
    "prediction_status": prediction_status,
    "data_points": len(checkins),

    "slope": round(slope, 4),
    "intercept": round(intercept, 4),
    "r_squared": round(r_squared, 4),

    "current_score": round(
        float(checkins[-1].burnout_score),
        2
    ),

    "predicted_tomorrow": round(
        predicted_tomorrow,
        2
    ),

    "predicted_3_days": round(
        predicted_3_days,
        2
    ),

    "predicted_7_days": round(
        predicted_7_days,
        2
    ),

    "predicted_risk": predicted_risk,
    "message": message,
}