import strawberry
from typing import List
from strawberry_django.optimizer import DjangoOptimizerExtension

from apps.accounts.types import UserType
from .types import LobbyType, PlayerType
from .models import *


@strawberry.type
class Query:
    @strawberry.field
    def get_creator(self, lobby_id: int) -> UserType:
        lobby = Lobby.objects.get(id=lobby_id)
        return lobby.creator

    @strawberry.field
    def get_lobbies(self) -> List[LobbyType]:
        return list(Lobby.objects.all())

    @strawberry.field
    def get_lobby(self, lobby_id: int) -> LobbyType:
        return Lobby.objects.get(id=lobby_id)

    @strawberry.field
    def get_players(self, lobby_id: int) -> List[PlayerType]:
        lobby = Lobby.objects.get(id=lobby_id)
        return list(lobby.player_set.all())

    @strawberry.field
    def create_lineup(self, lobby_id: int) -> List[str]:
        lobby = Lobby.objects.get(id=lobby_id)
        players = Player.objects.filter(lobby=lobby)
        player_names = [player.name for player in players]
        random.shuffle(player_names)
        return player_names


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_lobby(self, name: str, creator_id: int) -> LobbyType:
        creator = User.objects.get(id=creator_id)
        lobby = Lobby.objects.create(name=name, creator=creator)
        return lobby

    @strawberry.mutation
    def delete_lobby(self, lobby_id: int) -> str:
        try:
            lobby = Lobby.objects.get(id=lobby_id)
            lobby.delete()
            return f"Lobby with ID {lobby_id} deleted successfully."
        except Lobby.DoesNotExist:
            return f"Lobby with ID {lobby_id} does not exist."

    @strawberry.mutation
    def add_player(self, lobby_id: int, player_name: str) -> PlayerType:
        lobby = Lobby.objects.get(id=lobby_id)
        player = Player.objects.create(name=player_name, lobby=lobby)
        return player

    @strawberry.mutation
    def remove_player(self, lobby_id: int, player_name: str) -> str:
        lobby = Lobby.objects.get(id=lobby_id)
        player = Player.objects.filter(lobby=lobby, name=player_name).first()

        if player:
            player.delete()
            return f"Player {player_name} removed successfully from the lobby."
        else:
            return f"Player {player_name} not found in the lobby."


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
