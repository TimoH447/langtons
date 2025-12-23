var size = 400
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
context.clearRect(0,0,size,size);

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

draw_grid(1,20);
