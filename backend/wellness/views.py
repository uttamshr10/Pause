from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer


class DailyCheckInCreateView(generics.CreateAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DailyCheckInListView(generics.ListAPIView):
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)