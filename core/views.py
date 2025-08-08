import os, stripe, json
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Donation

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

def donate(request):
    return render(request, 'donate.html', {'stripe_pk': os.getenv('STRIPE_PUBLISHABLE_KEY')})

@csrf_exempt
def create_checkout_session(request):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST only')
    data = json.loads(request.body.decode('utf-8'))
    amount_cents = int(data.get('amount_cents', 0))
    name, email, phone = data.get('name', ''), data.get('email', ''), data.get('phone', '')
    don = Donation.objects.create(amount_cents=amount_cents, name=name, email=email, phone=phone)
    session = stripe.checkout.Session.create(
        mode='payment',
        payment_method_types=['card'],
        line_items=[{'price_data': {'currency': 'usd', 'unit_amount': amount_cents, 'product_data': {'name': 'Donation'}}, 'quantity': 1}],
        success_url=os.getenv('DONATION_SUCCESS_URL') + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url=os.getenv('DONATION_CANCEL_URL'),
        metadata={'donation_id': str(don.id)},
        customer_email=email or None,
    )
    don.stripe_session_id = session.id
    don.save(update_fields=['stripe_session_id'])
    return JsonResponse({'url': session.url})

def success(request):
    return render(request, 'success.html')

def cancel(request):
    return render(request, 'cancel.html')

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET'))
    except Exception:
        return HttpResponse(status=400)
    if event['type'] == 'checkout.session.completed':
        sid = event['data']['object'].get('id')
        Donation.objects.filter(stripe_session_id=sid).update(status='paid')
    return HttpResponse(status=200)
