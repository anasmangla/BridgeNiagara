from django.contrib import admin
from django.urls import path
from core import views as v

urlpatterns = [
    path('admin/', admin.site.urls),
    path('donate/', v.donate, name='donate'),
    path('create-checkout-session/', v.create_checkout_session, name='create_checkout_session'),
    path('success/', v.success, name='success'),
    path('cancel/', v.cancel, name='cancel'),
    path('stripe/webhook/', v.stripe_webhook, name='stripe_webhook'),
]
