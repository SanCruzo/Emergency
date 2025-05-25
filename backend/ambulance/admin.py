#registers the model so it appears in Django admin
from django.contrib import admin
from .models import Ambulance

admin.site.register(Ambulance)