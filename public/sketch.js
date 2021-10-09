// sync with index.js
const refresh_time = 10; // in ms
const player_count = 3;
const obstacle_count = 3;
const powerup_count = 2;
const game_time = 60;

var players = [];
var obstacles = [];
var powerups = [];
var sysclock = -1;

var score = [];
for (let i=0; i<player_count;i++){
    score.push(0);
}
var textstr = "Player Red : " + score[0] + "\nPlayer Green : " + score[1] +
              "\nPlayer Blue : " + score[2];

var play = false;
var status = "start";

var bgimg;
var redimg;
var yellowimg;
var blueimg;
var powerupimg;
var obstacleimg;

function preload() {
    bgimg = loadImage('images/background.jpg');
    redimg = loadImage('images/player_red.png');
    yellowimg = loadImage('images/player_yellow.png');
    blueimg = loadImage('images/player_blue.png');
    powerupimg = loadImage('images/powerup.png');
    obstacleimg = loadImage('images/obstacle.png');
}

function setup() {
    // create canvas
    window.canvas = createCanvas(1400, 900);

    // initialise players with different color
    players[2] = new Player("rgb(255,0,0)");
    players[1] = new Player("rgb(255,255,0)");
    players[0] = new Player("rgb(0,0,255)");

    // initilise obstacles
    for (let i=0; i<obstacle_count; i++){
        obstacles[i] = new Obstacles();
    }
    for (let i=0; i<powerup_count; i++){
        powerups[i] = new PowerUp();
    }
    // to deal with updateplayerhist called before set up is done
    play = true;
}

// automatic loop function defined by p5
function draw() {
    // background images
    background(100);
    image(bgimg, 0,0, 1400,900);

    // grid line for levels
    for (let i = 100; i<900; i+= 100){
        stroke(0);
        line(0,i,1400,i);
    }

    // // clock/ countdown
    // if (sysclock >= 0){
    //     textSize(20);
    //     text(sysclock, 10, 10, 50,50);
    // }

    // what to display is depends on the status 
    // received from the server
    switch (status) {
        case "start":
            if (sysclock >= 0){
               textSize(100);
               text(sysclock, 700, 350, 800,350);
            }
            break;
        case "running":
            running();
            break;
        case "end":
            end();
            break;
    }

    // show players
    for (let i=0; i<player_count; i++){
        players[i].show();
    }

    // receive packets sent from server
    // to resolve promise
    const getvel = fetchdata().then(data => {
        return [data.player, data.obstacle, data.powerup, data.point, data.status, data.timer];
    });
    
    // update variable values according to data received from server
    const get = async() => {
        tmp = await getvel;
        updateplayer(tmp[0]);       // player
        updateobstacle(tmp[1]);     // obstacle
        updatepowerup(tmp[2]);      // powerup
        updatescore(tmp[3]);        // score
        status = tmp[4];            // status
        sysclock = tmp[5];
    }
    get();
    
}
setInterval(updateplayerhist, refresh_time);

// update player historic y axis position
// to track trial 
function updateplayerhist() {
    if (play){
        for (let i=0; i<player_count; i++){
            players[i].updatehist();
        }
    }
}

// update players position according to the server data
function updateplayer(tmp) {
    for (let i=0; i<player_count; i++){
        players[i].updatepos(leveltopixel(tmp[i]));
    }
}

async function fetchdata() {
    const option = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/api", option);
    return response.json();
}

function leveltopixel(x) {
    return (x+1)*100;
}