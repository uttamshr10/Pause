from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils.timezone import now
from django.conf import settings

from .trend_utils import analyze_trend
from .weekly_utils import generate_weekly_report
from .models import Insight
from wellness.models import DailyCheckIn
from .prediction_utils import predict_burnout_risk

# -------------------------------
# WEEKLY TREND
# -------------------------------
class WeeklyTrendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        from datetime import timedelta
        from django.utils.timezone import now

        last_7_days = now().date() - timedelta(days=7)

        checkins = DailyCheckIn.objects.filter(
            user=user,
            checkin_date__gte=last_7_days
        ).order_by("checkin_date")

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


# -------------------------------
# INSIGHT (TOGGLE ENABLED)
# -------------------------------
class InsightView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user

        # Check cached insight
        existing = Insight.objects.filter(user=user).first()
        if existing:
            return Response({"insight": existing.content})

        # Get latest 7 checkins
        checkins = DailyCheckIn.objects.filter(
            user=user
        ).order_by("-checkin_date")[:7]

        if not checkins:
            return Response({"insight": "Not enough data to generate insight."})
        checkins_list = list(checkins)[::-1]
        trend_result = analyze_trend(checkins_list)
        # Prepare summary
        summary = f"""
        Burnout scores: {[c.burnout_score for c in checkins]}
        Stress: {[c.stress_level for c in checkins]}
        Sleep: {[c.sleep_hours for c in checkins]}
        Trend: {trend_result['trend_status']}
        """

        # 🔥 TOGGLE
        use_ai = getattr(settings, "USE_AI_INSIGHT", False)

        if use_ai and client:
            try:
                response = client.chat.completions.create(
                    model="gpt-4.1-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a wellness assistant. Give short, clear burnout insights."
                        },
                        {
                            "role": "user",
                            "content": f"Analyze this data and give a short insight:\n{summary}"
                        }
                    ],
                    max_tokens=100
                )

                insight_text = response.choices[0].message.content.strip()

            except Exception:
                insight_text = "AI insight unavailable. Showing fallback insight."

        else:
            # ✅ STATIC FALLBACK (SMART)
            insight_text = self.generate_static_insight(checkins, trend_result)

        # Save insight
        Insight.objects.create(user=user, content=insight_text)

        return Response({"insight": insight_text})

    # -------------------------------
    # STATIC FALLBACK LOGIC
    # -------------------------------
    def generate_static_insight(self, checkins, trend_result):
        trend = trend_result["trend_status"]

        if trend == "worsening":
            return "Your burnout trend is increasing. Consider reducing workload and improving recovery time."

        if trend == "improving":
            return "Your burnout trend is improving. Keep maintaining your current routine."

        # stable fallback
        avg_stress = sum(c.stress_level for c in checkins) / len(checkins)

        if avg_stress >= 7:
            return "Your stress levels are consistently high. Consider taking breaks."

        return "Your wellness pattern looks stable. Keep maintaining your routine."


# -------------------------------
# TREND ANALYSIS
# -------------------------------
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


# -------------------------------
# WEEKLY REPORT
# -------------------------------
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

class StreakView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        checkins = DailyCheckIn.objects.filter(
            user=user
        ).order_by("-checkin_date")

        streak = 0
        today = now().date()

        dates = [c.checkin_date for c in checkins]

        current_day = today

        while current_day in dates:
            streak += 1
            current_day = current_day - timedelta(days=1)

        return Response({
            "current_streak": streak,
            "message": f"You have checked in for {streak} day(s) in a row."
        })


class BurnoutPredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        checkins = DailyCheckIn.objects.filter(
            user=user
        ).order_by("-checkin_date")[:7]

        checkins = list(checkins)[::-1]

        prediction = predict_burnout_risk(checkins)

        return Response(prediction)