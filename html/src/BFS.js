function BFS() {
    //console.log(potential_field.length);
    var open = [],
        success = false,
        Tree = [],
        fullbit = [];
    for (var i = 0; i <= 509; i++) {
        open[i] = [];
    }

    for (var i = 0; i < 360; i++) {
        fullbit[i] = [];
        for (var j = 0; j < 128; j++) {
            fullbit[i][j] = [];
            for (var k = 0; k < 128; k++) {
                fullbit[i][j][k] = bitmatrix[j][k];
            }
        }
    }
    var pathmatrix = [];

    for (var j = 0; j < 128; j++) {
        pathmatrix[j] = [];
        for (var k = 0; k < 128; k++) {
            pathmatrix[j][k] = bitmatrix[j][k];
        }
    }

    //console.log(fullbit[94]);
    console.log(open.length);
    //====================================set bitmatrix================================
    var goal = [],
        controlpoint = [],
        init = [],
        polygon = robot[0].polygon;

    //=======================set inti for bit map===============================
    //console.log([parseFloat(robot[i].goal[0]), parseFloat(robot[i].goal[1])]);
    goal = ([Math.round(parseFloat(robot[0].goal[0])), Math.round(parseFloat(robot[0].goal[1])), Math.round(parseFloat(robot[0].goal[2]))]);
    init = ([Math.round(parseFloat(robot[0].initaial[0])), Math.round(parseFloat(robot[0].initaial[1])), Math.round(parseFloat(robot[0].initaial[2]))]);
    console.log(goal);
    console.log(init);
    var temp = [];
    for (var j = 0; j < robot[0].controlpoint.length; j++) {
        temp.push([parseFloat(robot[0].controlpoint[j][0]), parseFloat(robot[0].controlpoint[j][1])]);
    }
    controlpoint = (temp);

    var obstacle_bitlist = obstacle2bitmap(obstacle);
    //=============================================================================

    Tree.push({
        "pos": init,
        "pre": null
    });
    console.log(Tree);

    var field = potential_field[0][ob2wor(init, controlpoint[0])[0]][ob2wor(init, controlpoint[0])[1]] + potential_field[1][ob2wor(init, controlpoint[1])[0]][ob2wor(init, controlpoint[1])[1]];
    console.log(field);
    open[field].push({
        "pos": init,
        "pre": null
    });
    fullbit[init[2]][init[0]][init[1]] = 256;
    console.log(open.length);
    var  degree = 0, count = 0;
    while (empty(open) != 0 && !success) {
        var x = first(open);

        for (var t = -1; t <= 1; t += 2) {
            var posX = x.pos[0] + t,
                posY = x.pos[1] + t;
            var cor1 = ob2wor([posX, x.pos[1], x.pos[2]], controlpoint[0]),
                cor2 = ob2wor([x.pos[0], posY, x.pos[2]], controlpoint[0]);
            var cor3 = ob2wor([posX, x.pos[1], x.pos[2]], controlpoint[1]),
                cor4 = ob2wor([x.pos[0], posY, x.pos[2]], controlpoint[1]);
            if (posX > -1 && posY > -1 && posX < 128 && posY < 128) {
                if (cor1[0] > -1 && cor1[1] > -1 && cor1[0] < 128 && cor1[1] < 128 && cor3[0] > -1 && cor3[1] > -1 && cor3[0] < 128 && cor3[1] < 128) {
                    if (!collision(polygon, [posX, x.pos[1], x.pos[2]], obstacle_bitlist)) {
                        if (fullbit[x.pos[2]][posX][x.pos[1]] != 256) {
                            var Ux = potential_field[0][cor1[0]][cor1[1]] + potential_field[1][cor3[0]][cor3[1]];
                            if (Ux < 508) {
                                //console.log("!!");
                                Tree.push({
                                    "pos": [posX, x.pos[1], x.pos[2]],
                                    "pre": x
                                });
                                open[Ux].push({
                                    "pos": [posX, x.pos[1], x.pos[2]],
                                    "pre": x
                                });
                                fullbit[x.pos[2]][posX][x.pos[1]] = 256;
                                if (posX == goal[0] && x.pos[1] == goal[1] && x.pos[2] == goal[2]) success = true;
                            }
                        }
                    }
                }
                if (cor2[0] > -1 && cor2[1] > -1 && cor2[0] < 128 && cor2[1] < 128 && cor4[0] > -1 && cor4[1] > -1 && cor4[0] < 128 && cor4[1] < 128) {
                    if (!collision(polygon, [x.pos[0], posY, x.pos[2]], obstacle_bitlist)) {
                        if (fullbit[x.pos[2]][x.pos[0]][posY] != 256) {
                            var Ux = potential_field[0][cor2[0]][cor2[1]] + potential_field[1][cor4[0]][cor4[1]];
                            if (Ux < 508) {
                                //console.log("!!");
                                Tree.push({
                                    "pos": [x.pos[0], posY, x.pos[2]],
                                    "pre": x
                                });
                                open[Ux].push({
                                    "pos": [x.pos[0], posY, x.pos[2]],
                                    "pre": x
                                });
                                fullbit[x.pos[2]][x.pos[0]][posY] = 256;
                                if (x.pos[0] == goal[0] && posY == goal[1] && x.pos[2] == goal[2]) success = true;
                            }
                        }
                    }
                }
            }
        }
        var cor1 = ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[0]),
            cor2 = ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[0]);
        var cor3 = ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[1]),
            cor4 = ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[1]);

            if(count % 2 == 0){
              degree = 2;
            }
            else{
              degree = 1;
            }
        //var degree = 2;
        if (x.pos[2] + degree < 360) {
            if (!collision(polygon, [x.pos[0], x.pos[1], x.pos[2] + degree], obstacle_bitlist)) {
                if (fullbit[x.pos[2] + degree][x.pos[0]][x.pos[1]] != 256) {
                    if (cor1[0] > -1 && cor1[1] > -1 && cor1[0] < 128 && cor1[1] < 128 && cor3[0] > -1 && cor3[1] > -1 && cor3[0] < 128 && cor3[1] < 128) {
                        var Ux = potential_field[0][ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[0])[0]][ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[0])[1]] + potential_field[1][ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[1])[0]][ob2wor([x.pos[0], x.pos[1], x.pos[2] + degree], controlpoint[1])[1]];
                        if (Ux < 508) {
                            //console.log("right");
                            Tree.push({
                                "pos": [x.pos[0], x.pos[1], x.pos[2] + degree],
                                "pre": x
                            });
                            open[Ux].push({
                                "pos": [x.pos[0], x.pos[1], x.pos[2] + degree],
                                "pre": x
                            });
                            fullbit[x.pos[2] + degree][x.pos[0]][x.pos[1]] = 256;
                            if (x.pos[0] == goal[0] && x.pos[1] == goal[1] && x.pos[2] + degree == goal[2]) success = true;

                        }
                    }
                }
            }
        }

        if (x.pos[2] - degree >= 0) {
            if (!collision(polygon, [x.pos[0], x.pos[1], x.pos[2] - degree], obstacle_bitlist)) {
                if (fullbit[(x.pos[2] - degree)][x.pos[0]][x.pos[1]] != 256) {
                    if (cor2[0] > -1 && cor2[1] > -1 && cor2[0] < 128 && cor2[1] < 128 && cor4[0] > -1 && cor4[1] > -1 && cor4[0] < 128 && cor4[1] < 128) {
                        var Ux = potential_field[0][ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[0])[0]][ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[0])[1]] + potential_field[1][ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[1])[0]][ob2wor([x.pos[0], x.pos[1], x.pos[2] - degree], controlpoint[1])[1]];
                        if (Ux < 508) {
                            //console.log("left");
                            Tree.push({
                                "pos": [x.pos[0], x.pos[1], x.pos[2] - degree],
                                "pre": x
                            });
                            open[Ux].push({
                                "pos": [x.pos[0], x.pos[1], x.pos[2] - degree],
                                "pre": x
                            });
                            fullbit[x.pos[2] - degree][x.pos[0]][x.pos[1]] = 256;
                            if (x.pos[0] == goal[0] && x.pos[1] == goal[1] && x.pos[2] - degree == goal[2]) success = true;

                        }
                    }
                }
            }
        }
        count++;
    }

    console.log(success);
    console.log(open);
    console.log(Tree[Tree.length - 1]);
    var temp = Tree[Tree.length - 1];
    var path = [];
    while (temp.pre) {
        path.push(temp.pos);
        temp = temp.pre;
    }
    path.push(temp.pos)
    console.log(path);
    //console.log(pathmatrix);

    for (var i = 0; i < path.length; i++) {
        pathmatrix[path[i][0]][path[i][1]] = 256;
    }

    var pathmap = d3.select("#path")
        .attr("width", 128)
        .attr("height", 128)
        .attr("transform", 'translate(200, -20)');

    var dot = pathmap.selectAll("rect");

    for (var i = 0; i < pathmatrix.length; i++) {
        for (var j = 0; j < pathmatrix[i].length; j++) {

            if (pathmatrix[i][j] == 255) {
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
            } else if (pathmatrix[i][j] == 256) {
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
                    .style("fill", 'white');
            } else if (pathmatrix[i][j] == 254) {
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
                    .style('fill', "green");
            }
        }
    }
    if(success) animation(path);
}


