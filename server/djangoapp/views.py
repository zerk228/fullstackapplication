"""
Views for the Cars Dealership Review Application's djangoapp.

Module 1 (Static Pages): about(), contact(), index()
Module 2 (User Management): login_user(), logout_user(), registration()
"""
import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)


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
