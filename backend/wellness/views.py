from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer

from .utils import calculate_burnout_score, classify_risk


class DailyCheckInCreateView(generics.CreateAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        data = self.request.data
        burnout_score = calculate_burnout_score(data)
        risk_level = classify_risk(burnout_score)
        serializer.save(user=self.request.user, burnout_score=burnout_score, risk_level=risk_level)


class DailyCheckInListView(generics.ListAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)