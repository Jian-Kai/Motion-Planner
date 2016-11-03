function open_bitmap() {

  d3.selectAll("rect").remove();
  var n = 128,
    white = 254,
    black = 255,
    goal = 0;
  //====================================set bitmatrix================================
  var robotgoal = [],
    robotcontrolpoint = [],
    robotinit = [];
  //=======================set inti for bit map===============================
  for (var i = 0; i < robot.length; i++) {
    //console.log([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])]);
    robotgoal.push([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])]);
    robotinit.push([parseFloat(robot[i].initaial[0]), parseFloat(robot[i].initaial[1])]);
    var temp = [];
    for (var j = 0; j < robot[i].controlpoint.length; j++) {
      temp.push([parseFloat(robot[i].controlpoint[j][0]) + parseFloat(robot[i].goal[0]), parseFloat(robot[i].controlpoint[j][1]) + parseFloat(robot[i].goal[1])]);
    }
    robotcontrolpoint.push(temp);
  }

  console.log("robotgoal:" + robotgoal);
  console.log("robotinit:" + robotinit);
  console.log("robotcontrolpoint:" + robotcontrolpoint);

  var bitmatrix = [];

  for (var i = 0; i < n; i++) {
    bitmatrix[i] = [];
    for (var j = 0; j < n; j++) {
      bitmatrix[i][j] = white;
    }
  }
  //=========================================================
  bitmatrix[robotgoal[0][0]][robotgoal[0][1]] = goal;


  var obstacle_bitlist = obstacle2bitmap(obstacle);
  console.log(obstacle_bitlist);

  //=========================birmap init========================================
  for (var i = 0; i < obstacle_bitlist.length; i++) {

    for (var j = 0; j < obstacle_bitlist[i].length; j++) {

      var y_list = [];
      var maxX = null,
        minX = null,
        maxY = null,
        minY = null;
      for (var k = 0; k < obstacle_bitlist[i][j].length; k++) {

        if (k == obstacle_bitlist[i][j].length - 1) {
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][0].x, obstacle_bitlist[i][j][0].y);
        } else {
          scanline(obstacle_bitlist[i][j][k].x, obstacle_bitlist[i][j][k].y, obstacle_bitlist[i][j][k + 1].x, obstacle_bitlist[i][j][k + 1].y);
        }

        if (maxX == null) {
          maxX = obstacle_bitlist[i][j][k].x;
          minX = obstacle_bitlist[i][j][k].x;

          maxY = obstacle_bitlist[i][j][k].y;
          minY = obstacle_bitlist[i][j][k].y;

        }

        if (obstacle_bitlist[i][j][k].x > maxX) {
          maxX = obstacle_bitlist[i][j][k].x;
        } else if (obstacle_bitlist[i][j][k].x < minX) {
          minX = obstacle_bitlist[i][j][k].x;
        }

        if (obstacle_bitlist[i][j][k].y > maxY) {
          maxY = obstacle_bitlist[i][j][k].y;
        } else if (obstacle_bitlist[i][j][k].y < minY) {
          minY = obstacle_bitlist[i][j][k].y;
        }

      }

      maxX = Math.floor(maxX);
      minX = Math.floor(minX);

      maxY = Math.floor(maxY);
      minY = Math.floor(minY);

      var scan = [];
      for (var q = minX; q <= maxX; q++) {
        scan = [];
        for (var w = 0; w < y_list.length; w++) {
          if (y_list[w][0] == q) {
            scan.push(y_list[w][1]);
          }
        }
        var y0 = Math.min(...scan),
          y1 = Math.max(...scan);
        drewlineY(q, y0, q, y1, black);
      }

      for (var q = minY; q <= maxY; q++) {
        scan = [];
        for (var w = 0; w < y_list.length; w++) {
          if (y_list[w][0] == q) {
            scan.push(y_list[1][w]);
          }
        }
        var x0 = Math.min(...scan),
          x1 = Math.max(...scan);
        drewlineX(x0, q, x1, q, black);
      }
    }
  }
  //=============================NF1 Algorithm===================================
  var L = [],
    count = 0;

  L[0] = [robotgoal[0]];
  //L[0] = robotgoal;

  while (L[count].length != 0) {
    var temp = [];
    //console.log(L[count].length);
    for (var a = 0; a < L[count].length; a++) {
      var point = L[count][a];

      for (var t = -1; t <= 1; t += 2) {
        var posX = point[0] + t,
          posY = point[1] + t;
        if (posX > -1 && posY > -1 && posX < n && posY < n) {
          if (bitmatrix[posX][point[1]] == 254) {
            bitmatrix[posX][point[1]] = count + 1;
            temp.push([posX, point[1]]);
          }
          if (bitmatrix[point[0]][posY] == 254) {
            bitmatrix[point[0]][posY] = count + 1;
            temp.push([point[0], posY]);
          }
        }
      }
    }
    //console.log(point);

    L[count + 1] = temp;
    count++;
  }
  //console.log(L);
  bitmatrix = BFS(robotinit[0], bitmatrix, robotgoal[0]);

  //=====================================draw bitmap==================================
  var bitmap = d3.select("#bitmap")
    .attr("width", n)
    .attr("height", n)
    .attr("transform", 'translate(100, -20)');

  var dot = bitmap.selectAll("rect");

  for (var i = 0; i < bitmatrix.length; i++) {
    for (var j = 0; j < bitmatrix[i].length; j++) {

      if (bitmatrix[i][j] == 0) {

        var bit = [i, j];
        //console.log(bit);
        dot.data([bit])
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return d[0];
          })
          .attr("y", function(d) {
            return d[1];
          })
          .attr("width", 1)
          .attr("height", 1)
          .style("fill", 'red');
      } else if (bitmatrix[i][j] == 255) {
        var bit = [i, j];
        //console.log(bit);
        dot.data([bit])
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return d[0];
          })
          .attr("y", function(d) {
            return d[1];
          })
          .attr("width", 1)
          .attr("height", 1)
          .style("fill", 'red');
      }else if (bitmatrix[i][j] == 256) {
        var bit = [i, j];
        //console.log(bit);
        dot.data([bit])
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return d[0];
          })
          .attr("y", function(d) {
            return d[1];
          })
          .attr("width", 1)
          .attr("height", 1)
          .style("fill", 'green');
      }
      else if (bitmatrix[i][j] < 254) {
        //console.log(bitmatrix[i][j]);
        var bit = [i, j];
        //console.log(bit);
        dot.data([bit])
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return d[0];
          })
          .attr("y", function(d) {
            return d[1];
          })
          .attr("width", 1)
          .attr("height", 1)
          .style('fill', "rgb(" + (255 - bitmatrix[i][j] * 2) + "," + (255 - bitmatrix[i][j] * 2) + "," + (255 - bitmatrix[i][j] * 2) + ")");
      }
    }
  }


  function scanline(x0, y0, x1, y1) {
    var d, dx, dy;
    d = (Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
    dy = (y1 - y0) / d;
    dx = (x1 - x0) / d;

    for (var i = 0; i <= d; i++) {
      y_list.push([Math.floor(x0 + i * dx), Math.floor(y0 + i * dy)]);
      //bitmatrix[Math.round(x0+i*dx)][Math.round(y0+i*dy)] = black;
    }
  }

  function drewlineY(x0, y0, x1, y1, color) {
    for (var i = y0; i <= y1; i++) {
      //y_list.push([Math.floor(x0+i*dx), Math.floor(y0+i*dy)]);
      bitmatrix[x0][i] = color;
    }
  }

  function drewlineX(x0, y0, x1, y1, color) {
    for (var i = x0; i <= x1; i++) {
      //y_list.push([Math.floor(x0+i*dx), Math.floor(y0+i*dy)]);
      bitmatrix[i][y0] = color;
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
        temp.push({
          'x': x,
          'y': y
        });
      }
      point.push(temp);
    }
    obstacle_points.push(point);
  }
  return obstacle_points;
}

