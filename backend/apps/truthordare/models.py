from django.db import models
import random
from apps.accounts.models import User


class GameOption(models.Model):
    pass


class Lobby(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def add_player(self, player_name):
        player = Player.objects.create(name=player_name, lobby=self)
        return player

    def remove_player(self, player_name):
        player = Player.objects.filter(name=player_name, lobby=self).first()
        if player:
            player.delete()
        else:
            raise Exception("Player not found in the lobby.")

    def create_lineup(self):
        players = Player.objects.filter(lobby=self)
        player_names = [player.name for player in players]
        random.shuffle(player_names)
        return player_names

    def get_players(self):
        return Player.objects.filter(lobby=self)


class Player(models.Model):
    name = models.CharField(max_length=100)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
