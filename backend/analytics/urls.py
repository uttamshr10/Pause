from django.urls import path
from .views import WeeklyTrendView, InsightView, TrendAnalysisView, WeeklyReportView

urlpatterns = [
    path("weekly-trend/", WeeklyTrendView.as_view()),
    path("insight/", InsightView.as_view()),
    path("trend-analysis/", TrendAnalysisView.as_view()),
    path("weekly-report/", WeeklyReportView.as_view()),
]