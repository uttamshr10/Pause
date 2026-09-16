import math


FEATURE_NAMES = [
    "stress",
    "sleep",
    "workload",
    "energy",
    "focus",
    "recovery",
]


def extract_features(checkins):
    """
    Convert DailyCheckIn objects into numerical feature vectors.

    Feature order:
    stress, sleep, workload, energy, focus, recovery
    """

    dataset = []

    for checkin in checkins:
        row = [
            float(checkin.stress_level),
            float(checkin.sleep_hours),
            float(checkin.workload_level),
            float(checkin.energy_level),
            float(checkin.focus_level),
            float(checkin.recovery_time),
        ]

        dataset.append(row)

    return dataset


def normalize_dataset(dataset):
    """
    Perform Min-Max normalization manually.

    Each feature is transformed to a value between 0 and 1.

    normalized_value =
        (value - minimum) / (maximum - minimum)
    """

    if not dataset:
        return [], [], []

    number_of_features = len(dataset[0])

    minimums = []
    maximums = []

    # Find min and max for every feature
    for feature_index in range(number_of_features):

        feature_values = []

        for row in dataset:
            feature_values.append(row[feature_index])

        minimums.append(min(feature_values))
        maximums.append(max(feature_values))

    normalized_dataset = []

    # Normalize every observation
    for row in dataset:

        normalized_row = []

        for feature_index in range(number_of_features):

            minimum = minimums[feature_index]
            maximum = maximums[feature_index]

            if maximum == minimum:
                normalized_value = 0.0
            else:
                normalized_value = (
                    row[feature_index] - minimum
                ) / (
                    maximum - minimum
                )

            normalized_row.append(normalized_value)

        normalized_dataset.append(normalized_row)

    return normalized_dataset, minimums, maximums


def euclidean_distance(point_a, point_b):
    """
    Calculate Euclidean distance manually between
    two multidimensional points.
    """

    squared_difference_sum = 0

    for i in range(len(point_a)):
        difference = point_a[i] - point_b[i]
        squared_difference_sum += difference ** 2

    return math.sqrt(squared_difference_sum)


def initialize_centroids(dataset, k):
    """
    Deterministically initialize centroids.

    First centroid:
        first observation.

    Remaining centroids:
        observation farthest from the already selected centroids.

    This avoids random initialization and makes results reproducible.
    """

    if not dataset:
        return []

    if k > len(dataset):
        k = len(dataset)

    centroids = [dataset[0][:]]

    while len(centroids) < k:

        farthest_point = None
        farthest_distance = -1

        for point in dataset:

            nearest_selected_distance = None

            for centroid in centroids:
                distance = euclidean_distance(
                    point,
                    centroid
                )

                if (
                    nearest_selected_distance is None
                    or distance < nearest_selected_distance
                ):
                    nearest_selected_distance = distance

            if nearest_selected_distance > farthest_distance:
                farthest_distance = nearest_selected_distance
                farthest_point = point

        centroids.append(farthest_point[:])

    return centroids


def assign_clusters(dataset, centroids):
    """
    Assign every observation to its nearest centroid.
    """

    assignments = []

    for point in dataset:

        nearest_cluster = 0
        nearest_distance = euclidean_distance(
            point,
            centroids[0]
        )

        for cluster_index in range(1, len(centroids)):

            distance = euclidean_distance(
                point,
                centroids[cluster_index]
            )

            if distance < nearest_distance:
                nearest_distance = distance
                nearest_cluster = cluster_index

        assignments.append(nearest_cluster)

    return assignments


def calculate_centroids(dataset, assignments, k):
    """
    Recalculate each centroid as the mean of all
    observations assigned to that cluster.
    """

    number_of_features = len(dataset[0])

    new_centroids = []

    for cluster_index in range(k):

        cluster_points = []

        for point_index in range(len(dataset)):

            if assignments[point_index] == cluster_index:
                cluster_points.append(
                    dataset[point_index]
                )

        # Empty cluster protection
        if not cluster_points:
            new_centroids.append(
                dataset[cluster_index][:]
            )
            continue

        centroid = []

        for feature_index in range(number_of_features):

            total = 0

            for point in cluster_points:
                total += point[feature_index]

            mean = total / len(cluster_points)

            centroid.append(mean)

        new_centroids.append(centroid)

    return new_centroids


def centroids_equal(old_centroids, new_centroids, tolerance=0.0001):
    """
    Determine whether centroid movement is small enough
    to consider K-Means converged.
    """

    for i in range(len(old_centroids)):

        distance = euclidean_distance(
            old_centroids[i],
            new_centroids[i]
        )

        if distance > tolerance:
            return False

    return True


def denormalize_centroid(
    centroid,
    minimums,
    maximums
):
    """
    Convert normalized centroid values back to
    the original wellness measurement scales.
    """

    original_values = []

    for i in range(len(centroid)):

        minimum = minimums[i]
        maximum = maximums[i]

        if maximum == minimum:
            original_value = minimum
        else:
            original_value = (
                centroid[i] * (maximum - minimum)
            ) + minimum

        original_values.append(original_value)

    return original_values


