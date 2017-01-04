var fs = require('fs');


var callback = function callback(req, res) {


    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "X-Requested-With");

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var token = req.query.token;
    var robotlist, obstaclelist;
    fs.readdir('./object', function(err, item) {
        var robot, obstacle;
        console.log(item);
        robot = item[2];
        obstacle = item[token];
        robotlist = readrobot(robot);
        //console.log(robotlist);
        obstaclelist = readobstacle(obstacle);
        //console.log(obstaclelist);
        for (var i = 0; i < robotlist.length; i++) {
            robotcheak(robotlist[i]);
        }
        for (var i = 0; i < obstaclelist.length; i++) {
            robotcheak(obstaclelist[i]);
        }
        var res_data = {
            "robot": robotlist,
            "obstacle": obstaclelist
        }
        console.log(res_data);
        res.send(res_data);
    })
}

function readrobot(filename) {
    var data = fs.readFileSync('./object/' + filename, 'utf8');
    //console.log(data.length);
    var robot_array = [];
    //=================================讀檔案====================================
    var string_array = [];
    var string = ' ';
    for (var i = 0; i < data.length; i++) {
        if (data[i] === '\n') {
          //string += ' ';
            string_array.push(string);
            string = ' ';
        } else {
            if (data[i] == '\r')
            {
              //console.log('speace');
              string += ' ';
              }
            else
                string += data[i];
        }
        if (i == data.length - 1) {
            string_array.push(string);
        }
    }
    string_array[string_array.length - 1] += " ";
    //console.log(string_array);
    //console.log(string_array.length);
    //=================================讀檔結束==================================
    //console.log("/////////////////////////////////////////////////");
    //=================================分析檔案==================================

    var robot_number = string_array[1],
        polygon_number = 0;
    var robotlist = -1;
    //console.log(robot_number);
    for (var i = 2; i < string_array.length; i++) {
        if (string_array[i].match('# number of polygons') != null) {
            robotlist++;
            robot_array[robotlist] = {
                polygon: [],
                initaial: null,
                goal: null,
                controlpoint: null
            };
            polygon_number = string_array[i + 1];
            //console.log("robot#" + robot_number);
            robot_number = robot_number - 1;
            i = i + 1; //多加一行
        } else if (string_array[i].match('# polygon #') != null) {
            //console.log("polygon#" + polygon_number);
            polygon_number = polygon_number - 1;
            var vertices_number = string_array[i + 2];
            var vertice = [];
            i = i + 4;
            //===================插入頂點====================
            for (var j = 0; j < vertices_number - 1; j++) {
                vertice.push(string_array[i]);
                i++;
            }
            vertice.push(string_array[i]);
            //===================插入頂點====================
            robot_array[robotlist].polygon.push(vertice);
            //console.log(vertice);
        } else if (string_array[i].match('# initial configuration') != null) {
            var initial_configuration = string_array[i + 1];
            //console.log("initial configuration:" + initial_configuration);
            i++;
            robot_array[robotlist].initaial = initial_configuration;
        } else if (string_array[i].match('# goal configuration') != null) {
            var goal_configuration = string_array[i + 1];
            //console.log("goal configuration:" + goal_configuration);
            i++;
            robot_array[robotlist].goal = goal_configuration;
        } else if (string_array[i].match('# number of control points') != null) {
            //console.log("controlpoint:");
            var controlpoint_number = string_array[i + 1];
            var controlpoint = [];
            i = i + 1;
            for (var j = 0; j < controlpoint_number; j++) {
                i += 2;
                controlpoint.push(string_array[i]);
            }
            i--;
            //console.log(controlpoint);
            robot_array[robotlist].controlpoint = controlpoint;
            //console.log(robot_array);
        }
    }
    //=================================結束分析==================================
    //console.log(robot_array);
    return robot_array;
}

