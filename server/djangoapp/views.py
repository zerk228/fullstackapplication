"""
Views for the Cars Dealership Review Application's djangoapp.

Module 1 (Static Pages): about(), contact(), index()
Module 2 (User Management): login_user(), logout_user(), registration()
Module 3 (Car Catalog / Sentiment Proxy): get_cars(), analyze_review_sentiment()
"""
import json
import logging

import requests
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel

logger = logging.getLogger(__name__)

NODE_API_BASE_URL = getattr(settings, 'NODE_API_BASE_URL', 'http://localhost:3000')


# ---------------------------------------------------------------------------
# Module 1: Static Pages
# ---------------------------------------------------------------------------

def index(request):
    """Simple landing page served directly by the Django template engine."""
    return render(request, 'djangoapp/index.html')


def about(request):
    """Renders the static About Us page."""
    return render(request, 'djangoapp/about.html')


def contact(request):
    """Renders the static Contact Us page."""
    return render(request, 'djangoapp/contact.html')


# ---------------------------------------------------------------------------
# Module 2: User Management (JSON API consumed by the React frontend)
# ---------------------------------------------------------------------------

@csrf_exempt
def login_user(request):
    """POST /djangoapp/login  { "userName": "...", "password": "..." }"""
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)

    response_data = {"userName": username}
    if user is not None:
        login(request, user)
        response_data["status"] = "Authenticated"
    else:
        response_data["status"] = "Failed"
    return JsonResponse(response_data)


@csrf_exempt
def logout_user(request):
    """GET or POST /djangoapp/logout"""
    username = request.user.username if request.user.is_authenticated else ""
    logout(request)
    return JsonResponse({"userName": username, "status": "Logged out"})


@csrf_exempt
def registration(request):
    """POST /djangoapp/register
    { "userName", "password", "firstName", "lastName", "email" }
    """
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    email = data.get('email', '')

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})


def check_session(request):
    """GET /djangoapp/check_session - lets the React frontend know
    whether the current browser session is already logged in."""
    if request.user.is_authenticated:
        return JsonResponse({"userName": request.user.username, "status": "Authenticated"})
    return JsonResponse({"status": "Unauthenticated"})


# ---------------------------------------------------------------------------
# Module 3: Car Catalog and Sentiment Proxy
# ---------------------------------------------------------------------------

def get_cars(request):
    """GET /djangoapp/get_cars - all car makes and their models,
    managed through the Django admin (CarMake/CarModel)."""
    car_models = CarModel.objects.select_related('car_make').all()
    cars = [
        {"CarMake": cm.car_make.name, "CarModel": cm.name, "type": cm.type}
        for cm in car_models
    ]
    return JsonResponse({"CarModels": cars})


def analyze_review_sentiment(request, text):
    """GET /djangoapp/analyze/<text> - proxies to the Node.js
    sentiment-analysis microservice and returns its result."""
    try:
        resp = requests.get(f'{NODE_API_BASE_URL}/analyze/{text}', timeout=5)
        return JsonResponse(resp.json(), status=resp.status_code)
    except requests.RequestException as exc:
        return JsonResponse({"error": str(exc)}, status=502)
