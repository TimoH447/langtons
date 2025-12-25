var line_width = 1;
var cell_width = 20;
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var canvas_width = canvas.width;
var canvas_height = canvas.height;
context.clearRect(0,0,canvas_width,canvas_height);

var grid_state = [];
var ant_state = {
    "position": [0,0],
    "orientation": "north"
};
draw_grid(line_width, cell_width);

document.getElementById("update_state_btn").addEventListener("click", () => {
    console.log("Event button");
    grid_state = update_state(grid_state,ant_state);
    update_canvas(grid_state);

  });




function draw_grid(line_width, cell_width) {
    let cell_height = cell_width;
    context.strokeStyle = "black";
    context.lineWidth = line_width;
    let width = canvas.width;
    let height = canvas.height;

    // draw vertical lines
    for (let x=0; x<=width; x+= cell_width) {
        context.beginPath();
        context.moveTo(x,0);
        context.lineTo(x,height);
        context.stroke();
    }

    // draw horizontal lines
    for (let x=0; x<= height; x+= cell_height) {
        context.beginPath();
        context.moveTo(0,x);
        context.lineTo(width,x);
        context.stroke();
    }

}

function draw_matrix(line_width, cell_width, canvas_width, canvas_height, matrix) {
    var x = 0;
    var y = 0;
    for (let i=0; i<matrix.length; i++) {
        var row = matrix[i];
        y += cell_width;
        for (let j=0; j<row.length; j++) {
            x+=cell_width;
            if (row[j]==1) {
                context.fillStyle = "black";
                context.fillRect(x,y,cell_width,cell_width);
            }
        }
        x = 0;
   }
}

function is_in_grid(grid_state, position) {
    for (let i=0; i<grid_state.length; i++) {
    let grid_tile = grid_state[i];
        if (grid_tile[0] == position[0] && grid_tile[1]== position[1]) {
            return true;
        }
    }
    return false;
}

function move(player_state) {
    let ori = player_state["orientation"];
    let px = player_state["position"][0];
    let py = player_state["position"][1];
    if (ori == "north") {
        return [px,py-1];
    }
    else if (ori == "south") {
        return [px,py +1];
    }
    else if (ori == "east") {
        return [px +1 , py];
    }
    else if (ori == "west") {
        return [px -1, py];
    }
}

function rotate(ori, color) {
    if (ori=="north") {
        if (color == 1) {
            return "west";
        }
        else {
            return "east";
        }
    }
    else if (ori=="south") {
        if (color == 1) {
            return "east";
        }
        else {
            return "west";
        }
    }
    else if (ori == "east") {
        if (color == 1) {
            return "north";
        }
        else {
            return "south";
        }
    }
    else if (ori == "west") {
        if (color == 1) {
            return "south";
        }
        else {
            return "north";
        }
    }
}

function update_player_state(player_state, color) {
    player_state["orientation"] = rotate(player_state["orientation"], color);
    player_state["position"] = move(player_state);
}

function update_state(grid_state, player_state) {
    let player_pos_x = player_state["position"][0];
    let player_pos_y = player_state["position"][1];
    let player_orientation = player_state["orientation"];

    if (is_in_grid(grid_state, player_state["position"])) {
        grid_state = grid_state.filter(
          ([x, y]) => !(x === player_pos_x && y === player_pos_y)
        );
        update_player_state(player_state, 1);
        }
    else {
        grid_state.push(player_state["position"]);
        update_player_state(player_state, 0);
        }
    return grid_state;
    }

function get_grid_matrix(upper_left_corner_position, matrix_size , grid_state) {
    // create all 0 matrix
    let matrix = new Array(matrix_size[0]).fill().map(()=> new Array(matrix_size[1]).fill(0));
    
    // loop through tiles in grid and check wether it is in the matrix
    for (let i=0; i<grid_state.length; i++) {
    let grid_tile = grid_state[i];
    if (
        (grid_tile[0] >= upper_left_corner_position[0] && grid_tile[0]< upper_left_corner_position[0]+matrix_size[1]) && 
        (grid_tile[1] >= upper_left_corner_position[1] && grid_tile[1] < upper_left_corner_position[1]+matrix_size[0]))
        {
        matrix[grid_tile[1] - upper_left_corner_position[1]][grid_tile[0]-upper_left_corner_position[0]] =  1;
    }
    }
    return matrix;
    }

function update_canvas(grid_state) {
    console.log("End state");
    console.log(grid_state);
    context.clearRect(0,0,canvas_width,canvas_height);
    draw_grid(line_width, cell_width);
    draw_matrix(1,20,200,200, get_grid_matrix([-5,-5],[10,10],grid_state));
}
