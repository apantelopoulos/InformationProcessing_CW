// functions use is status "running"

function running() {
    // scoreboard
    fill(255);

    // clock/ countdown
    if (sysclock >= 0){
        textSize(35);
        var clock = "00:"+padding(sysclock);
        text(clock, 10, 10, 50,50);
    }

    // sorting scoreboard
    var scoreAndPlayer = [  { 
                            color: "ID: 0 Player Blue : ",
                            Score: score[0] 
                        }, {
                            color: "ID: 1 Player Yellow : ",
                            Score: score[1]
                        }, {
                            color: "ID: 2 Player Red : ",
                            Score: score[2]
                        }
                    ];
    
    // sort in descending order
    scoreAndPlayer.sort( (a,b) => {
        return b.Score - a.Score;
    }); 

    var textstr = "";
    for (let i=0; i<3; i++) {
        textstr += scoreAndPlayer[i].color + scoreAndPlayer[i].Score + "\n";
    }

    textSize(20);
    text(textstr, 1100, 10, 1400, 110);

    showall();
}

function showtimer() {
    console.log(sysclock);
    if (sysclock > game_time-1){
        var text = toString(sysclock-game_time);
        textSize(40);
        text(text, 600, 300, 800, 400);
    }
}

// to create figures on the screen
function showall() {
    for (let i=0; i<powerup_count; i++){
        powerups[i].show();
    }
    for (let i=0; i<obstacle_count; i++){
        obstacles[i].show();
    }
}

// update obstacles position according to the server data
function updateobstacle(tmp) {
    if (status != "running") return;
    for (let i=0; i<obstacle_count; i++){
        obstacles[i].update(tmp[i][0],tmp[i][1]);
    }
}

// update powerup position according to the server data
function updatepowerup(tmp) {
    if (status != "running") return;
    for (let i=0; i<powerup_count; i++){
        powerups[i].update(tmp[i][0],tmp[i][1]);
    }
}

// update scoreboard according to the server data
function updatescore(tmp) {
    score = tmp;
}

function padding(int) {
    if (int < 10) return "0"+int;
    else return int;
}