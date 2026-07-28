from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


def build_verification_link(user, request=None):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    path = reverse('authentication:verify-email', kwargs={'uidb64': uid, 'token': token})
    if request is not None:
        return request.build_absolute_uri(path)
    return path


def send_verification_email(user, request=None):
    link = build_verification_link(user, request)
    subject = 'Verify your CropX account'
    message = (
        f'Hello {user.email},\n\n'
        'Please verify your account by visiting the link below:\n'
        f'{link}\n\n'
        'Thank you,\nCropX Team'
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)


def send_password_reset_email(user, request=None):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = request.build_absolute_uri(
        f'/api/auth/reset-password/?uidb64={uid}&token={token}'
    ) if request is not None else f'/api/auth/reset-password/?uidb64={uid}&token={token}'

    subject = 'Reset your CropX password'
    message = (
        f'Hello {user.email},\n\n'
        'Use the link below to reset your password:\n'
        f'{reset_link}\n\n'
        'If you did not request this, you can safely ignore this email.'
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
