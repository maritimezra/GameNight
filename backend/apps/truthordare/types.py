import strawberry_django
from strawberry import auto

from . import models
from apps.accounts.types import UserType


@strawberry_django.type(models.Lobby)
class LobbyType:
    id: auto
    creator: UserType
    name: str
    created_at: str


@strawberry_django.type(models.Player)
class PlayerType:
    id: auto
    name: str
    lobby: LobbyType
