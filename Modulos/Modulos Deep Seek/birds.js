export class Bird {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 50;
        this.y = canvas.height / 2;
        this.width = 70;
        this.height = 70;
        this.gravity = 0.15;
        this.lift = -6;
        this.velocity = 1;
        this.image = new Image();
        this.image.src = 'assets/socrates.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + this.height > this.canvas.height || this.y < 0) {
            gameOver = true;
        }
    }

    flap() {
        this.velocity = this.lift;
    }

    reset() {
        this.y = this.canvas.height / 2;
        this.velocity = 0;
    }
}