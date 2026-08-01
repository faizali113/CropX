from rest_framework.permissions import BasePermission


class IsFarmer(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('FARMER', 'ADMIN')
        )


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, 'owner', None) or getattr(obj, 'farmer', None) or getattr(obj, 'user', None)
        return owner == request.user or request.user.role == 'ADMIN'
