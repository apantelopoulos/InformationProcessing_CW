// const of how many pixels the obstacle move in each refresh cycle
const panSpeed = 5;

class PowerUpNode {
    constructor(bool) {
        this.width = 100;
        this.x = 1400+this.width;
        this.lvl = Math.round(Math.random()*7);
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

    // checks whether the player collide with the obstacle in terms of level (not pixel)
    // p is a level [0,7]
    collision(p) {
        if (this.x != 100) return false;
        if (p == this.lvl) return true;
        return false;
    }
}

module.exports = PowerUpNode;