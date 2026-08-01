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


# ═══════════════════════════════════════════════════════════════════════════════
# AI VIEWS — Gemini + OpenWeatherMap
# ═══════════════════════════════════════════════════════════════════════════════

def _gemini_text(prompt: str) -> str:
    """Call Gemini 1.5-flash text model. Returns the text response."""
    import google.generativeai as genai
    from django.conf import settings
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    return response.text.strip()


# ── Crop Scanner (Vision) ────────────────────────────────────────────────────
class CropScanView(APIView):
    """
    POST /api/ai/scan/
    Body: { image_base64: "<base64 string>", mime_type: "image/jpeg" }
    Returns crop identification + fertilizer recommendation + market price hint.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        import base64, json, re
        import google.generativeai as genai
        from django.conf import settings

        image_b64 = request.data.get('image_base64', '')
        mime_type = request.data.get('mime_type', 'image/jpeg')

        if not image_b64:
            return Response({'detail': 'image_base64 is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = """You are an expert agricultural scientist. Analyse this crop image carefully.

Return ONLY a JSON object (no markdown, no code fences, just raw JSON) with exactly these fields:
{
  "crop_name": "Common name of the crop (e.g. Tomato, Wheat, Rice)",
  "confidence": <integer 0-100>,
  "variety": "Likely variety if identifiable, else empty string",
  "growth_stage": "Current visible growth stage (e.g. Flowering, Fruiting, Vegetative)",
  "health_status": "Healthy | Stressed | Diseased | Unknown",
  "observations": "2-3 sentence description of what you observe in the image",
  "fertilizer_recommendation": {
    "name": "Primary recommended fertilizer name",
    "dosage": "Application rate (e.g. 50 kg/acre)",
    "timing": "When to apply",
    "reason": "Why this fertilizer suits this crop at this stage"
  },
  "farming_advice": "One practical tip specific to what you see in this image"
}"""

            image_part = {
                'mime_type': mime_type,
                'data': base64.b64decode(image_b64),
            }

            response = model.generate_content([prompt, image_part])
            raw = response.text.strip()

            # Strip markdown fences if Gemini adds them
            raw = re.sub(r'^```(?:json)?\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)

            result = json.loads(raw)

            # Attach a market price hint from our highlights generator
            BASE_PRICES = {
                'wheat': 2200, 'cotton': 6800, 'rice': 2800, 'tomato': 1500,
                'onion': 1200, 'potato': 900, 'maize': 1800, 'groundnut': 5200,
                'soybean': 4100, 'bajra': 2000,
            }
            import random
            crop_lower = result.get('crop_name', '').lower()
            base_price = None
            for k, v in BASE_PRICES.items():
                if k in crop_lower:
                    base_price = v
                    break

            if base_price:
                change = round(random.uniform(-6, 10), 1)
                price = round(base_price * (1 + change / 100))
                markets = ['Azadpur Mandi, Delhi', 'Lasalgaon APMC, Maharashtra',
                           'Koyambedu, Tamil Nadu', 'Yeshwanthpur, Karnataka']
                result['market_price'] = {
                    'price_per_quintal': price,
                    'change_percent': change,
                    'market': random.choice(markets),
                    'trend': 'UP' if change > 0.5 else ('DOWN' if change < -0.5 else 'STABLE'),
                }
            else:
                result['market_price'] = None

            return Response(result, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            # Gemini returned text but not valid JSON — extract what we can
            return Response({
                'crop_name': 'Could not identify',
                'confidence': 0,
                'observations': response.text[:500] if 'response' in dir() else 'Analysis failed.',
                'fertilizer_recommendation': None,
                'market_price': None,
                'error': 'AI returned non-JSON response',
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': f'AI scan failed: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


# ── AI Insights for Customer Dashboard ───────────────────────────────────────
class AIInsightsView(APIView):
    """
    GET /api/ai/insights/
    Generates personalised agronomic insights for the logged-in customer
    based on their order history and available listings.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Gather context
        orders = Order.objects.filter(customer=user).order_by('-created_at')[:10]
        active_listings = MarketListing.objects.filter(status='ACTIVE').order_by('-created_at')[:8]

        order_summary = ', '.join(
            f"{o.crop_name} ({o.quantity_kg}kg at ₹{o.price_per_kg}/kg)"
            for o in orders
        ) or 'No orders yet'

        listing_summary = ', '.join(
            f"{l.crop_name} at ₹{l.price_per_kg}/kg"
            for l in active_listings
        ) or 'No active listings'

        prompt = f"""You are an expert agricultural market analyst for India.
A customer on the CropX platform has the following profile:
- Recent orders: {order_summary}
- Currently available crops in the marketplace: {listing_summary}

Generate exactly 5 personalised, actionable agronomic and market insights for this customer.
Each insight should be practical, data-driven, and specific to Indian agriculture.

Return ONLY a JSON array (no markdown, no code fences) of 5 objects:
[
  {{
    "icon": "<single emoji>",
    "title": "Short title (max 8 words)",
    "text": "Detailed actionable insight (2-3 sentences)",
    "type": "market|weather|crop|health|price",
    "color": "<hex color code matching the type>"
  }}
]

Use these colors: market=#22c55e, weather=#3b82f6, crop=#2E7D32, health=#f59e0b, price=#8b5cf6"""

        try:
            import json, re
            raw = _gemini_text(prompt)
            raw = re.sub(r'^```(?:json)?\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            insights = json.loads(raw)
            return Response({'insights': insights[:5]}, status=status.HTTP_200_OK)
        except Exception as e:
            # Return safe fallback so the dashboard never breaks
            return Response({
                'insights': [
                    {'icon': '📈', 'title': 'Market prices are active', 'text': 'Check the marketplace for fresh listings from verified farmers near you.', 'type': 'market', 'color': '#22c55e'},
                    {'icon': '🌾', 'title': 'Good time to stock wheat', 'text': 'Wheat prices historically dip after harvest season. Consider placing an order now.', 'type': 'price', 'color': '#8b5cf6'},
                    {'icon': '💧', 'title': 'Irrigation advisory', 'text': 'Monitor water-intensive crops like rice and sugarcane for consistent moisture during growth stage.', 'type': 'crop', 'color': '#2E7D32'},
                    {'icon': '🍅', 'title': 'Tomato demand is rising', 'text': 'Festival season demand for tomatoes is increasing. Source from multiple farmers to secure supply.', 'type': 'market', 'color': '#22c55e'},
                    {'icon': '🌤️', 'title': 'Check local weather', 'text': 'Weather conditions affect crop availability. Plan purchases accordingly to avoid supply disruptions.', 'type': 'weather', 'color': '#3b82f6'},
                ],
                'source': 'fallback',
            }, status=status.HTTP_200_OK)


# ── Weather (OpenWeatherMap + Gemini farming advice) ─────────────────────────
class WeatherView(APIView):
    """
    GET /api/weather/?city=<city_name>&lat=<lat>&lon=<lon>
    Returns current weather + 5-day forecast + AI farming advice.
    Defaults to New Delhi if no location provided.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        import requests as req_lib
        from django.conf import settings

        city = request.query_params.get('city', 'New Delhi')
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        api_key = settings.OPENWEATHER_API_KEY

        try:
            # Current weather
            if lat and lon:
                current_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric'
                forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric'
            else:
                current_url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
                forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

            current_resp = req_lib.get(current_url, timeout=8)
            current_resp.raise_for_status()
            current = current_resp.json()

            forecast_resp = req_lib.get(forecast_url, timeout=8)
            forecast_resp.raise_for_status()
            forecast_raw = forecast_resp.json()

            # Parse current weather
            weather_now = {
                'city': current.get('name', city),
                'country': current.get('sys', {}).get('country', ''),
                'temp': round(current['main']['temp']),
                'feels_like': round(current['main']['feels_like']),
                'temp_min': round(current['main']['temp_min']),
                'temp_max': round(current['main']['temp_max']),
                'humidity': current['main']['humidity'],
                'wind_speed': round(current.get('wind', {}).get('speed', 0) * 3.6, 1),  # m/s → km/h
                'description': current['weather'][0]['description'].title(),
                'icon_code': current['weather'][0]['icon'],
                'uv_index': 0,  # Requires separate UV endpoint
                'visibility': round(current.get('visibility', 10000) / 1000, 1),
                'pressure': current['main']['pressure'],
                'clouds': current.get('clouds', {}).get('all', 0),
            }

            # Parse 5-day forecast — pick one reading per day (noon)
            from collections import defaultdict
            from datetime import datetime
            day_data = defaultdict(list)
            for item in forecast_raw.get('list', []):
                dt = datetime.fromtimestamp(item['dt'])
                day_data[dt.strftime('%Y-%m-%d')].append(item)

            daily_forecast = []
            for date_str, items in sorted(day_data.items())[:7]:
                # Pick midday reading
                midday = min(items, key=lambda x: abs(datetime.fromtimestamp(x['dt']).hour - 12))
                daily_forecast.append({
                    'date': date_str,
                    'day': datetime.strptime(date_str, '%Y-%m-%d').strftime('%A'),
                    'temp_max': round(max(i['main']['temp_max'] for i in items)),
                    'temp_min': round(min(i['main']['temp_min'] for i in items)),
                    'humidity': round(sum(i['main']['humidity'] for i in items) / len(items)),
                    'rain_prob': round(max(i.get('pop', 0) for i in items) * 100),
                    'wind_speed': round(midday.get('wind', {}).get('speed', 0) * 3.6, 1),
                    'description': midday['weather'][0]['description'].title(),
                    'icon_code': midday['weather'][0]['icon'],
                })

            # Generate AI farming advice with Gemini
            try:
                advice_prompt = f"""You are an agricultural advisor in India.
Current weather: {weather_now['temp']}°C, {weather_now['description']}, humidity {weather_now['humidity']}%, wind {weather_now['wind_speed']} km/h.
7-day forecast summary: {', '.join(f"{d['day']}: {d['temp_max']}°C high, {d['rain_prob']}% rain" for d in daily_forecast[:7])}

Generate exactly 7 short farming advice tips, one per day.
Return ONLY a JSON array of 7 strings. Each string must be 1-2 sentences of practical advice.
Example: ["Good day for spraying pesticides before 10am.", "Rain expected, delay fertilizer application."]"""

                import json, re
                raw = _gemini_text(advice_prompt)
                raw = re.sub(r'^```(?:json)?\s*', '', raw)
                raw = re.sub(r'\s*```$', '', raw)
                advice_list = json.loads(raw)
            except Exception:
                advice_list = [
                    'Monitor crop moisture levels regularly.',
                    'Ideal conditions for field operations this morning.',
                    'Check for pest activity after rain.',
                    'High temperature — increase irrigation frequency.',
                    'Good day for harvesting mature crops.',
                    'Apply organic mulch to retain soil moisture.',
                    'Inspect crops for signs of fungal infection after humid conditions.',
                ]

            # Attach advice to each day
            for i, day in enumerate(daily_forecast):
                day['ai_advice'] = advice_list[i] if i < len(advice_list) else 'Monitor your crops and adjust irrigation as needed.'

            return Response({
                'current': weather_now,
                'forecast': daily_forecast,
            }, status=status.HTTP_200_OK)

        except req_lib.exceptions.HTTPError as e:
            if '404' in str(e):
                return Response({'detail': f'City "{city}" not found. Try a different city name.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': f'Weather service error: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'detail': f'Weather fetch failed: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


# ═══════════════════════════════════════════════════════════════════════════════
# BOOKING VIEWS (Step 5)
# ═══════════════════════════════════════════════════════════════════════════════
from .models import Booking
from .serializers import BookingSerializer


class BookingListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/bookings/         — list bookings for the current user
    POST /api/bookings/         — customer creates a booking request
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Booking.objects.filter(customer=user)
        elif user.role == 'FARMER':
            return Booking.objects.filter(farmer=user)
        return Booking.objects.all()


class BookingDetailView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/bookings/<id>/   — get a single booking
    PATCH /api/bookings/<id>/   — farmer updates status (BOOKED / REJECTED)
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Booking.objects.filter(customer=user)
        elif user.role == 'FARMER':
            return Booking.objects.filter(farmer=user)
        return Booking.objects.all()

    def update(self, request, *args, **kwargs):
        """
        Farmers can only update status and farmer_note.
        Customers can only cancel their own pending bookings.
        """
        booking = self.get_object()
        user = request.user

        if user.role == 'FARMER' and booking.farmer == user:
            allowed = {'status', 'farmer_note'}
            data = {k: v for k, v in request.data.items() if k in allowed}
            serializer = self.get_serializer(booking, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        if user.role == 'CUSTOMER' and booking.customer == user:
            if booking.status == 'PENDING':
                booking.status = 'CANCELLED'
                booking.save(update_fields=['status'])
                return Response(BookingSerializer(booking).data)
            return Response({'detail': 'Can only cancel pending bookings.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Not allowed.'}, status=status.HTTP_403_FORBIDDEN)


class PublicFarmListView(generics.ListAPIView):
    """
    GET /api/farms/public/   — all active farms visible to customers
    Returns farm details + farmer info for the farm table.
    """
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'district', 'state', 'owner__name', 'owner__email']

    def get_queryset(self):
        return Farm.objects.filter(is_active=True).select_related('owner')
