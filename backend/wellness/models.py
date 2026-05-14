from django.db import models
from django.conf import settings


class DailyCheckIn(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="checkins"
    )

    mood_score = models.IntegerField()
    stress_level = models.IntegerField()
    sleep_hours = models.FloatField()
    workload_level = models.IntegerField()
    energy_level = models.IntegerField()
    work_satisfaction = models.IntegerField()

    notes = models.TextField(blank=True, null=True)
    burnout_score = models.FloatField(default=0)
    risk_level = models.CharField(max_length=20, default='low')

    checkin_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-checkin_date']
        unique_together = ('user', 'checkin_date')

    def __str__(self):
        return f"{self.user.username} - {self.checkin_date}"