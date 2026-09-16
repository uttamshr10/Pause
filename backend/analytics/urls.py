from django.urls import path
from .views import (WeeklyTrendView, InsightView, 
    TrendAnalysisView, WeeklyReportView, 
    StreakView, BurnoutPredictionView, 
    ReflectionView, AchievementView, 
    RecommendationView, ActionPlanView, 
    ActionPlanToggleView, RecoveryProgressView,
    WellnessPatternView, KNNRiskAnalysisView,

)
urlpatterns = [
    path("weekly-trend/", WeeklyTrendView.as_view()),
    path("insight/", InsightView.as_view()),
    path("trend-analysis/", TrendAnalysisView.as_view()),
    path("weekly-report/", WeeklyReportView.as_view()),
    path("streak/", StreakView.as_view()),
    path("burnout-prediction/", BurnoutPredictionView.as_view()),
    path("reflection/", ReflectionView.as_view()),
    path("achievements/", AchievementView.as_view()),
    path("recommendations/", RecommendationView.as_view()),
    path("action-plans/", ActionPlanView.as_view()),
    path("action-plans/<int:plan_id>/toggle/", ActionPlanToggleView.as_view()),
    path("recovery-progress/", RecoveryProgressView.as_view()),
    path("wellness-patterns/",WellnessPatternView.as_view()),
    path(
    "knn-risk-analysis/",
    KNNRiskAnalysisView.as_view()
),
]