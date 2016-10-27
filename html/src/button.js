function hiderobot() {
    if (showrobot) {
        drawrobot(robotarray);
        showrobot = false;
        document.getElementById("robotbotton").innerHTML = "Hide robot";
    } else {
        d3.selectAll(".robot").remove();
        showrobot = true;
        document.getElementById("robotbotton").innerHTML = "Show robot";
    }
}

function hideobstacle() {
    if (showobstacle) {
        drawobstacle(obstaclearray);
        showobstacle = false;
        document.getElementById("obstaclebotton").innerHTML = "Hide obstacle";
    } else {
        d3.selectAll(".obstacle").remove();
        showobstacle = true;
        document.getElementById("obstaclebotton").innerHTML = "Show obstacle";
    }
}
