from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView as BaseGraphQLView

from backend.apps.accounts import schema


class GraphQLView(BaseGraphQLView):
    def get_context(self, request: HttpRequest):
        return {"request": request}


graphql_view = csrf_exempt(GraphQLView.as_view(schema=schema))
