function hiderobot() {
  console.log(robot);
  if (showrobot) {
    robot_list = robot2svg(robot);
    robotarray = robotarraylist(robot_list);
    drawrobot(robotarray);
    showrobot = false;
    document.getElementById("robotbutton").innerHTML = "Hide robot";
  } else {
    d3.selectAll(".robot").remove();
    showrobot = true;
    document.getElementById("robotbutton").innerHTML = "Show robot";
  }
}

function hideobstacle() {
  if (showobstacle) {
    obstacle_list = obstacle2svg(obstacle);
    obstaclearray = obstaclearraylist(obstacle_list);
    drawobstacle(obstaclearray);
    showobstacle = false;
    document.getElementById("obstaclebutton").innerHTML = "Hide obstacle";
  } else {
    d3.selectAll(".obstacle").remove();
    showobstacle = true;
    document.getElementById("obstaclebutton").innerHTML = "Show obstacle";
  }
}
