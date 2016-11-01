

function open_bitmap() {

  d3.selectAll("circle").remove();
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
  console.log(obstacle_bitlist);

  //=========================birmap init========================================
  for(var i = 0; i < obstacle_bitlist.length; i++){

    for(var j = 0; j < obstacle_bitlist[i].length; j++){

      var y_list = [];
      var maxX = null, minX = null;
      for(var k = 0; k < obstacle_bitlist[i][j].length; k++){

        if(k == obstacle_bitlist[i][j].length - 1){
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][0].x, obstacle_bitlist[i][j][0].y);
        }
        else{
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][k + 1].x, obstacle_bitlist[i][j][k + 1].y);
        }

        if(maxX == null){
          maxX = obstacle_bitlist[i][j][k].x;
          minX = obstacle_bitlist[i][j][k].x;

        }

        if(obstacle_bitlist[i][j][k].x > maxX){
          maxX = obstacle_bitlist[i][j][k].x;
        }
        else if(obstacle_bitlist[i][j][k].x < minX){
          minX = obstacle_bitlist[i][j][k].x;
        }

      }

      maxX = Math.floor(maxX);
      minX = Math.floor(minX);

      var scan = [];
      for(var q = minX; q <= maxX; q++){
        scan = [];
        for(var w = 0; w < y_list.length; w++){
          if(y_list[w][0] == q){
            scan.push(y_list[w][1]);
          }
        }
        var y0 = Math.min(...scan), y1 = Math.max(...scan);
        drewline(q, y0, q, y1, black);
      }
    }
  }
  //=============================NF1 Algorithm===================================
  var L = [], i = 0;
  L[0] = (robotgoal);
  //console.log(L[0]);
  //L[1] = [];
  //console.log(L[1].length);
  while(L[i].length != 0){
  //while(i < 10){
    var temp = [];
    //console.log(L[i]);
    L[i].forEach(function(point){
      //console.log(point);
      for(var x = -1; x <= 1 ; x++){
        for(var y = -1; y<= 1 ; y++){
          var posX = point[0] + x, posY = point[1] + y;
          if(posX > -1 && posY > -1 && posX < n && posY < n){
            if(bitmatrix[posX][posY] == 254){
              bitmatrix[posX][posY] = i + 1;
              temp.push([posX, posY]);
            }
          }
        }
      }
    })
    L[i + 1] = temp;
    i++;
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
        .style("fill", 'red');
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
        .style("fill", 'black');
      }
      else if(bitmatrix[i][j] < 254){
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
        .style("fill", 'rgb('+ (255 - bitmatrix[i][j] * 2)+', ' + (255 - bitmatrix[i][j] * 2) +', '+ (255 - bitmatrix[i][j] * 2) +')');
      }
    }
  }


  function scanline(x0, y0, x1, y1){
    var d, dx, dy;
    d = (Math.max(Math.abs(x1-x0), Math.abs(y1-y0)));
    dy = (y1 - y0) / d;
    dx = (x1 - x0) / d;

    for(var i = 0; i <= d ; i++){
      y_list.push([Math.floor(x0+i*dx), Math.floor(y0+i*dy)]);
      //bitmatrix[Math.round(x0+i*dx)][Math.round(y0+i*dy)] = black;
    }
  }

  function drewline(x0, y0, x1, y1, color){
    for(var i = y0; i <= y1 ; i++){
      //y_list.push([Math.floor(x0+i*dx), Math.floor(y0+i*dy)]);
      bitmatrix[x0][i] = color;
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
