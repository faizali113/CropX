from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Farm, Crop, MarketListing, Order, DiseaseRecord, MarketPrice, Message, Notification
from .serializers import (
    FarmSerializer, CropSerializer, MarketListingSerializer,
    OrderSerializer, DiseaseRecordSerializer, MarketPriceSerializer,
    MessageSerializer, NotificationSerializer
)
from .permissions import IsFarmer, IsOwner


# ── Farms ────────────────────────────────────────────────────────────────────
class FarmListCreateView(generics.ListCreateAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated, IsFarmer]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'district', 'state']
    ordering_fields = ['created_at', 'area_acres']

    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return Farm.objects.all()
        return Farm.objects.filter(owner=self.request.user, is_active=True)


class FarmDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Farm.objects.filter(owner=self.request.user)


# ── Crops ────────────────────────────────────────────────────────────────────
class CropListCreateView(generics.ListCreateAPIView):
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated, IsFarmer]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['farm', 'current_stage', 'health_status', 'is_active']
    search_fields = ['name', 'variety']

    def get_queryset(self):
        return Crop.objects.filter(farm__owner=self.request.user)


class CropDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Crop.objects.filter(farm__owner=self.request.user)


# ── Market Listings ──────────────────────────────────────────────────────────
class MarketListingListCreateView(generics.ListCreateAPIView):
    serializer_class = MarketListingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_organic']
    search_fields = ['crop_name', 'variety']
    ordering_fields = ['price_per_kg', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'FARMER':
            return MarketListing.objects.filter(farmer=user)
        return MarketListing.objects.filter(status='ACTIVE')


class MarketListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MarketListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MarketListing.objects.filter(farmer=self.request.user)


# ── Orders ───────────────────────────────────────────────────────────────────
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status']
    ordering_fields = ['created_at', 'total_price']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'FARMER':
            return Order.objects.filter(farmer=user)
        elif user.role == 'CUSTOMER':
            return Order.objects.filter(customer=user)
        return Order.objects.all()


class OrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(farmer=self.request.user) | Order.objects.filter(customer=self.request.user)


# ── Disease Scanner ──────────────────────────────────────────────────────────
class DiseaseRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = DiseaseRecordSerializer
    permission_classes = [IsAuthenticated, IsFarmer]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return DiseaseRecord.objects.filter(farmer=self.request.user)


class DiseaseRecordDetailView(generics.RetrieveAPIView):
    serializer_class = DiseaseRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DiseaseRecord.objects.filter(farmer=self.request.user)


# ── Market Prices ────────────────────────────────────────────────────────────
class MarketPriceListView(generics.ListAPIView):
    serializer_class = MarketPriceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['state', 'district', 'trend']
    search_fields = ['crop_name', 'market_name', 'state']

    def get_queryset(self):
        return MarketPrice.objects.all().order_by('-created_at')


class MarketPriceHighlightsView(APIView):
    """Returns 5-8 trending crops for the dashboard widget."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import random
        from decimal import Decimal

        CROPS = [
            {'name': 'Wheat', 'emoji': '🌾'},
            {'name': 'Cotton', 'emoji': '🌿'},
            {'name': 'Rice', 'emoji': '🍚'},
            {'name': 'Tomato', 'emoji': '🍅'},
            {'name': 'Onion', 'emoji': '🧅'},
            {'name': 'Potato', 'emoji': '🥔'},
            {'name': 'Maize', 'emoji': '🌽'},
            {'name': 'Groundnut', 'emoji': '🥜'},
            {'name': 'Soybean', 'emoji': '🫘'},
            {'name': 'Bajra', 'emoji': '🌾'},
        ]
        MARKETS = [
            ('Azadpur Mandi', 'Delhi'), ('Vashi APMC', 'Maharashtra'),
            ('Koyambedu Market', 'Tamil Nadu'), ('Yeshwanthpur APMC', 'Karnataka'),
            ('Gultekdi Market', 'Maharashtra'), ('Sector 26 Chandigarh', 'Punjab'),
        ]
        BASE_PRICES = {
            'Wheat': 2200, 'Cotton': 6800, 'Rice': 2800, 'Tomato': 1500,
            'Onion': 1200, 'Potato': 900, 'Maize': 1800, 'Groundnut': 5200,
            'Soybean': 4100, 'Bajra': 2000,
        }

        selected = random.sample(CROPS, 6)
        data = []
        for crop in selected:
            base = BASE_PRICES[crop['name']]
            change_pct = round(random.uniform(-8, 12), 2)
            price = round(base * (1 + change_pct / 100))
            market = random.choice(MARKETS)
            trend = 'UP' if change_pct > 0.5 else ('DOWN' if change_pct < -0.5 else 'STABLE')
            sparkline = [round(base * (1 + random.uniform(-5, 5) / 100)) for _ in range(7)]
            sparkline[-1] = price
            data.append({
                'id': crop['name'].lower(),
                'name': crop['name'],
                'emoji': crop['emoji'],
                'price_per_quintal': price,
                'change_percent': change_pct,
                'trend': trend,
                'market_name': market[0],
                'state': market[1],
                'sparkline': sparkline,
            })

        return Response({'results': data})


# ── Messages ─────────────────────────────────────────────────────────────────
class MessageThreadView(APIView):
    """
    GET  /api/messages/?with=<user_id>  — fetch conversation with a specific user
    POST /api/messages/                 — send a message  { recipient, body }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        other_id = request.query_params.get('with')
        if not other_id:
            # Return list of unique conversation partners
            from django.db.models import Q, Max
            partners = (
                Message.objects
                .filter(Q(sender=request.user) | Q(recipient=request.user))
                .values('sender', 'recipient')
            )
            seen = set()
            result = []
            for p in partners:
                other = p['recipient'] if p['sender'] == request.user.id else p['sender']
                if other not in seen:
                    seen.add(other)
                    result.append(other)
            from authentication.models import User
            from authentication.serializers import UserSerializer
            users = User.objects.filter(pk__in=result)
            return Response(UserSerializer(users, many=True).data)

        from django.db.models import Q
        messages = Message.objects.filter(
            Q(sender=request.user, recipient_id=other_id) |
            Q(sender_id=other_id, recipient=request.user)
        ).order_by('created_at')
        # Mark incoming as read
        messages.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response(MessageSerializer(messages, many=True).data)

    def post(self, request):
        serializer = MessageSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ── Notifications ────────────────────────────────────────────────────────────
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        if pk:
            Notification.objects.filter(pk=pk, user=request.user).update(is_read=True)
        else:
            Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({'status': 'ok'})


# ── Customer Dashboard Stats ──────────────────────────────────────────────────
class CustomerDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        orders = Order.objects.filter(customer=user)
        active_orders = orders.filter(status__in=['PENDING', 'ACCEPTED', 'PACKED', 'IN_TRANSIT']).count()
        delivered = orders.filter(status='DELIVERED').count()
        total_spent = sum(o.total_price for o in orders.filter(status='DELIVERED'))
        active_listings = MarketListing.objects.filter(status='ACTIVE').count()
        return Response({
            'total_orders': orders.count(),
            'active_orders': active_orders,
            'delivered_orders': delivered,
            'total_spent': float(total_spent),
            'available_listings': active_listings,
        })


# ── Dashboard Stats ──────────────────────────────────────────────────────────
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsFarmer]

    def get(self, request):
        user = request.user
        farms = Farm.objects.filter(owner=user, is_active=True)
        crops = Crop.objects.filter(farm__owner=user, is_active=True)
        orders = Order.objects.filter(farmer=user)
        pending = orders.filter(status='PENDING').count()
        revenue = sum(o.total_price for o in orders.filter(status='DELIVERED'))
        unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
        return Response({
            'farms_count': farms.count(),
            'active_crops': crops.count(),
            'total_orders': orders.count(),
            'pending_deliveries': pending,
            'total_revenue': float(revenue),
            'today_income': 0,
            'farm_health_score': 82,
            'weather_risk': 'LOW',
            'market_opportunity': 76,
            'unread_notifications': unread_notifications,
        })
