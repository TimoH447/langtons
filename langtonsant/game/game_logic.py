import json
from .models import GameState

class Cell:
    def __init__(self,color="white",ant = None):
        self.color = color
        self.nr = self.set_nr()
        self.has_ant = False
        self.ant_orientation = None
        if ant:
            self.has_ant = True
            self.ant_orientation = ant.ori.getAntPath()
    
    def set_ant(self,orientation):
        self.has_ant = True
        self.ant_orientation = orientation

    def set_nr(self):
        if self.color=="white":
            return 0
        elif self.color=="black":
            return 1

class Board:
    def __init__(self,pos,size):
        self.board_center_global = pos
        self.size = size
class Grid:
    def __init__(self,black_tiles={}):
        self.black_tiles = black_tiles

    def get_color(self,pos):
        pos_key = pos.getKey()
        if pos_key in self.black_tiles:
            return "black"
        else:
            return "white"

    def change_color(self,pos):
        pos_key = pos.getKey()
        if pos_key in self.black_tiles:
            del self.black_tiles[pos_key]
        else:
            self.black_tiles[pos_key]="black"
    def get_global_from_local(self,i,j,pos,size):
        global_pos = Position(pos.x-size+j,pos.y+size-i)
        return global_pos


    def get_grid_with_obj(self,pos,size,ant=None):
        grid = []
        for i in range(2*size+1):
            row = []
            for j in range(2*size + 1):
                global_position = self.get_global_from_local(i,j,pos,size)

                if self.get_color(global_position)=="black":
                    if ant:
                        if global_position==ant.pos:
                            row.append(Cell("black",ant))
                        else:
                            row.append(Cell("black"))
                    else:
                        row.append(Cell("black"))
                else:
                    if ant:
                        if global_position==ant.pos:
                            row.append(Cell("white",ant))
                        else:
                            row.append(Cell("white"))
                    else:
                        row.append(Cell("white"))
            grid.append(row)    
        return grid
    
    def get_grid(self,pos,size):
        grid = self.get_grid_with_obj(pos,size)
        grid = [[elem.nr for elem in row] for row in grid]
        return grid

class Orientation:
    def __init__(self,ori):
        self.ori = ori
        self.x = self.translate_orientation(ori)[0]
        self.y = self.translate_orientation(ori)[1]
    
    def getOrientationAbbr(self):
        if self.ori == "up":
            return "U"
        elif self.ori == "right":
            return "R"
        elif self.ori == "down":
            return "D"
        elif self.ori == "left":
            return "L"
    
    def getAntPath(self):
        if self.ori == "up":
            return "game/ant_up.png"
        elif self.ori == "right":
            return "game/ant_right.png"
        elif self.ori == "down":
            return "game/ant_down.png"
        elif self.ori == "left":
            return "game/ant_left.png"

    def orientation_to_num(self,ori):
        ori2num = {
            "up": 0,
            "right": 1,
            "down":2,
            "left": 3
        }
        return ori2num[ori]
    
    def num_to_ori(self,num):
        num2ori = {
            0: "up",
            1: "right",
            2: "down",
            3: "left"
        }
        return num2ori[num]

    def translate_orientation(self,ori):
        if ori == "up":
            return [0,1]
        elif ori == "down":
            return [0,-1]
        elif ori == "left":
            return [-1,0]
        elif ori == "right":
            return [1,0]
    
    def set_directions(self,ori):
        if ori == "up":
            self.x = 0
            self.y = 1
        elif ori == "down":
            self.x = 0
            self.y = -1
        elif ori == "left":
            self.x = -1
            self.y = 0
        elif ori == "right":
            self.x = 1
            self.y = 0

    def rotateClock(self):
        num  = self.orientation_to_num(self.ori)
        num += 1
        num = num % 4
        self.ori = self.num_to_ori(num)
        self.set_directions(self.ori)

    def rotateCounterClock(self):
        num  = self.orientation_to_num(self.ori)
        num -= 1
        num = num % 4
        self.ori = self.num_to_ori(num)
        self.set_directions(self.ori)

class Position:
    def __init__(self,x,y):
        self.x = x
        self.y = y
    def __eq__(self,other):
        if self.x == other.x:
            if self.y == other.y:
                return True
            else:
                return False
        else:
            return False

    def getKey(self):
        return f"x{self.x}y{self.y}"
    def get_position_on_board(self,board_center,size):
        global_x = self.x - (board_center.x - size)
        global_y = self.y - (board_center.y + size)
        return Position(global_x,global_y)
        

class Ant:
    def __init__(self,position,orientation):
        self.pos = position
        self.ori = orientation

    """
    if ant moves when standing on a black square it rotates 90 deg counterclockwise and moves one square forward
    if ant moves when standing on a white square it rotates 90 deg clcokwise and moves one square forward
    """
    def rotate(self,color):
        if color == "black":
            self.ori.rotateCounterClock()
        elif color == "white":
            self.ori.rotateClock()

    def move(self):
        self.pos.x += self.ori.x
        self.pos.y += self.ori.y

class Game:
    def __init__(self):
        games = GameState.objects.all()
        if games:
            gam = games[0]
            btiles = gam.grid
            btiles = btiles.replace('\'','\"')
            b_tiles = json.loads(btiles)
            self.grid = Grid(b_tiles)
            self.ant = Ant(Position(gam.ant_pos_x,gam.ant_pos_y),Orientation(gam.ant_orientation))
        else:
            self.grid = Grid()
            self.ant = Ant(Position(0,0),Orientation("up"))
    
    def save(self):
        games = GameState.objects.all()
        if games:
            gam = games[0]
            gam.grid = json.dumps(self.grid.black_tiles)
            gam.ant_orientation = self.ant.ori.ori
            gam.ant_pos_x = self.ant.pos.x
            gam.ant_pos_y = self.ant.pos.y
            gam.save()
        else:
            gam = GameState(grid=self.grid.black_tiles,ant_orientation = self.ant.ori,ant_pos_x=self.ant.pos.x,ant_pos_y=self.ant.pos.y)
            gam.save()
    
    def reset(self):
        self.grid = Grid()
        self.ant = Ant(Position(0,0),Orientation("up"))
        self.save()

    def next_turn(self):
        color = self.grid.get_color(self.ant.pos)
        #change tile color
        self.grid.change_color(self.ant.pos)

        #change orientation
        self.ant.rotate(color)
        #move
        self.ant.move()


    def get_board(self):
        grit = self.grid.get_grid_with_obj(self.ant.pos,6,self.ant)
        return grit

    def __str__(self):
        grit = self.get_board()
        board = ""
        for row in grit:
            for elem in row:
                board += " "+str(elem)
            board += "</br>"
        return board

