from django.urls import path
from .views import (
    FarmListCreateView, FarmDetailView,
    CropListCreateView, CropDetailView,
    MarketListingListCreateView, MarketListingDetailView,
    OrderListCreateView, OrderDetailView,
    DiseaseRecordListCreateView, DiseaseRecordDetailView,
    MarketPriceListView, MarketPriceHighlightsView,
    MessageThreadView,
    NotificationListView, NotificationMarkReadView,
    DashboardStatsView, CustomerDashboardStatsView,
    CropScanView, AIInsightsView, FarmerAIInsightsView, WeatherView,
    BookingListCreateView, BookingDetailView, PublicFarmListView,
)

app_name = 'farms'

urlpatterns = [
    # Dashboard stats
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/customer-stats/', CustomerDashboardStatsView.as_view(), name='customer-dashboard-stats'),

    # Farms (farmer owns + public listing)
    path('farms/', FarmListCreateView.as_view(), name='farm-list'),
    path('farms/<int:pk>/', FarmDetailView.as_view(), name='farm-detail'),
    path('farms/public/', PublicFarmListView.as_view(), name='farm-public-list'),

    # Crops
    path('crops/', CropListCreateView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', CropDetailView.as_view(), name='crop-detail'),

    # Marketplace
    path('listings/', MarketListingListCreateView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', MarketListingDetailView.as_view(), name='listing-detail'),

    # Orders
    path('orders/', OrderListCreateView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    # Bookings (Step 5)
    path('bookings/', BookingListCreateView.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),

    # Disease Scanner (farmer)
    path('disease/scans/', DiseaseRecordListCreateView.as_view(), name='disease-list'),
    path('disease/scans/<int:pk>/', DiseaseRecordDetailView.as_view(), name='disease-detail'),

    # Market Prices
    path('market/prices/', MarketPriceListView.as_view(), name='market-prices'),
    path('market/highlights/', MarketPriceHighlightsView.as_view(), name='market-highlights'),

    # Messages
    path('messages/', MessageThreadView.as_view(), name='messages'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/read/', NotificationMarkReadView.as_view(), name='notifications-mark-all-read'),
    path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),

    # AI & Weather (Step 4)
    path('ai/scan/', CropScanView.as_view(), name='ai-crop-scan'),
    path('ai/insights/', AIInsightsView.as_view(), name='ai-insights'),
    path('ai/farmer-insights/', FarmerAIInsightsView.as_view(), name='ai-farmer-insights'),
    path('weather/', WeatherView.as_view(), name='weather'),
]
