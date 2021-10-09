class Obstacles {
    constructor() {
        this.width = 100;
        // default to be right of the screen
        // so it won't be seen at the start
        this.x = 1400+this.width;   
        this.height = [-1,-1];
    }

    show() {
        fill(255);
        // rectMode(CORNER);
        // var y = leveltopixel(this.height[0])-50;
        // var h = leveltopixel(this.height[1])+50 - y;
        // rect(this.x,y,this.width,h);
        for (let i=this.height[0]; i<=this.height[1];i++){
            var y = leveltopixel(i)-50;
            image(obstacleimg, this.x-50, y,100,100);
        }
    }

    update(_x,_height) {
        this.x = _x;
        this.height = _height;
    }
   
}