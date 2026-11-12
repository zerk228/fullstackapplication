from django.db import models

# Dealer and Review data live in the Node.js/MongoDB microservice
# (see /database). This Django app is only responsible for static
# pages and user authentication, so it relies solely on Django's
# built-in auth.User model and needs no extra models of its own.
