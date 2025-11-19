from django.urls import path
from analysis.views import realestate_data

urlpatterns = [
    path('realestate/', realestate_data),
]
