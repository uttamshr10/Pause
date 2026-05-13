from rest_framework import serializers
from .models import DailyCheckIn


class DailyCheckInSerializer(serializers.ModelSerializer):

    class Meta:
        model = DailyCheckIn
        fields = [
            'id',
            'mood_score',
            'stress_level',
            'sleep_hours',
            'workload_level',
            'energy_level',
            'work_satisfaction',
            'notes',
            'checkin_date',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'checkin_date',
            'created_at',
        ]