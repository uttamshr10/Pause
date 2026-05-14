from django.urls import path
from .views import WeeklyTrendView, InsightView

urlpatterns = [
    path("weekly-trend/", WeeklyTrendView.as_view()),
    path("insight/", InsightView.as_view()),
]