from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'is_verified', 'is_active', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('role', 'is_verified', 'is_active')
    readonly_fields = ('created_at', 'updated_at', 'last_login')
