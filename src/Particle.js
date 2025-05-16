/**
 * defines an individual particle
 */
export default class Particle {
    p5; // : p5 instance

    pos; // : p5.Vector
    vel; // : p5.Vector
    size;
    color;

    constructor(p5, width, height, size, color, maxVel) {
        this.p5 = p5;
        this.size = size;
        this.color = color;

        // initialize position within the canvas dimensions
        this.pos = p5.createVector(p5.random(width), p5.random(height));
        // initialize velocity with random values
        this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1)).normalize();
        this.vel.mult(p5.random(0.1, maxVel));
    }

    /**
     * update values at each timestep
     */
    step(width, height, steps = 1) {
        for(let i = 0; i < steps; i++) {
            this.pos.add(this.vel);
            this.handleEdgeCollisions(width, height);
        }
    }

    handleEdgeCollisions(width, height) {
        if(this.pos.x < 0 || this.pos.x >= width) {
            this.vel.x *= -1;
            this.pos.x = this.p5.constrain(this.pos.x, 0, width-1);
        }
        if(this.pos.y < 0 || this.pos.y >= height) {
            this.vel.y *= -1;
            this.pos.y = this.p5.constrain(this.pos.y, 0, height-1);
        }
    }

    draw() {
        if(this.size < 1)
            return;

        this.p5.noStroke();
        this.p5.fill(this.color);
        this.p5.circle(this.pos.x, this.pos.y, this.size);
    }
}