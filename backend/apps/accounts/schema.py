import jwt
import strawberry
from typing import List, Optional
from strawberry_django.optimizer import DjangoOptimizerExtension
from django.contrib.auth import authenticate
from django.conf import settings


from strawberry_jwt_auth.extension import JWTExtension

from strawberry_jwt_auth.decorator import login_required

from .models import User
from .types import LoginResponse, UserType

from django.conf import settings
from strawberry.types import Info
from django.contrib.auth import logout as auth_logout


@strawberry.type
class Query:

    @strawberry.field
    def get_users(self, info) -> List[UserType]:
        return User.objects.all()

    @strawberry.field
    def me(self, info) -> UserType:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)

            user_instance = UserType(
                id=user.id,
                username=user.username,
                email=user.email,
                avatar=user.avatar,
                gender=user.gender,
                is_staff=user.is_staff,
                is_active=user.is_active,
                date_joined=str(user.date_joined),
            )

            return user_instance
        except (jwt.DecodeError, User.DoesNotExist):
            raise Exception("User is not logged in")

    @strawberry.field
    def get_username(self, info) -> UserType:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)
            return UserType(
                id=user.id,
                username=user.username,
                avatar=user.avatar,
                email=user.email,
                is_staff=user.is_staff,
                is_active=user.is_active,
                gender=user.gender,
                date_joined=user.date_joined,
            )
        except jwt.ExpiredSignatureError:
            print("JWT token has expired")
        except jwt.InvalidTokenError:
            print("Invalid JWT token")

        return None


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(
        email: str,
        password: str,
        username: str,
        gender: str,
    ) -> UserType:
        user = User.objects.create_user(
            email=email,
            password=password,
            username=username,
            gender=gender,
        )
        return user

    @strawberry.mutation
    def login(self, info, email: str, password: str) -> LoginResponse:
        user = authenticate(email=email, password=password)

        if user is not None and user.is_authenticated:
            print(f"Authenticated user: {user.email}")
            setattr(info.context.request, "user", user)

            token_payload = {
                "user_id": user.id,
                "email": user.email,
            }
            token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm="HS256")

            return LoginResponse(success=True, token=token)
        else:
            print("Authentication failed")
            return LoginResponse(success=False, token=None)

    @strawberry.mutation
    def logout(self, info) -> str:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)
            user.token = None
            user.save()
            return "Logged out successfully."
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired. Please log in again.")
        except jwt.exceptions.DecodeError:
            raise Exception("Invalid token. Please log in again.")
        except User.DoesNotExist:
            raise Exception("User not found.")

    @strawberry.mutation
    @login_required
    def change_password(self, info, old_password: str, new_password: str) -> bool:
        user = info.context.request.user
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return True
        else:
            return False


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
        JWTExtension,
    ],
)
