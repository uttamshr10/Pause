from django.urls import path
from .views import DailyCheckInCreateView, DailyCheckInListView

urlpatterns = [
    path('checkins/', DailyCheckInListView.as_view(), name='checkin-list'),
    path('checkins/create/', DailyCheckInCreateView.as_view(), name='checkin-create'),
]