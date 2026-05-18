from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from analytics.recommendation_utils import generate_recommendations

from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer

from .utils import calculate_burnout_score, classify_risk


class DailyCheckInCreateView(generics.CreateAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data

        burnout_score = calculate_burnout_score(data)
        risk_level = classify_risk(burnout_score, data)
        recommendations = generate_recommendations(data)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            user=request.user,
            burnout_score=burnout_score,
            risk_level=risk_level
        )

        return Response({
            "burnout_score": burnout_score,
            "risk_level": risk_level,
            "recommendations": recommendations
        })


class DailyCheckInListView(generics.ListAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)