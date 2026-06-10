from django.urls import path
from .views import WeeklyTrendView, InsightView, TrendAnalysisView, WeeklyReportView, StreakView, BurnoutPredictionView, ReflectionView, AchievementView

urlpatterns = [
    path("weekly-trend/", WeeklyTrendView.as_view()),
    path("insight/", InsightView.as_view()),
    path("trend-analysis/", TrendAnalysisView.as_view()),
    path("weekly-report/", WeeklyReportView.as_view()),
    path("streak/", StreakView.as_view()),
    path("burnout-prediction/", BurnoutPredictionView.as_view()),
    path("reflection/", ReflectionView.as_view()),
    path("achievements/", AchievementView.as_view()),
]