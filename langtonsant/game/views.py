from django.shortcuts import render
from django.http import HttpResponse
from .game_logic import *


def index(request):
    game = Game()
    game.next_turn()
    game.next_turn()
    return HttpResponse(game)