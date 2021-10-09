class PowerUp {
    constructor() {
        this.width = 100;
        // default to be right of the screen
        // so it won't be seen at the start
        this.x = 1400+this.width;   
        this.lvl = -1;
    }

    show() {
        fill(255);
        // rectMode(CORNER);
        var y = leveltopixel(this.lvl)-50;
        // rect(this.x,y,this.width,100);
        image(powerupimg,this.x-50, y,this.width,100);
    }

    update(_x,_lvl) {
        this.x = _x;
        this.lvl = _lvl;
    }
   
}