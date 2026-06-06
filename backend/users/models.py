from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):

    ROLE_CHOICES = (
        ('employee', 'Employee'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='employee'
    )

    organization = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    designation = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('employee', 'Employee'),
        ('freelancer', 'Freelancer'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    avg_sleep_hours = models.FloatField(default=7)
    avg_work_hours = models.FloatField(default=8)

    stress_baseline = models.IntegerField(default=5)

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='employee'
    )

    wellness_goal = models.TextField(blank=True, null=True)
    sleep_goal = models.FloatField(default=7)
    recovery_goal = models.FloatField(default=1.5)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Profile"