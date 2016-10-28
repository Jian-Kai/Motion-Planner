

function open_bitmap() {
  var n = 129,
    white = 254,
    black = 255,
    goal = 0;
  //====================================set bitmatrix================================
  var robotgoal = [];

  for(var i = 0; i < robot.length; i++){
      //console.log([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])]);
      robotgoal.push( [parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])] );
  }

  console.log(robotgoal);

  var bitmatrix = [];

  for(var i = 0; i < n; i++){
    bitmatrix[i] = [];
    for(var j = 0; j < n; j++){
      bitmatrix[i][j] = white;
    }
  }

  for(var i = 0; i < robotgoal.length; i++){
    bitmatrix[robotgoal[i][0]][robotgoal[i][1]] = goal;
  }
  var obstacle_bitlist = obstacle2bitmap(obstacle);
  console.log(obstacle_bitlist[0][0]);
  for(var i = 0; i < obstacle_bitlist.length; i++){
    for(var j = 0; j < obstacle_bitlist[i].length; j++){
      for(var k = 0; k < obstacle_bitlist[i][j].length; k++){
        if(k == obstacle_bitlist[i][j].length - 1){
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][0].x, obstacle_bitlist[i][j][0].y, black);
        }
        else{
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][k + 1].x, obstacle_bitlist[i][j][k + 1].y, black);
        }
      }
    }
  }

  //=====================================draw bitmap==================================
  var bitmap = d3.select("#bitmap")
    .attr("width", n)
    .attr("height", n)
    .attr("transform", 'translate(100, -20)');

  var dot = bitmap.selectAll("circle");

  for(var i = 0; i < bitmatrix.length; i++){
    for(var j = 0; j < bitmatrix[i].length; j++){
      if(bitmatrix[i][j] == 0){
        var bit = [i, j];
        console.log(bit);
        dot.data([bit])
        .enter()
        .append("circle")
        .attr("cx", function(d){
          return d[0];
        })
        .attr("cy", function(d){
          return d[1];
        })
        .attr("r", 1)
        .style("fill", 'red')
      }
      else if(bitmatrix[i][j] == 255){
        var bit = [i, j];
        //console.log(bit);
        dot.data([bit])
        .enter()
        .append("circle")
        .attr("cx", function(d){
          return d[0];
        })
        .attr("cy", function(d){
          return d[1];
        })
        .attr("r", 1)
        .style("fill", 'black')
      }
    }
  }

  function scanline(x0, y0, x1, y1, color){
    var d, dx, dy;
    d = (Math.max(Math.abs(x1-x0), Math.abs(y1-y0)));
    dy = (y1 - y0) / d;
    dx = (x1 - x0) / d;

    for(var i = 0; i <= d ; i++){
      bitmatrix[Math.floor(x0+i*dx)][Math.floor(y0+i*dy)] = color;
    }
  }


}

function obstacle2bitmap(obstacle) {
  var obstacle_points = [];
  for (var k = 0; k < obstacle.length; k++) {
    var point = [];
    var theta = (parseFloat(obstacle[k].initaial[2])) * (Math.PI / 180);
    var init = [parseFloat(obstacle[k].initaial[0]), parseFloat(obstacle[k].initaial[1])];
    var polygons = obstacle[k].polygon;
    for (var i = 0; i < polygons.length; i++) {
      var temp = [];
      for (var j = 0; j < polygons[i].length; j++) {
        //console.log(parseFloat(polygons[i][j][0]));
        //console.log(parseFloat(polygons[i][j][1]));
        var x = Math.cos(theta) * (polygons[i][j][0]) - Math.sin(theta) * (polygons[i][j][1]) + init[0];
        var y = Math.sin(theta) * (polygons[i][j][0]) + Math.cos(theta) * (polygons[i][j][1]) + init[1];
        temp.push({'x':x, 'y':y});
      }
      point.push(temp);
    }
    obstacle_points.push(point);
  }
  return obstacle_points;
}
