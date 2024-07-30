from django.contrib import admin
from django.urls import path
from strawberry.django.views import GraphQLView
from strawberry_jwt_auth.views import strawberry_auth_view

from api.schema import schema

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", strawberry_auth_view(GraphQLView.as_view(schema=schema))),
]
