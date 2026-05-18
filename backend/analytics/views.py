from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .ai_utils import generate_insight
from .trend_utils import analyze_trend
from wellness.models import DailyCheckIn
from .weekly_utils import generate_weekly_report

class WeeklyTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        from datetime import timedelta
        from django.utils.timezone import now
        last_7_days = now().date() - timedelta(days=7)
        checkins = DailyCheckIn.objects.filter(user=user, checkin_date__gte=last_7_days).order_by("checkin_date")

        data = [
            {
                "date": c.checkin_date,
                "burnout_score": c.burnout_score,
                "stress": c.stress_level,
                "mood": c.mood_score,
            }
            for c in checkins
        ]

        return Response(data)
    
class InsightView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user

        checkins = DailyCheckIn.objects.filter(user=user).order_by("-checkin_date")[:7]

        insight = generate_insight(checkins)

        return Response({
            "insight": insight
        })

class TrendAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        checkins = DailyCheckIn.objects.filter(
            user=user
        ).order_by("-checkin_date")[:7]

        checkins = list(checkins)[::-1]

        result = analyze_trend(checkins)

        return Response(result)
    
class WeeklyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        checkins = DailyCheckIn.objects.filter(
            user=user
        ).order_by("-checkin_date")[:7]

        checkins = list(checkins)

        report = generate_weekly_report(checkins)

        return Response(report)