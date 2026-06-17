from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from analytics.recommendation_utils import generate_recommendations
from rest_framework.response import Response
from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer
from analytics.models import Recommendation, ActionPlan
from analytics.action_plan_utils import generate_action_plan

from .utils import calculate_burnout_score, classify_risk
from django.utils.timezone import localdate

class DailyCheckInCreateView(generics.CreateAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        today = localdate()

        already_exists = DailyCheckIn.objects.filter(
            user=request.user,
            checkin_date=today
        ).exists()

        if already_exists:
            return Response(
                {"error": "You have already submitted today's check-in."},
                status=400
            )

        burnout_score = calculate_burnout_score(data)
        risk_level = classify_risk(burnout_score, data)
        recommendations = generate_recommendations(data)
        action_plans = generate_action_plan(data)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            user=request.user,
            burnout_score=burnout_score,
            risk_level=risk_level
        )

        for rec in recommendations:
            Recommendation.objects.create(
                user=request.user,
                content=rec
            )

        for plan in action_plans:
            ActionPlan.objects.create(
                user=request.user,
                title=plan["title"],
                description=plan["description"]
            )

        return Response({
            "burnout_score": burnout_score,
            "risk_level": risk_level,
            "recommendations": recommendations,
            "action_plans": action_plans
        })


class DailyCheckInListView(generics.ListAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)