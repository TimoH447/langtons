from django.shortcuts import render
from django.http import HttpResponse
from .game_logic import *

def index(request):
    game = Game()
    if request.method == "POST":
        if "button1" in request.POST:
            for i in range(1):
                game.next_turn()
        elif "button2" in request.POST:
            game.reset()
    game.save()
    context = {
        "boardlist": game.get_board(),
        "board": str(game),
        "ant": game.ant}
    return render(request,"game_board.html",context)