from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .utils import send_password_reset_email, send_verification_email


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'is_verified', 'is_active', 'created_at', 'updated_at', 'last_login')
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'password_confirm', 'role')

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        email = attrs.get('email')

        if password != password_confirm:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'A user with that email already exists.'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        user.is_verified = True
        user.save(update_fields=['is_verified'])
        send_verification_email(user, self.context.get('request'))
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not user:
            raise serializers.ValidationError({'detail': 'Invalid email or password.'})

        if not user.is_active:
            raise serializers.ValidationError({'detail': 'This account is inactive.'})

        if not user.is_verified:
            raise serializers.ValidationError({'detail': 'Please verify your email before logging in.'})

        refresh = RefreshToken.for_user(user)
        attrs['user'] = user
        attrs['refresh'] = str(refresh)
        attrs['access'] = str(refresh.access_token)
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        email = self.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()
        if user:
            send_password_reset_email(user, self.context.get('request'))
        return user


class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=False, allow_blank=True)
    token = serializers.CharField(required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        uidb64 = attrs.get('uidb64') or self.context.get('uidb64')
        token = attrs.get('token') or self.context.get('token')
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')

        if not uidb64 or not token:
            raise serializers.ValidationError({'detail': 'Invalid reset link.'})

        if new_password != new_password_confirm:
            raise serializers.ValidationError({'new_password_confirm': 'Passwords do not match.'})

        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({'detail': 'Invalid reset link.'})

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({'detail': 'This reset link is invalid or has expired.'})

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
