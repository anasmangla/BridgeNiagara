from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect


def index(request):
    return render(request, 'index.html')


def about(request):
    return render(request, 'about.html')


def programs(request):
    return render(request, 'programs.html')


def turkey_giveaway(request):
    return render(request, 'turkey-giveaway.html')


def donate(request):
    return render(request, 'donate.html')


def success(request):
    return render(request, 'success.html')


def cancel(request):
    return render(request, 'cancel.html')


def volunteer(request):
    return render(request, 'volunteer.html')


def contact(request):
    return render(request, 'contact.html')


def faq(request):
    return render(request, 'faq.html')


@csrf_protect
def create_checkout_session(request):
    return JsonResponse({'url': '#'})
