import Particle from './Particle.js';

/**
 * manages a collection of particles and overall simulation logic
 */
export default class ParticleSim {
    p5; // : p5 instance

    width;
    height;

    // visuals
    backgroundColor;
    particleColor = '#000000';
    connectColor = '#000000';
    maxParticles = 300;
    particlesPerPixel = 0.00018;
    particleDiameter = 5;
    maxParticleVel = 1;
    connectLineWidth = 2;
    connectMaxRadius = 120;
    doScaleConnectWeight = true;
    doRegenOnWindowResize = false;

    /**
     * idea is to bucket particles into square cells of size connectMaxRadius, 
     * so that searching for neighboring particles only needs to check
     * the current cell and the 8 adjacent cells
     */
    particles = []; // : Particle[]
    grid = []; // : Particle[][][]

    // options is an object that contains all the configurable settings
    constructor(p5, width, height, options) {
        if(!p5) {
            console.error("Pass in a valid p5 instance.");
            return;
        }

        this.p5 = p5;

        this.width = width;
        this.height = height;

        this.backgroundColor = options.backgroundColor ? p5.color(options.backgroundColor) : p5.color('#FFFFFF');
        this.particleColor = options.particleColor ? p5.color(options.particleColor) : p5.color('#000000');
        this.connectColor = options.connectColor ? p5.color(options.connectColor) : p5.color('#000000');
        this.maxParticles = options.maxParticles ?? this.maxParticles;
        this.particlesPerPixel = options.particlesPerPixel ?? this.particlesPerPixel;
        this.particleDiameter = options.particleDiameter ?? this.particleDiameter;
        this.maxParticleVel = options.maxParticleVel ?? this.maxParticleVel;
        this.connectLineWidth = options.connectLineWidth ?? this.connectLineWidth;
        this.connectMaxRadius = options.connectMaxRadius ?? this.connectMaxRadius;
        this.doScaleConnectWeight = options.doScaleConnectWeight ?? this.doScaleConnectWeight;
        this.doRegenOnWindowResize = options.doRegenOnWindowResize ?? this.doRegenOnWindowResize;
    }

    setup() {
        this.generateParticles();
        this.setupGrid();
    }

    generateParticles() {
        this.particles = [];
        const numParticles = Math.min(
            Math.floor(this.width * this.height * this.particlesPerPixel),
            this.maxParticles
        );
        for(let i = 0; i < numParticles; i++) {
            this.particles.push(new Particle(
                this.p5, this.width, this.height, this.particleDiameter, this.particleColor, this.maxParticleVel
            ));
        }
    }

    setupGrid() {
        this.grid = [];
        const gridHeight = Math.ceil(this.height / this.connectMaxRadius);
        const gridWidth = Math.ceil(this.width / this.connectMaxRadius);
        for(let i = 0; i < gridHeight; i++) {
            const rowOfCells = []; 
            for(let j = 0; j < gridWidth; j++) {
                rowOfCells.push([]); 
            }
            this.grid.push(rowOfCells); 
        }
    }

    draw() {
        this.p5.background(this.backgroundColor);

        // reset grid
        for(let i = 0; i < this.grid.length; i++) {  // height
            for(let j = 0; j < this.grid[0].length; j++) {  // width
                this.grid[i][j] = [];
            }
        }

        for(const particle of this.particles) {
            // repopulate grid
            const cellX = Math.floor(particle.pos.x / this.connectMaxRadius);
            const cellY = Math.floor(particle.pos.y / this.connectMaxRadius);
            // edge case of particle being out of bounds when window is shrunk
            if(!this.inGridBounds(cellX, cellY)) {
                continue;
            }
            this.grid[cellY][cellX].push(particle);

            // draw edges
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (this.inGridBounds(cellX+dx, cellY+dy)) {
                        for (const neighbor of this.grid[cellY+dy][cellX+dx]) {
                            const dist = this.p5.dist(particle.pos.x, particle.pos.y, neighbor.pos.x, neighbor.pos.y);
                            if (dist <= this.connectMaxRadius) {
                                // make points closer be more solid
                                if(this.doScaleConnectWeight) {
                                    const alpha = (this.connectMaxRadius - dist) / this.connectMaxRadius;
                                    this.connectColor.setAlpha(alpha * 255);
                                }
                                
                                this.p5.stroke(this.connectColor);
                                this.p5.strokeWeight(this.connectLineWidth);
                                this.p5.line(particle.pos.x, particle.pos.y, neighbor.pos.x, neighbor.pos.y);
                            }
                        }
                    }
                }
            }

            // step
            particle.draw();
            particle.step(this.width, this.height);
        }
    }

    inGridBounds(x, y) {
        return x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length;
    }

    resize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.setupGrid();

        // assume p5 canvas has already been resized
        if(this.doRegenOnWindowResize) {
            this.generateParticles();
        }
    }
}