function BFS(init, bitmatrix, goal) {
  console.log(init);
  console.log(goal);
  init  = [80, 1];
  var markmap = [];
  for (var i = 0; i < 128; i++) {
    markmap[i] = [];
    for (var j = 0; j < 128; j++) {
      markmap[i][j] = false;
    }
  }

  var open = [],
    success = false;
  open[0] = [init], opencount = -1;

  console.log(open[0]);
  while (!success) {
    opencount++;
    var x = first();
    //open[opencount+1] ;
    //console.log(opencount);

    for (var t = -1; t <= 1; t += 2) {
      var posX = x[0] + t,
        posY = x[1] + t;
      if (posX > -1 && posY > -1 && posX < 128 && posY < 128) {
        if (bitmatrix[posX][x[1]] < 255 && !markmap[posX][x[1]]) {
          var xp = [posX, x[1], opencount];
          open[opencount + 1].push(xp);
          markmap[posX][x[1]] = true;
          if (posX == goal[0] && x[1] == goal[1]) {
            success = true;
          }
        }
        if (bitmatrix[x[0]][posY] < 255 && !markmap[x[0]][posY]) {
          var xp = [x[0], posY, opencount];
          open[opencount + 1].push(xp);
          markmap[posX][x[1]] = true;
          if (x[0] == goal[0] && posY == goal[1]) {
            success = true;
          }
        }
      }
    }
    //console.log(open[opencount+1]);
  }
  if (success) {
    console.log(open);
    console.log(opencount);
    var path = [];
    for(var i = 0; i < open[open.length-1].length; i++){
      if(open[open.length-1][i][0] == goal[0] && open[open.length-1][i][1] == goal[1]){
        path.push(open[open.length-1][i]);
      }
    }
    var count = 0;
    while (path[count].length == 3) {
      path.push(open[path[count][2]][0]);
      count++;
    }
    console.log(path);
    for(var i = 0; i < path.length; i++){
      //console.log(path[i]);
      bitmatrix[path[i][0]][path[i][1]] = 256;
    }

    return bitmatrix;
  }

  function first() {

    var field = bitmatrix[open[opencount][0][0]][open[opencount][0][1]];
    var index = 0,
      pos = [open[opencount][0][0], open[opencount][0][1]];
    for (var i = 1; i < open[opencount].length; i++) {
      if (bitmatrix[open[opencount][i][0]][open[opencount][i][1]] < field) {
        field = bitmatrix[open[opencount][i][0]][open[opencount][i][1]];
        pos = [open[opencount][i][0], open[opencount][i][1]]
        index = i;
      }
    }
    var temp = [];
    for (var i = 1; i < open[opencount].length; i++) {
      if (i != index) {
        temp.push(open[opencount][i]);
      }
    }
    open[opencount] = [open[opencount][index]];

    open[opencount + 1] = temp;
    //console.log(open[opencount +1]);

    return pos;
  }

}
