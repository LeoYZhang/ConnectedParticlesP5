import p5 from 'p5';

export interface ParticleSimOptions {
    backgroundColor?: string;
    particleColor?: string;
    connectColor?: string;
    maxParticles?: number;
    particlesPerPixel?: number;
    particleDiameter?: number;
    maxParticleVel?: number;
    connectLineWidth?: number;
    connectMaxRadius?: number;
    doScaleConnectWeight?: boolean;
    doRegenOnWindowResize?: boolean;
}

export default class ParticleSim {
    constructor(p5Instance: p5, width: number, height: number, options?: ParticleSimOptions);
    setup(): void;
    draw(): void;
    resize(newWidth: number, newHeight: number): void;
}