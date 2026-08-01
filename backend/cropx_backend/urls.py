"""
Root URL configuration for CropX backend.
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls', namespace='authentication')),
    path('api/', include('farms.urls', namespace='farms')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
