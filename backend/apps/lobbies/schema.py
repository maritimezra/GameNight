import strawberry, jwt
from typing import List, Optional
from strawberry_django.optimizer import DjangoOptimizerExtension
from strawberry.types import Info

from apps.accounts.types import UserType
from .types import LobbyType, PlayerType
from .models import *

from django.conf import settings


@strawberry.type
class Query:
    @strawberry.field
    def get_creator(self, info: Info, lobby_id: int) -> UserType:
        lobby = Lobby.objects.get(id=lobby_id)
        creator = lobby.creator
        return UserType(
            id=creator.id,
            username=creator.username,
            email=creator.email,
            avatar=creator.avatar,
            gender=creator.gender,
            is_staff=creator.is_staff,
            is_active=creator.is_active,
            date_joined=creator.date_joined,
        )

    @strawberry.field
    def get_lobbies(self, info) -> List[LobbyType]:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)
            lobbies = Lobby.objects.filter(creator=user)
            return list(lobbies)
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired. Please log in again.")
        except jwt.exceptions.DecodeError:
            raise Exception("Invalid token. Please log in again.")

    @strawberry.field
    def get_lobby(self, lobby_id: int) -> LobbyType:
        return Lobby.objects.get(id=lobby_id)

    @strawberry.field
    def get_lobbyid(self, player_id: int) -> int:
        player = Player.objects.get(id=player_id)
        lobby = Lobby.objects.filter(
            player=player
        ).first()  # Assuming a player can belong to only one lobby
        return lobby.id if lobby else None

    @strawberry.field
    def get_players(self, lobby_id: int) -> List[PlayerType]:
        lobby = Lobby.objects.get(id=lobby_id)
        return list(lobby.player.all())

    @strawberry.field
    def get_lineup(self, lobby_id: int) -> List[str]:
        lobby = Lobby.objects.get(id=lobby_id)
        players = lobby.player.all()
        creator = lobby.creator.username
        player_names = [player.name for player in players]
        player_names.append(creator)
        random.shuffle(player_names)
        return player_names


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_lobby(
        self,
        info,
        name: str,
        level: str,
        category: str,
    ) -> LobbyType:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)
        except (jwt.DecodeError, User.DoesNotExist):
            raise Exception("Authentication required to create a lobby.")

        lobby = Lobby.objects.create(
            name=name,
            creator=user,
            level=level,
            category=category,
        )
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
        player = Player.objects.create(name=player_name)
        lobby.player.add(player)
        return player

    @strawberry.mutation
    def remove_player(self, lobby_id: int, player_id: int) -> str:
        lobby = Lobby.objects.get(id=lobby_id)
        player = lobby.player.get(id=player_id)
        lobby.player.remove(player)
        player.delete()
        return f"Player with ID {player_id} removed successfully."

    @strawberry.mutation
    def edit_player(self, player_id: int, new_name: str) -> Optional[PlayerType]:
        player = Player.objects.get(id=player_id)
        player.name = new_name
        player.save()
        return player

    # todo: add delete/edit lobby mutations


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
