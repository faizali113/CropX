from django.urls import path
from . import views

app_name = 'farms'

urlpatterns = [
    # Dashboard stats
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),

    # Farms
    path('farms/', views.FarmListCreateView.as_view(), name='farm-list'),
    path('farms/<int:pk>/', views.FarmDetailView.as_view(), name='farm-detail'),

    # Crops
    path('crops/', views.CropListCreateView.as_view(), name='crop-list'),
    path('crops/<int:pk>/', views.CropDetailView.as_view(), name='crop-detail'),

    # Marketplace
    path('listings/', views.MarketListingListCreateView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', views.MarketListingDetailView.as_view(), name='listing-detail'),

    # Orders
    path('orders/', views.OrderListCreateView.as_view(), name='order-list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),

    # Disease Scanner
    path('disease/scans/', views.DiseaseRecordListCreateView.as_view(), name='disease-list'),
    path('disease/scans/<int:pk>/', views.DiseaseRecordDetailView.as_view(), name='disease-detail'),

    # Market Prices
    path('market/prices/', views.MarketPriceListView.as_view(), name='market-prices'),
    path('market/highlights/', views.MarketPriceHighlightsView.as_view(), name='market-highlights'),

    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/read/', views.NotificationMarkReadView.as_view(), name='notifications-mark-all-read'),
    path('notifications/<int:pk>/read/', views.NotificationMarkReadView.as_view(), name='notification-mark-read'),
]
