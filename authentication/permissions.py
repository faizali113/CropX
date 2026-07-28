from rest_framework.permissions import BasePermission


class IsVerifiedUser(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'is_active', False)
            and getattr(request.user, 'is_verified', False)
        )


class IsRole(BasePermission):
    allowed_roles = ()

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'is_active', False)
            and getattr(request.user, 'is_verified', False)
            and request.user.role in self.allowed_roles
        )


class IsFarmer(IsRole):
    allowed_roles = ('FARMER', 'ADMIN')


class IsCustomer(IsRole):
    allowed_roles = ('CUSTOMER', 'ADMIN')
