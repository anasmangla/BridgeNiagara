from django.contrib import admin
from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'amount_cents', 'name', 'email', 'status')
    search_fields = ('name', 'email', 'phone', 'stripe_session_id')
    list_filter = ('status', 'created_at')
