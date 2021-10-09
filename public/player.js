const hist_count = 20;  // obtained by this.x(100) / 5 (panSpeed)
const panSpeed = 5;

class Player {
    constructor(rgb) {
        this.x = 100;
        this.y = -100;
        this.color = rgb;
        // store historic y axis position
        // default to be at 400 (intial value)
        this.hist = [];
        for (let i =0; i<hist_count; i++){
            this.hist.push(400);
        }
        // an index to keep track of the oldest data
        // left of curr_pos is newest, right of curr_pos is oldest (to be replaced)
        // so when updating historic positions, doesn't need to shift the values in array
        this.curr_pos = 0;
        this.img;
        switch (this.color){
            case "rgb(255,0,0)":
                this.img = redimg;
                break;
            case "rgb(255,255,0)":
                this.img = yellowimg;
                break;
            case "rgb(0,0,255)":
                this.img = blueimg;
                break;
        }
    }

    show() {
        fill(this.color);
        if (status == "running") { this.drawline(); }
        // ellipse(this.x,this.y,50);
        image(this.img, this.x-50, this.y-50,100,100);
    }

    updatepos(pos) {
        this.y = pos;
    }

    // draw trail of the player
    // rect is used intead of line so stroke color is consistent in the whole syustem
    drawline() {
        var j = this.curr_pos;
        for (let i=0; i<hist_count-1;i++){
            noStroke();
            fill(this.color);
            rectMode(CORNERS);
            rect(i*5,this.hist[j]-2.5,(i+1)*5,this.hist[increment_index(j)]+2.5);
            j = increment_index(j);
        }
    }

    // store current position to the history
    // called from external
    updatehist() {
        if (status != "running") return;
        this.hist[this.curr_pos] = this.y;
        this.curr_pos = increment_index(this.curr_pos);
    }
}

// functions to create closed loop increment
// 20+1 = 0
// used for increment/decrement this.curr_pos
function increment_index(i){
    if (i == hist_count-1) return 0;
    else return i+1;
}

function decrement_index(i){
    if (i == 0) return hist_count-1;
    else return i-1;
}