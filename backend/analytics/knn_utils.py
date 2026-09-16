import math


FEATURE_NAMES = [
    "stress",
    "sleep",
    "workload",
    "energy",
    "focus",
    "recovery",
]

def normalize_risk_label(risk_level):
    """
    Convert historical risk labels into the current
    Pause risk-category vocabulary.

    Some older records may contain 'medium', while the
    current system uses 'moderate'.
    """

    label = str(risk_level).strip().lower()

    if label == "medium":
        return "moderate"

    return label

def extract_knn_features(checkin):
    """
    Convert one DailyCheckIn object into a numerical
    feature vector.

    Feature order:
    stress, sleep, workload, energy, focus, recovery
    """

    return [
        float(checkin.stress_level),
        float(checkin.sleep_hours),
        float(checkin.workload_level),
        float(checkin.energy_level),
        float(checkin.focus_level),
        float(checkin.recovery_time),
    ]


def calculate_feature_ranges(checkins):
    """
    Calculate minimum and maximum values for each feature.

    These values are later used for Min-Max normalization.
    """

    if not checkins:
        return [], []

    dataset = []

    for checkin in checkins:
        dataset.append(
            extract_knn_features(checkin)
        )

    number_of_features = len(dataset[0])

    minimums = []
    maximums = []

    for feature_index in range(number_of_features):

        values = []

        for row in dataset:
            values.append(
                row[feature_index]
            )

        minimums.append(min(values))
        maximums.append(max(values))

    return minimums, maximums


def normalize_features(
    features,
    minimums,
    maximums
):
    """
    Normalize a feature vector using Min-Max normalization.

    normalized =
        (value - minimum) / (maximum - minimum)
    """

    normalized = []

    for i in range(len(features)):

        minimum = minimums[i]
        maximum = maximums[i]

        if maximum == minimum:
            normalized_value = 0.0
        else:
            normalized_value = (
                features[i] - minimum
            ) / (
                maximum - minimum
            )

        normalized.append(normalized_value)

    return normalized


def euclidean_distance(point_a, point_b):
    """
    Calculate Euclidean distance manually.
    """

    squared_difference_sum = 0

    for i in range(len(point_a)):

        difference = (
            point_a[i] - point_b[i]
        )

        squared_difference_sum += (
            difference ** 2
        )

    return math.sqrt(
        squared_difference_sum
    )


def get_nearest_neighbors(
    training_checkins,
    target_checkin,
    k
):
    """
    Find the K historical check-ins most similar
    to the target check-in.
    """

    if not training_checkins:
        return []

    # Calculate normalization ranges from training data only.
    minimums, maximums = (
        calculate_feature_ranges(
            training_checkins
        )
    )

    target_features = extract_knn_features(
        target_checkin
    )

    normalized_target = normalize_features(
        target_features,
        minimums,
        maximums
    )

    distances = []

    for checkin in training_checkins:

        features = extract_knn_features(
            checkin
        )

        normalized_features = normalize_features(
            features,
            minimums,
            maximums
        )

        distance = euclidean_distance(
            normalized_target,
            normalized_features
        )

        distances.append({
            "checkin": checkin,
            "distance": distance,
        })

    # Sort from smallest distance to largest distance.
    distances.sort(
        key=lambda item: item["distance"]
    )

    return distances[:k]


def majority_vote(neighbors):
    """
    Determine the predicted risk level using
    majority voting.

    Tie handling:
    If multiple classes receive the same number
    of votes, choose the class whose neighbors
    have the smallest total distance.
    """

    if not neighbors:
        return "unknown", {}

    vote_counts = {}
    distance_totals = {}

    for neighbor in neighbors:

        risk_level = normalize_risk_label(
            neighbor["checkin"].risk_level
        )

        if risk_level not in vote_counts:
            vote_counts[risk_level] = 0
            distance_totals[risk_level] = 0

        vote_counts[risk_level] += 1

        distance_totals[risk_level] += (
            neighbor["distance"]
        )

    highest_vote_count = max(
        vote_counts.values()
    )

    tied_labels = []

    for label, count in vote_counts.items():

        if count == highest_vote_count:
            tied_labels.append(label)

    # Normal majority
    if len(tied_labels) == 1:
        predicted_label = tied_labels[0]

    # Tie: choose class with closest combined distance
    else:
        predicted_label = min(
            tied_labels,
            key=lambda label:
                distance_totals[label]
        )

    return predicted_label, vote_counts


