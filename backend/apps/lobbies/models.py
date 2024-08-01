from django.db import models
from apps.accounts.models import User
import random

from django.conf import settings


class Level(models.TextChoices):
    MILD = "ML"
    MODERATE = "MD"
    WILD = "WD"


class Category(models.TextChoices):
    Party = "P"
    Couples = "C"
    Teens = "T"
    Work = "W"


class Game(models.TextChoices):
    "Truth or Dare"
    "Superative"
    "DoorDrink"
    "Never Have I Ever"


class Player(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Lobby(models.Model):
    game = models.CharField(max_length=256, choices=Game)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    player = models.ManyToManyField(Player, related_name="lobbies", blank=True)
    name = models.CharField(max_length=256)
    level = models.CharField(max_length=2, choices=Level, blank=True)
    category = models.CharField(max_length=1, choices=Category, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
