function end() {
    fill(255);
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

    if (sysclock <= 0){
        textSize(50);
        fill(0);
        text("Leaderboard:", 520,230,650,300);
        for (let i=0; i<3; i++) {
            fill("rgb(128,96,77)")
            rectMode(CORNERS);
            rect(350,300+i*100,1050,300+(i+1)*100,25);
            textstr = scoreAndPlayer[i].color + scoreAndPlayer[i].Score + "\n";
            textSize(50);
            fill(0);
            text(textstr, 420,330+i*100,650,300+(i+1)*100);
        }

    } else {
        textSize(100);
        fill("rgb(255,0,0)")
        text(sysclock, 700, 350, 800,350);
    }
}