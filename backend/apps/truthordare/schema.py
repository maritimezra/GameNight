import strawberry
from typing import List
from strawberry_django.optimizer import DjangoOptimizerExtension

from .types import LobbyType, PlayerType
from .models import *


@strawberry.input
class LobbyInput:
    id: int
    creator: int


@strawberry.type
class Query:
    @strawberry.field
    def get_players(self, lobby: LobbyInput) -> List[PlayerType]:
        players = Player.objects.filter(lobby=lobby)
        return players


@strawberry.type
class Mutation:
    pass


schema = strawberry.Schema(
    query=Query,
    # mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
