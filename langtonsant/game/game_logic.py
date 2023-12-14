class Board:
    def __init__(self,pos,size):
        self.board_center_global = pos
        self.size = size
class Grid:
    def __init__(self):
        self.black_tiles = {}

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

    def get_grid(self,pos,size):
        grid = []
        for i in range(2*size+1):
            row = []
            for j in range(2*size + 1):
                global_position = self.get_global_from_local(i,j,pos,size)
                if self.get_color(global_position)=="black":
                    row.append(1)
                else:
                    row.append(0)
            grid.append(row)    
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
    def getKey(self):
        return f"x{self.x}y{self.y}"

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
        self.grid = Grid()
        self.ant = Ant(Position(0,0),Orientation("up"))

    def next_turn(self):
        color = self.grid.get_color(self.ant.pos)
        #change tile color
        self.grid.change_color(self.ant.pos)

        #change orientation
        self.ant.rotate(color)
        #move
        self.ant.move()

    def get_board(self):
        grit = self.grid.get_grid(Position(0,0),5)
        return grit

    def __str__(self):
        grit = self.get_board()
        board = ""
        for row in grit:
            for elem in row:
                board += " "+str(elem)
            board += "</br>"
        return board