def classify_checkin(
    training_checkins,
    target_checkin,
    k=5
):
    """
    Classify one check-in using K-Nearest Neighbors.
    """

    if len(training_checkins) < k:
        return {
            "status": "not_enough_data",
            "predicted_risk": "unknown",
            "neighbors": [],
        }

    neighbors = get_nearest_neighbors(
        training_checkins,
        target_checkin,
        k
    )

    predicted_risk, vote_counts = (
        majority_vote(neighbors)
    )

    neighbor_results = []

    for neighbor in neighbors:

        checkin = neighbor["checkin"]

        neighbor_results.append({
            "date": str(
                checkin.checkin_date
            ),
          "risk_level": normalize_risk_label(
                checkin.risk_level
            ),
            "burnout_score": round(
                float(checkin.burnout_score),
                2
            ),
            "distance": round(
                neighbor["distance"],
                4
            ),
        })

    return {
        "status": "success",
        "predicted_risk": predicted_risk,
        "votes": vote_counts,
        "neighbors": neighbor_results,
    }


def evaluate_knn(checkins, k=5):
    """
    Evaluate KNN using Leave-One-Out Cross-Validation.

    Each historical check-in becomes the test observation
    once while every other observation becomes training data.

    The predicted risk is compared against the stored
    risk_level.

    No machine-learning library is used.
    """

    checkins = list(checkins)

    if len(checkins) <= k:
        return {
            "status": "not_enough_data",
            "total_tested": 0,
            "correct": 0,
            "incorrect": 0,
            "accuracy": 0,
        }

    correct = 0
    incorrect = 0

    class_results = {}

    for test_index in range(len(checkins)):

        test_checkin = checkins[
            test_index
        ]

        training_checkins = []

        for training_index in range(
            len(checkins)
        ):

            # Critical:
            # do not train using the observation
            # currently being tested.
            if training_index != test_index:
                training_checkins.append(
                    checkins[training_index]
                )

        result = classify_checkin(
            training_checkins,
            test_checkin,
            k
        )

        predicted = result[
            "predicted_risk"
        ]

        actual = normalize_risk_label(
            test_checkin.risk_level
        )

        if actual not in class_results:
            class_results[actual] = {
                "total": 0,
                "correct": 0,
            }

        class_results[actual]["total"] += 1

        if predicted == actual:

            correct += 1

            class_results[
                actual
            ]["correct"] += 1

        else:
            incorrect += 1

    total_tested = correct + incorrect

    if total_tested == 0:
        accuracy = 0
    else:
        accuracy = (
            correct / total_tested
        ) * 100

    for label in class_results:

        total = class_results[
            label
        ]["total"]

        class_correct = class_results[
            label
        ]["correct"]

        if total == 0:
            class_accuracy = 0
        else:
            class_accuracy = (
                class_correct / total
            ) * 100

        class_results[
            label
        ]["accuracy"] = round(
            class_accuracy,
            2
        )

    return {
        "status": "success",
        "evaluation_method":
            "leave_one_out_cross_validation",
        "k": k,
        "total_tested": total_tested,
        "correct": correct,
        "incorrect": incorrect,
        "accuracy": round(
            accuracy,
            2
        ),
        "class_results": class_results,
    }


def get_risk_distribution(checkins):
    """
    Count the existing stored risk labels.

    This helps us inspect whether the historical dataset
    is heavily imbalanced.
    """

    distribution = {}

    for checkin in checkins:

        risk = normalize_risk_label(
            checkin.risk_level
        )

        if risk not in distribution:
            distribution[risk] = 0

        distribution[risk] += 1

    return distribution


def knn_risk_analysis(
    checkins,
    k=5
):
    """
    Complete KNN analysis for Pause.

    The latest check-in is classified using previous
    historical check-ins only.

    The algorithm is also evaluated using
    Leave-One-Out Cross-Validation.
    """

    checkins = list(checkins)

    if len(checkins) < k + 1:
        return {
            "status": "not_enough_data",
            "algorithm":
                "k_nearest_neighbors",
            "message":
                f"At least {k + 1} check-ins are required.",
        }

    # Ensure chronological order.
    checkins.sort(
        key=lambda c: c.checkin_date
    )

    latest_checkin = checkins[-1]

    # IMPORTANT:
    # Latest observation must not be one of its
    # own neighbors.
    historical_training_data = (
        checkins[:-1]
    )

    classification = classify_checkin(
        historical_training_data,
        latest_checkin,
        k
    )

    evaluation = evaluate_knn(
        checkins,
        k
    )

    distribution = get_risk_distribution(
        checkins
    )

    return {
        "status": "success",
        "algorithm":
            "k_nearest_neighbors",
        "k": k,
        "data_points": len(checkins),

        "target_date": str(
            latest_checkin.checkin_date
        ),

        "actual_risk": normalize_risk_label(
            latest_checkin.risk_level
        ),

        "predicted_risk":
            classification[
                "predicted_risk"
            ],

        "votes":
            classification[
                "votes"
            ],

        "neighbors":
            classification[
                "neighbors"
            ],

        "risk_distribution":
            distribution,

        "evaluation":
            evaluation,
    }