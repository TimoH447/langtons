var line_width = 1;
var cell_width = 20;
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var canvas_width = canvas.width;
var canvas_height = canvas.height;
context.clearRect(0,0,canvas_width,canvas_height);


let step = 0;
var grid_state = [];
var ant_state = {
    "position": [0,0],
    "orientation": "north"
};
update_canvas(grid_state, ant_state);


document.getElementById("update_state_btn").addEventListener("click", () => {
draw_grid(line_width, cell_width);
    grid_state = update_state(grid_state,ant_state);
    update_canvas(grid_state,ant_state);
    document.getElementById("step_count").innerHTML = `Step ${step}`;

  });

document.getElementById("reset_state_btn").addEventListener("click", () => {
    grid_state = [];
    ant_state["position"][0]=0;
    ant_state["position"][1]=0;
    ant_state["orientation"] = "north";
    step = 0;
    update_canvas(grid_state,ant_state);
    document.getElementById("step_count").innerHTML = `Step ${step}`;
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
        for (let j=0; j<row.length; j++) {
            if (row[j]==1) {
                context.fillStyle = "black";
                context.fillRect(x,y,cell_width,cell_width);
            }
            x+=cell_width;
        }
        y += cell_width;
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
    step += 1;

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
    if (is_on_canvas(grid_tile, upper_left_corner_position,matrix_size))
        {
            matrix_ind = get_canvas_position(grid_tile, upper_left_corner_position);
        matrix[matrix_ind[1]][matrix_ind[0]] =  1;
    }
    }
    return matrix;
    }

function is_on_canvas(pos,canv_upleft, matrix_size){
    if (
        (pos[0] >= canv_upleft[0] && pos[0]< canv_upleft[0]+matrix_size[1]) && 
        (pos[1] >= canv_upleft[1] && pos[1] < canv_upleft[1]+matrix_size[0])) 
    {
        return true;
    }
    return false;
}

function get_canvas_position(pos, canvas_upleft) {
    return [pos[0]-canvas_upleft[0],pos[1]-canvas_upleft[1]];
}

function get_orientation_triangle_points(pos, orientation, cell_width) {
    let left_x = pos[0]*cell_width;
    let right_x = pos[0]*cell_width+cell_width;
    let up_y = pos[1] * cell_width;
    let bot_y = pos[1] * cell_width +cell_width;
    let ul_coord = [pos[0]*cell_width, pos[1]*cell_width];
    let ur_coord = [pos[0]*cell_width+cell_width, pos[1]*cell_width];
    let br_coord = [pos[0]*cell_width+cell_width, pos[1]*cell_width+cell_width];
    let bl_coord = [pos[0]*cell_width, pos[1]*cell_width+cell_width];
    
    if (orientation=="north") {
        return [br_coord,bl_coord,[pos[0]*cell_width + Math.floor(cell_width/2),pos[1]*cell_width]];
    }
    else if (orientation == "south") {
        return [ur_coord,ul_coord,[pos[0]*cell_width + Math.floor(cell_width/2),pos[1]*cell_width+ cell_width]];
    }
    else if (orientation == "east") {
        return [ul_coord, bl_coord, [right_x, Math.floor((up_y +bot_y)/2)]];
    }
    else if (orientation == "west") {
        return [ur_coord, br_coord, [left_x, Math.floor((up_y+bot_y)/2)]];
    }
}

function draw_ant(ant_state, canvas_upperleft, matrix_size, cell_width) {
    if (is_on_canvas(ant_state["position"],canvas_upperleft, matrix_size)) {
        canvas_pos  = get_canvas_position(ant_state["position"],canvas_upperleft, cell_width);
        context.strokeStyle = "red";
        ori_triangle_points = get_orientation_triangle_points(canvas_pos, ant_state["orientation"],cell_width);
        context.moveTo(ori_triangle_points[2][0],ori_triangle_points[2][1]);
        for (let i=0; i<3;i++) {
            context.lineTo(ori_triangle_points[i][0],ori_triangle_points[i][1]);
        }
        context.stroke();
    }
}

function update_canvas(grid_state,ant_state) {
    context.clearRect(0,0,canvas_width,canvas_height);
    draw_grid(line_width, cell_width);
    let matrix = get_grid_matrix([-4,-4],[10,10],grid_state);
    draw_matrix(1,20,200,200, matrix);
    draw_ant(ant_state,[-4,-4],[10,10],cell_width);
}