function ob2wor(init, control) {
    var theta = init[2] * (Math.PI / 180);
    var x = control[0] * Math.cos(theta) - control[1] * Math.sin(theta) + init[0];
    var y = control[0] * Math.sin(theta) + control[1] * Math.cos(theta) + init[1];
    //console.log([Math.round(x), Math.round(y)]);
    return [Math.round(x), Math.round(y)];
}

function first(open) {
    var target;
    //console.log(open.length);
    for (var i = 0; i < open.length; i++) {
        if (open[i].length != 0) {
            target = open[i].pop();
            return target;
        }
    }
    return 0;
}

function empty(open) {
    var target;
    //console.log(open.length);
    for (var i = 0; i < open.length; i++) {
        if (open[i].length != 0) {
            return 1;
        }
    }
    return 0;
}

function collision(robot, ori, obstacles) {
    //bitmatrix
    var collision = false;
    var wor_robot = [];
    //console.log("collision");
    for (var i = 0; i < robot.length; i++) {
        wor_robot[i] = [];
        for (var j = 0; j < robot[i].length; j++) {
            var x = ob2wor(ori, robot[i][j]);
            wor_robot[i][j] = x;
        }
    }
    //console.log(obstacles);

    var robot_vecter = [];
    var obstacle_vecter = [];

    for (var i = 0; i < wor_robot.length; i++) {
        for (var j = 0; j < wor_robot[i].length; j++) {
            if (j != wor_robot[i].length - 1) {
                robot_vecter.push([wor_robot[i][j + 1][0] - wor_robot[i][j][0], wor_robot[i][j + 1][1] - wor_robot[i][j][1], wor_robot[i][j], wor_robot[i][j + 1]]);
            } else {
                robot_vecter.push([wor_robot[i][0][0] - wor_robot[i][j][0], wor_robot[i][0][1] - wor_robot[i][j][1], wor_robot[i][j], wor_robot[i][0]]);
            }
        }
    }
    //console.log(robot_vecter);

    for (var i = 0; i < obstacles.length; i++) {
        for (var j = 0; j < obstacles[i].length; j++) {
            for (var k = 0; k < obstacles[i][j].length; k++) {
                if (k != obstacles[i][j].length - 1) {
                    obstacle_vecter.push([obstacles[i][j][k + 1].x - obstacles[i][j][k].x, obstacles[i][j][k + 1].y - obstacles[i][j][k].y, obstacles[i][j][k], obstacles[i][j][k + 1]]);
                } else {
                    obstacle_vecter.push([obstacles[i][j][0].x - obstacles[i][j][k].x, obstacles[i][j][0].y - obstacles[i][j][k].y, obstacles[i][j][k], obstacles[i][j][0]]);
                }

            }
        }
    }
    //console.log(obstacle_vecter);

    for (var i = 0; i < robot_vecter.length; i++) {
        var p1 = robot_vecter[i][2],
            p2 = robot_vecter[i][3];
        var v12 = [p2[0] - p1[0], p2[1] - p1[1]];
        for (var j = 0; j < obstacle_vecter.length; j++) {
            var p3 = obstacle_vecter[j][2],
                p4 = obstacle_vecter[j][3];
            var v13 = [p3.x - p1[0], p3.y - p1[1]],
                v14 = [p4.x - p1[0], p4.y - p1[1]];
            var v34 = [p4.x - p3.x, p4.y - p3.y],
                v31 = [p1[0] - p3.x, p1[1] - p3.y],
                v32 = [p2[0] - p3.x, p2[1] - p3.y];


            if (((-1 * v12[1] * v13[0] + v12[0] * v13[1]) * (-1 * v12[1] * v14[0] + v12[0] * v14[1])) < 0) {
              if (((-1 * v34[1] * v31[0] + v34[0] * v31[1]) * (-1 * v34[1] * v32[0] + v34[0] * v32[1])) < 0) {
                  //console.log("collision");
                  collision = true;
                  break;
              }
            }

        }
        if(p1[0] > 128 || p1[1] > 128 || p1[0] < 0 || p1[1] < 0){
          collision = true;
          break;
        }
    }
    //console.log(collision);
    return collision;
}

