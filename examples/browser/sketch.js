import ParticleSim from '../../dist/connected-particles-p5.esm.min.js';

/**
 *  available options:
 * 
 *  const options = {
 *      backgroundColor: ,
 *      particleColor: ,
 *      connectColor: ,
 *      maxParticles: ,
 *      particlesPerPixel: ,
 *      particleDiameter: ,
 *      connectLineWidth: ,
 *      connectMaxRadius: ,
 *      doScaleConnectWeight: ,
 *      doRegenOnWindowResize: ,
 *  };
 */
const options = {
    backgroundColor: '#57B9FF',
    particleColor: '#FAC898',
    connectColor: '#FAC898',
    particleDiameter: 0,
    doRegenOnWindowResize: true,
};

// p: p5 object
const sketch = (p) => {
    let particleSim;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(document.querySelector('main'));
        particleSim = new ParticleSim(p, p.windowWidth, p.windowHeight, options)
        particleSim.setup();
    };

    p.draw = () => {
        particleSim.draw();
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        particleSim.resize(p.windowWidth, p.windowHeight);
    };
};

new p5(sketch);
