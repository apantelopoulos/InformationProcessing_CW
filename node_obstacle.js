// const of how many pixels the obstacle move in each refresh cycle
const panSpeed = 5;

class ObstaclesNode {
    constructor(bool) {
        this.width = 100;
        this.x = 1400+this.width;
        // an array of two elements [low,high]
        // low: the lowest level obstacle touches
        // high: the highest level obstacle touches
        this.height = this.createheight();  
        // obstacle would only move if this.live == true
        this.live = bool;
    }

    update() {
        if (this.live) this.x -= panSpeed;
    }

    // checks whether obstacle has moved off the screen at the left
    offscreen() {
        if (this.x < 0) return true;
        return false;
    }

    // randomly generates an obstacle 
    // returning an array of 2 elements
    // in specificaiton of this.height[]
    createheight() {
        var lowlvl = Math.round(Math.random()*7);
        var height = Math.round(Math.random()*6);
        var highlvl = lowlvl+height;
        if (highlvl > 7) highlvl = 7;
        return [lowlvl,highlvl];
    }

    // checks whether the player collide with the obstacle in terms of level (not pixel)
    // p is a level [0,7]
    collision(p) {
        if (this.x != 100) return false;
        if (p >= this.height[0] && p <= this.height[1]) return true;
        return false;
    }
}

module.exports = ObstaclesNode;