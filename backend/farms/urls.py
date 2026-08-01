from django.urls import path
from . import views
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
)

app_name = 'farms'

urlpatterns = [
    # Dashboard stats
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/customer-stats/', CustomerDashboardStatsView.as_view(), name='customer-dashboard-stats'),

    # Farms
    path('farms/', FarmListCreateView.as_view(), name='farm-list'),
    path('farms/<int:pk>/', FarmDetailView.as_view(), name='farm-detail'),

    # Crops
    path('crops/', CropListCreateView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', CropDetailView.as_view(), name='crop-detail'),

    # Marketplace
    path('listings/', MarketListingListCreateView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', MarketListingDetailView.as_view(), name='listing-detail'),

    # Orders
    path('orders/', OrderListCreateView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    # Disease Scanner
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
]
