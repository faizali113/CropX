from django.urls import path

from .views import (
    CustomTokenRefreshView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    ProtectedView,
    RegisterView,
    ResetPasswordView,
    VerifyEmailView,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token-refresh'),
]
