// sync with sketch.js
const refresh_time = 10; // in ms
const player_count = 3;
const obstacle_count = 3;
const powerup_count = 2;
const game_time = 30;   // in s

var status = "start"
var sys_clock = 0;

// setting up server
const express = require("express");
const app = express(); 
app.listen(3000, () => console.log("listening"));   // 3000 is the arbitrary port number
app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));

// UDP packet receiver
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.bind(3000);
var address;
var port;

// set up obstacles
const Obstacle = require("./node_obstacle.js");
var obstacles = [];
var obstaclepacket = [];
for (let i=0; i<obstacle_count; i++){
    obstacles[i] = new Obstacle(false);
    let tmp = [obstacles[i].x,obstacles[i].height];
    obstaclepacket.push(tmp);
}

// set up power ups
const PowerUp = require("./node_powerup.js");
var powerups = [];
var poweruppacket = [];
for (let i=0; i<powerup_count; i++){
    powerups[i] = new PowerUp(false);
    let tmp = [powerups[i].x,powerups[i].lvl];
    poweruppacket.push(tmp);
}

// set up player
var pos = [];
var point = [];
var rank = [];
for (let i=0; i<player_count; i++){
    point.push(0);
    pos.push(-2);       // defualt position is -2, so it won't be shown on screen
    rank.push(1);
}

var dynamic_player_count = 0;
const rtn = new Uint8Array(1);
rtn[0] = 0;
const buf = Buffer.from(rtn.buffer);

// takes in UDP packet and response
socket.on('message', (msg, rinfo) => {
    var tmp = Uint8Array.from(msg);
    port = rinfo.port;
    address = rinfo.address;

    if (status != "running") {
        if (tmp[1] == 7){
            rtn[0] = dynamic_player_count;
            dynamic_player_count++;
            if (dynamic_player_count == 3 && status == "start") sys_clock = 3;  // for countdown to start the game
            if (dynamic_player_count == 3 && status == "end") restartgamepre();
        } else {
            console.log(pos);
            if (tmp[1] < dynamic_player_count ) pos[tmp[1]] = tmp[0];
            rtn[0] = 0;
        }
        
    } else {
        pos[tmp[1]] = tmp[0];
        rtn[0] = rank[tmp[1]]; 
    } 

    //sending msg
    socket.send(buf,port,address,function(){});
});

// communicate with index.html/ port
// sends game status ["start","running","end"]
// player y axis position
// obstalces x,y axis
// powerups x,y axis
// scoreboard of players
// system clock
app.get("/api", (request, response) => {
    response.json({
        status: status,
        player: pos,
        obstacle: obstaclepacket,
        powerup: poweruppacket,
        point: point,
        timer: sys_clock
    });
});

// start the game
var startgame = function () {
    sys_clock = game_time;
    obstacles[0].live = true;
    powerups[0].live = true;
    dynamic_player_count = 0;
}

var restartgamepre = function() {
    for (let i=0; i<player_count; i++){
        point[i] = 0;
    }
    sys_clock = 3;
}

var endgame = function () {
    status = "end";
    for (let i=0; i<player_count; i++){
        pos[i] = -2;
    }
    obstaclepacket = [];
    for (let i=0; i<obstacle_count; i++){
        obstacles[i] = new Obstacle(false);
        let tmp = [obstacles[i].x,obstacles[i].height];
        obstaclepacket.push(tmp);
    }
    poweruppacket = [];
    for (let i=0; i<powerup_count; i++){
        powerups[i] = new PowerUp(false);
        let tmp = [powerups[i].x,powerups[i].lvl];
        poweruppacket.push(tmp);
    }
}

// update obstacles and poweruup position
var updateobstacle = function () {
    // only update obstacle + check collision when in status = running
    if (status != "running") return;

    // score increases per time
    for (let i=0; i<player_count;i++){
        point[i] += 1;
    }

    for (let i=0; i<obstacle_count; i++){
        // so obstacles do not start moving at the same time
        if (i!=0 && !obstacles[i].live && obstacles[i-1].x < Math.random()*200+700){
            obstacles[i].live = true;
        }
        // update obstacles x position
        obstacles[i].update();
        // check collision of players with the obstacle
        for (let j=0; j<player_count; j++){
            var col = obstacles[i].collision(pos[j]);
            if (col) {
                point[j] -= 10;
                updaterank();
            }
        }
        // if obstalces leave the screen at left, create a new obstacle at the right
        if (obstacles[i].offscreen()){
            obstacles[i] = new Obstacle(true);
        }
        // update data that will be sent to client
        let tmp = [obstacles[i].x,obstacles[i].height];
        obstaclepacket[i] = tmp;
    }

    for (let i=0; i<powerup_count; i++){
        // so powerups do not start moving at the same time
        if (i!=0 && !powerups[i].live && powerups[i-1].x < Math.random()*200+500){
            powerups[i].live = true;
        }
        // update powerups x position
        powerups[i].update();
        // check collision of players with the powerup
        for (let j=0; j<powerup_count; j++){
            var col = powerups[i].collision(pos[j]);
            if (col) {
                point[j] += 5;
                updaterank();
            }
        }
        // if obstalces leave the screen at left, create a new obstacle at the right
        if (powerups[i].offscreen()){
            powerups[i] = new PowerUp(true);
        }
        // update data that will be sent to client
        let tmp = [powerups[i].x,powerups[i].lvl];
        poweruppacket[i] = tmp;
    }

};
// udpate obstacle powerups position + collision detection every refresh_time
setInterval(updateobstacle, refresh_time);

// update rank once point has changed due to collision
var updaterank = function() {
    var sorted = point.slice().sort(function(a,b){return b-a})
    rank = point.map(function(v){ return sorted.indexOf(v)+1 });
}

// countdown every 1 second
var countdown = function() {
    sys_clock--;
    if (sys_clock == 0) statechange();
}
setInterval(countdown, 1000);

// a simple state machine triggered by sys_clock == 0
var statechange = function () {
    switch (status){
        case "start":
            status = "running";
            startgame();
            break;
        case "running":
            starus = "end";
            endgame();
            break;
        case "end":
            status = "running";
            startgame();
            break;
    }
}