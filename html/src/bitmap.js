function open_bitmap() {

    potential_field = [];
    d3.selectAll("rect").remove();
    var n = 128,
        white = 254,
        black = 255,
        goal = 0;
    //====================================set bitmatrix================================
    var robotgoal = [],
        robotcontrolpoint = [],
        robotinit = [],
        robotpolygon = [];
    //=======================set inti for bit map===============================
    for (var i = 0; i < robot.length; i++) {
        //console.log([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])]);
        robotgoal.push([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1]), parseFloat(robot[i].goal[2])]);
        robotinit.push([parseFloat(robot[i].initaial[0]), parseFloat(robot[i].initaial[1]), parseFloat(robot[i].initaial[2])]);
        var temp = [];
        for (var j = 0; j < robot[i].controlpoint.length; j++) {
            temp.push([parseFloat(robot[i].controlpoint[j][0]), parseFloat(robot[i].controlpoint[j][1])]);
        }
        robotcontrolpoint.push(temp);
    }
    //console.log(robot);
    console.log("robotgoal:" + robotgoal);
    console.log("robotinit:" + robotinit);
    console.log( robotcontrolpoint);

    for (var i = 0; i < n; i++) {
        bitmatrix[i] = [];
        for (var j = 0; j < n; j++) {
            bitmatrix[i][j] = white;
        }
    }
    //=========================================================
    //bitmatrix[robotgoal[0][0]][robotgoal[0][1]] = goal;


    var obstacle_bitlist = obstacle2bitmap(obstacle);
    console.log(obstacle_bitlist);

    //=========================bitmap init========================================
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
    var potential = [];
    //=============================NF1 Algorithm===================================
    console.log(robotcontrolpoint[0].length);
    for(var i = 0; i < robotcontrolpoint[0].length; i++){
      var matrix = NF1(bitmatrix, robotcontrolpoint[0][i], robotgoal[0]);
      draw_bitmap(matrix, i);
      potential.push(matrix);
    }

    potential_field = potential;

    function scanline(x0, y0, x1, y1) {
        var d, dx, dy;
        d = (Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
        dy = (y1 - y0) / d;
        dx = (x1 - x0) / d;

        for (var i = 0; i <= d; i++) {
            y_list.push([Math.round(x0 + i * dx), Math.round(y0 + i * dy)]);
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

function NF1(bitM, robotcontrolpoint, robotgoal) {
    var bit = [];
    for(var i = 0; i < bitM.length; i++){
      bit[i] = [];
      for(var j = 0; j < bitM[i].length; j++){
        bit[i][j] = bitM[i][j];
      }
    }
    var theta = robotgoal[2] * (Math.PI / 180)
    var x = robotcontrolpoint[0] * Math.cos(theta) - robotcontrolpoint[1] * Math.sin(theta) + robotgoal[0];
    var y = robotcontrolpoint[0] * Math.sin(theta) + robotcontrolpoint[1] * Math.cos(theta) + robotgoal[1];
    var L = [],
        count = 0;
    console.log([x,y]);
    bit[x][y] = 0;
    L[0] = [[x, y]];
    //L[0] = robotgoal;

    while (L[count].length != 0) {
        var temp = [];
        //console.log(L[count].length);
        for (var a = 0; a < L[count].length; a++) {
            var point = L[count][a];

            for (var t = -1; t <= 1; t += 2) {
                var posX = point[0] + t,
                    posY = point[1] + t;
                if (posX > -1 && posY > -1 && posX < 128 && posY < 128) {
                    if (bit[posX][point[1]] == 254) {
                        bit[posX][point[1]] = count + 1;
                        temp.push([posX, point[1]]);
                    }
                    if (bit[point[0]][posY] == 254) {
                        bit[point[0]][posY] = count + 1;
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
    return bit;
}

function draw_bitmap(bitmatrix, i){

  var bitmap = d3.select("#bitmap" + i)
      .attr("width", 128)
      .attr("height", 128)
      .attr("transform", 'translate(200, -20)');

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
          } else if (bitmatrix[i][j] == 256) {
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
          } else if (bitmatrix[i][j] < 254) {
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
