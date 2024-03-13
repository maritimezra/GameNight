import strawberry
from typing import List
from strawberry_django.optimizer import DjangoOptimizerExtension

# from strawberry_jwt_auth.extension import JWTExtension
# from strawberry_jwt_auth.decorator import login_required

from .models import User
from .types import UserType


@strawberry.type
class Query:

    @strawberry.field
    # @login_required
    def me(self, info) -> UserType:
        return info.context.request.user


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(
        self,
        email: str,
        password: str,
    ) -> UserType:
        user = User.objects.create(
            email=email,
            password=password,
        )
        return user


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
