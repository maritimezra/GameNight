import strawberry_django
from strawberry import auto

from . import models


@strawberry_django.type(models.User)
class UserType:
    id: auto
    email: str
    is_staff: bool
    is_active: bool
    date_joined: str
