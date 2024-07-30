import strawberry
import strawberry_django
from strawberry import auto
from typing import Optional

from . import models


@strawberry_django.type(models.User)
class UserType:
    id: auto
    username: str
    avatar: Optional[str]
    email: str
    gender: str
    is_staff: bool
    is_active: bool
    date_joined: str


@strawberry.type
class LoginResponse:
    success: bool
    token: str
