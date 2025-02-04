export class Columns {
    constructor(canvas) {
        this.canvas = canvas;
        this.columns = [];
        this.columnWidth = 60;
        this.gapHeight = 300;
        this.image = new Image();
        this.image.src = 'assets/column.jpeg';
    }

    draw(ctx) {
        this.columns.forEach(column => {
            ctx.drawImage(this.image, column.x, column.gapY + this.gapHeight, this.columnWidth, this.canvas.height - column.gapY - this.gapHeight);
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(this.image, column.x, -column.gapY, this.columnWidth, column.gapY);
            ctx.restore();
        });
    }

    update() {
        for (let i = this.columns.length - 1; i >= 0; i--) {
            const column = this.columns[i];
            column.x -= 3;
            if (column.x + this.columnWidth < 0) {
                this.columns.splice(i, 1);
                score++;
            }
            if (
                bird.x + bird.width > column.x &&
                bird.x < column.x + this.columnWidth &&
                (bird.y < column.gapY || bird.y + bird.height > column.gapY + this.gapHeight)
            ) {
                gameOver = true;
            }
        }

        if (this.columns.length === 0 || this.columns[this.columns.length - 1].x < this.canvas.width - 330) {
            const gapY = Math.random() * (this.canvas.height - this.gapHeight - 100) + 50;
            this.columns.push({ x: this.canvas.width, gapY });
        }
    }

    reset() {
        this.columns = [];
    }
}