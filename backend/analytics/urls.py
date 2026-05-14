from django.urls import path
from .views import WeeklyTrendView

urlpatterns = [
    path("weekly-trend/", WeeklyTrendView.as_view()),
]