function animation(path) {
    var select = [];
    var together = document.getElementsByTagName("polyline");
    for (var i = 0; i < together.length; i++) {
        if (together[i].id == "robot0") {
            select.push(together[i]);
        }
    }
    console.log(select);

    //d3.selectAll("#robot0").remove();
    console.log(path.length);
    var k = path.length - 1;

    function move() {
        setTimeout(function() { //  call a 3s setTimeout when the loop is called
            var dx = scale(path[k][0]) - scale(path[k - 1][0]);
            var dy = scale(path[k][1]) - scale(path[k - 1][1]);
            var dt = path[k - 1][2] - path[k][2];
            //console.log(dt);
            if (dt == 0) {
                for (var i = 0; i < select.length; i++) {
                    for (var j = 0; j < select[i].points.length; j++) {
                        select[i].points[j].x -= dx;
                        select[i].points[j].y -= dy;
                    }
                }
            } else {

                var rotation = dt * (Math.PI / 180);
                //console.log([scale(path[k][0]), scale(path[k][1])]);
                for (var i = 0; i < select.length; i++) {
                    for (var j = 0; j < select[i].points.length; j++) {
                        var x = (select[i].points[j].x - scale(path[k][0])) * Math.cos(rotation) - (select[i].points[j].y - scale(path[k][1])) * Math.sin(rotation);
                        var y = (select[i].points[j].x - scale(path[k][0])) * Math.sin(rotation) + (select[i].points[j].y - scale(path[k][1])) * Math.cos(rotation);
                        //console.log([x, y]);
                        select[i].points[j].x = x + scale(path[k][0]);
                        select[i].points[j].y = y + scale(path[k][1]);
                    }
                }
            }
            k--; //  increment the counter
            if (k > 0) { //  if the counter < 10, call the loop function
                move(); //  ..  again which will trigger another
            } //  ..  setTimeout()
        }, 100)
    }
    move();
}
