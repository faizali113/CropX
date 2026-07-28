from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken


class AuthenticationTests(APITestCase):
    def test_user_registration_creates_unverified_user(self):
        url = reverse('authentication:register')
        payload = {
            'email': 'farmer@example.com',
            'password': 'StrongPass123!',
            'password_confirm': 'StrongPass123!',
            'role': 'FARMER',
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.json()['user']['is_verified'])
        self.assertEqual(get_user_model().objects.count(), 1)

    def test_verified_user_can_login_and_receive_tokens(self):
        user = get_user_model().objects.create_user(
            email='customer@example.com',
            password='StrongPass123!',
            role='CUSTOMER',
            is_verified=True,
        )

        url = reverse('authentication:login')
        response = self.client.post(
            url,
            {'email': 'customer@example.com', 'password': 'StrongPass123!'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())
        self.assertEqual(response.json()['user']['email'], user.email)

    def test_logout_blacklists_refresh_token(self):
        user = get_user_model().objects.create_user(
            email='admin@example.com',
            password='StrongPass123!',
            role='ADMIN',
            is_verified=True,
        )
        refresh = RefreshToken.for_user(user)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        response = self.client.post(
            reverse('authentication:logout'),
            {'refresh': str(refresh)},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=refresh['jti']).exists())
        self.assertTrue(OutstandingToken.objects.filter(jti=refresh['jti']).exists())
