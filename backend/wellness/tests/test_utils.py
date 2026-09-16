from django.test import SimpleTestCase

from wellness.utils import calculate_burnout_score, classify_risk


class BurnoutCalculationTests(SimpleTestCase):

    def test_low_burnout_score(self):
        data = {
            "mood_score": 9,
            "stress_level": 2,
            "sleep_hours": 7.5,
            "workload_level": 3,
            "energy_level": 9,
            "focus_level": 9,
            "recovery_time": 1.5,
            "work_satisfaction": 9,
        }

        score = calculate_burnout_score(data)

        self.assertEqual(score, 14.10)
        self.assertEqual(classify_risk(score, data), "low")


    def test_moderate_burnout_score(self):
        data = {
            "mood_score": 6,
            "stress_level": 6,
            "sleep_hours": 6.5,
            "workload_level": 6,
            "energy_level": 5,
            "focus_level": 5,
            "recovery_time": 0.75,
            "work_satisfaction": 6,
        }

        score = calculate_burnout_score(data)

        self.assertEqual(score, 50.75)
        self.assertEqual(classify_risk(score, data), "moderate")


    def test_high_burnout_score(self):
        data = {
            "mood_score": 4,
            "stress_level": 8,
            "sleep_hours": 5.5,
            "workload_level": 8,
            "energy_level": 4,
            "focus_level": 4,
            "recovery_time": 0.5,
            "work_satisfaction": 4,
        }

        score = calculate_burnout_score(data)

        self.assertEqual(score, 68.55)
        self.assertEqual(classify_risk(score, data), "high")


    def test_critical_burnout_score(self):
        data = {
            "mood_score": 3,
            "stress_level": 9,
            "sleep_hours": 4.5,
            "workload_level": 9,
            "energy_level": 2,
            "focus_level": 2,
            "recovery_time": 0.2,
            "work_satisfaction": 3,
        }

        score = calculate_burnout_score(data)

        self.assertEqual(score, 87.20)
        self.assertEqual(classify_risk(score, data), "critical")

class RiskClassificationBoundaryTests(SimpleTestCase):

    def test_low_upper_boundary(self):
        self.assertEqual(classify_risk(30), "low")

    def test_moderate_lower_boundary(self):
        self.assertEqual(classify_risk(30.01), "moderate")

    def test_moderate_upper_boundary(self):
        self.assertEqual(classify_risk(60), "moderate")

    def test_high_lower_boundary(self):
        self.assertEqual(classify_risk(60.01), "high")

    def test_high_upper_boundary(self):
        self.assertEqual(classify_risk(80), "high")

    def test_critical_lower_boundary(self):
        self.assertEqual(classify_risk(80.01), "critical")

class WarningEscalationTests(SimpleTestCase):

    def test_four_warning_conditions_escalate_to_critical(self):
        data = {
            "stress_level": 8,
            "workload_level": 8,
            "sleep_hours": 5,
            "energy_level": 3,
            "focus_level": 7,
            "recovery_time": 1,
        }

        result = classify_risk(50, data)

        self.assertEqual(result, "critical")

    def test_three_warnings_escalate_moderate_to_high(self):
        data = {
            "stress_level": 8,
            "workload_level": 8,
            "sleep_hours": 5,
            "energy_level": 7,
            "focus_level": 7,
            "recovery_time": 1,
        }

        result = classify_risk(45, data)

        self.assertEqual(result, "high")

    def test_two_warnings_escalate_low_to_moderate(self):
        data = {
            "stress_level": 8,
            "workload_level": 8,
            "sleep_hours": 7,
            "energy_level": 7,
            "focus_level": 7,
            "recovery_time": 1,
        }

        result = classify_risk(25, data)

        self.assertEqual(result, "moderate")