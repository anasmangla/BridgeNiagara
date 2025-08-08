from django.urls import path
from core import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('programs/', views.programs, name='programs'),
    path('turkey-giveaway/', views.turkey_giveaway, name='turkey_giveaway'),
    path('donate/', views.donate, name='donate'),
    path('success/', views.success, name='success'),
    path('cancel/', views.cancel, name='cancel'),
    path('volunteer/', views.volunteer, name='volunteer'),
    path('contact/', views.contact, name='contact'),
    path('faq/', views.faq, name='faq'),
    path('create-checkout-session/', views.create_checkout_session, name='create_checkout_session'),
]