function readobstacle(filename) {
    var data = fs.readFileSync('./object/' + filename, 'utf8');
    //console.log(data.length);
    //=================================讀檔案====================================
    var obstacle_array = [];
    var string_array = [];
    var string = ' ';
    for (var i = 0; i < data.length; i++) {
        if (data[i] === '\n') {
          string += ' ';
            string_array.push(string);
            string = ' ';
        } else {
            if (data[i] === ' ')
                string += ' ';
            else
                string += data[i];
        }
    }
    //console.log(string_array.length);
    //=================================讀檔結束==================================
    //console.log("/////////////////////////////////////////////////");
    //=================================分析檔案==================================
    var obstacle = {
        polygon: [],
        initaial: null
    };
    var obstacle_number = string_array[1],
        polygon_number = 0;
    var obstaclelist = -1;
    //console.log(obstacle_number);
    for (var i = 2; i < string_array.length; i++) {
        if (string_array[i].match('# number of polygons') != null) {
            obstaclelist++;
            obstacle_array[obstaclelist] = {
                polygon: [],
                initaial: null
            };
            polygon_number = string_array[i + 1];
            //console.log("obstacle#" + obstacle_number);
            obstacle_number = obstacle_number - 1;
            i = i + 1; //多加一行
        } else if (string_array[i].match('# polygon #') != null) {
            //console.log("polygon#" + polygon_number);
            polygon_number = polygon_number - 1;
            var vertices_number = string_array[i + 2];
            var vertice = [];
            i = i + 4;
            //===================插入頂點====================
            for (var j = 0; j < vertices_number - 1; j++) {
                vertice.push(string_array[i]);
                i++;
            }
            vertice.push(string_array[i]);
            //===================插入頂點====================
            obstacle_array[obstaclelist].polygon.push(vertice);
            //console.log(vertice);
        } else if (string_array[i].match('# initial configuration') != null) {
            var initial_configuration = string_array[i + 1];
            //console.log("initial configuration:" + initial_configuration);
            i++;
            obstacle_array[obstaclelist].initaial = initial_configuration;
            //i--;
            //console.log(obstacle_array);
        }
    }
    //=================================結束分析==================================

    return obstacle_array;
}

function robotcheak(data) {
    var goal = data.goal;
    var initaial = data.initaial;
    var polygon = data.polygon;
    var controlpoint = data.controlpoint;
    var vertice = [];
    var pos = '';
    //=========================Goal===========================================
    if (goal) {
        for (var i = 1; i < goal.length + 1; i++) {
            if (goal[i] === ' ') {
                vertice.push(pos);
                pos = '';
            } else if (i == goal.length) {
                data.goal = vertice;
            } else {
                pos += goal[i];
            }
        }
    }
    //=========================initaial=======================================
    if (initaial) {
        vertice = [];
        for (var i = 1; i < initaial.length + 1; i++) {
            if (initaial[i] === ' ') {
                vertice.push(pos);
                pos = '';
            } else if (i == initaial.length) {
                data.initaial = vertice;
            } else {
                pos += initaial[i];
            }
        }
    }
    //=========================controlpoint===================================
    if (controlpoint) {
        vertice = [];
        for (var i = 0; i <= controlpoint.length; i++) {
            var temp = controlpoint[i];
            vertice = [];
            if (temp) {
                for (var j = 1; j < temp.length + 1; j++) {
                    if (temp[j] === ' ') {
                        vertice.push(pos);
                        pos = '';
                    } else if (j == temp.length) {
                        controlpoint[i] = vertice;
                    } else {
                        pos += temp[j];
                    }
                }
            } else {
                data.controlpoint = controlpoint;
                break;
            }
        }
    }
    //=========================polygon========================================
    if (polygon) {
        for (var i = 0; i < polygon.length; i++) {
            var temp = polygon[i];
            if (temp) {
                for (var j = 0; j <= temp.length; j++) {
                    if (j < temp.length) {
                        vertice = [];
                        for (var k = 1; k < temp[j].length + 1; k++) {
                            if (temp[j][k] === ' ') {
                                vertice.push(parseFloat(pos));
                                pos = '';
                            } else if (k == temp[j].length) {
                                temp[j] = vertice;
                            } else {
                                pos += temp[j][k];
                            }
                        }
                    } else {
                        polygon[i] = temp;
                    }
                }
            } else {
                data.polygon = ploygon;
            }
        }
    }
}

var exports = module.exports = {};
exports.callback = callback;
