from django.shortcuts import render
from django.http import HttpResponse
from .game_logic import *


def index(request):
    game = Game()
    if request.method == "POST":
        if "button1" in request.POST:
            game.next_turn()
        elif "button2" in request.POST:
            game.reset()
    context = {"board": str(game)}
    return render(request,"game_board.html",context)