def generate_pattern_name(centroid):
    """
    Generate a human-readable name for a discovered cluster.

    This function interprets the centroid after K-Means has
    completed. It does not influence cluster assignment.
    """

    stress = centroid[0]
    sleep = centroid[1]
    workload = centroid[2]
    energy = centroid[3]
    focus = centroid[4]
    recovery = centroid[5]

    if (
        stress >= 7
        and workload >= 7
        and energy >= 6
        and focus >= 6
    ):
        return "High-Pressure Productive Pattern"

    if (
        energy <= 5
        and (
            sleep < 6.5
            or recovery < 1
        )
    ):
        return "Low-Energy Recovery Pattern"

    if (
        stress <= 4
        and sleep >= 7
        and energy >= 6
    ):
        return "Balanced Wellness Pattern"

    if stress >= 7 and energy <= 5:
        return "High-Strain Pattern"

    if sleep < 6 and recovery < 1:
        return "Limited Recovery Pattern"

    return "Mixed Wellness Pattern"


def describe_cluster(centroid):
    """
    Describe the centroid produced by K-Means.

    These rules only translate numerical cluster characteristics
    into readable text. They do not perform the clustering.
    """

    stress = centroid[0]
    sleep = centroid[1]
    workload = centroid[2]
    energy = centroid[3]
    focus = centroid[4]
    recovery = centroid[5]

    characteristics = []

    if stress >= 7:
        characteristics.append("high stress")
    elif stress <= 4:
        characteristics.append("lower stress")

    if sleep < 6:
        characteristics.append("limited sleep")
    elif sleep >= 7:
        characteristics.append("strong sleep")

    if workload >= 7:
        characteristics.append("high workload")
    elif workload <= 4:
        characteristics.append("lighter workload")

    if energy <= 4:
        characteristics.append("low energy")
    elif energy >= 7:
        characteristics.append("strong energy")

    if focus <= 4:
        characteristics.append("reduced focus")
    elif focus >= 7:
        characteristics.append("strong focus")

    if recovery < 1:
        characteristics.append("limited recovery")
    elif recovery >= 1.5:
        characteristics.append("strong recovery")

    if not characteristics:
        return "The cluster contains mostly mid-range wellness indicators."

    if len(characteristics) == 1:
        readable = characteristics[0]
    else:
        readable = (
            ", ".join(characteristics[:-1])
            + ", and "
            + characteristics[-1]
        )

    return (
        "This recurring pattern is characterized by "
        + readable
        + "."
    )


def kmeans_clustering(checkins, k=3, max_iterations=100):
    """
    Complete K-Means implementation from scratch.

    Steps:
    1. Extract features.
    2. Normalize features.
    3. Initialize centroids.
    4. Assign observations.
    5. Recalculate centroids.
    6. Repeat until convergence.
    """

    checkins = list(checkins)

    if len(checkins) < k:
        return {
            "status": "not_enough_data",
            "message": f"At least {k} check-ins are required.",
            "clusters": [],
        }

    original_dataset = extract_features(checkins)

    (
        normalized_dataset,
        minimums,
        maximums
    ) = normalize_dataset(original_dataset)

    centroids = initialize_centroids(
        normalized_dataset,
        k
    )

    assignments = []
    iterations = 0
    converged = False

    for iteration in range(max_iterations):

        iterations = iteration + 1

        new_assignments = assign_clusters(
            normalized_dataset,
            centroids
        )

        new_centroids = calculate_centroids(
            normalized_dataset,
            new_assignments,
            k
        )

        if centroids_equal(
            centroids,
            new_centroids
        ):
            assignments = new_assignments
            centroids = new_centroids
            converged = True
            break

        assignments = new_assignments
        centroids = new_centroids

    cluster_results = []

    for cluster_index in range(k):

        cluster_size = assignments.count(
            cluster_index
        )

        original_centroid = denormalize_centroid(
            centroids[cluster_index],
            minimums,
            maximums
        )

        centroid_values = {}

        for i in range(len(FEATURE_NAMES)):
            centroid_values[
                FEATURE_NAMES[i]
            ] = round(original_centroid[i], 2)

        cluster_results.append({
            "cluster": cluster_index + 1,
            "size": cluster_size,

            "pattern_name": generate_pattern_name(
                original_centroid
            ),

            "centroid": centroid_values,

            "description": describe_cluster(
                original_centroid
            ),
        })

    # Find cluster belonging to most recent check-in
    current_cluster_index = assignments[-1]

    return {
        "status": "success",
        "algorithm": "k_means_clustering",
        "k": k,
        "data_points": len(checkins),
        "iterations": iterations,
        "converged": converged,
        "current_cluster": current_cluster_index + 1,
        "clusters": cluster_results,
    }