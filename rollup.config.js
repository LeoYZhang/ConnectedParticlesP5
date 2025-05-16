import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const outputFileNameBase = 'connected-particles-p5';
const umdGlobalName = 'ConnectedParticlesP5';
const inputFilePath = 'src/particleSim.js';

const commonOutputOptions = {
    sourcemap: true,
};

export default {
    input: inputFilePath,
    external: ['p5'],
    plugins: [resolve()],
    output: [
        {
            file: `dist/${outputFileNameBase}.esm.js`,
            format: 'es',
            ...commonOutputOptions,
        },
        {
            file: `dist/${outputFileNameBase}.esm.min.js`,
            format: 'es',
            ...commonOutputOptions,
            plugins: [terser()],
        },
        {
            file: `dist/${outputFileNameBase}.umd.js`,
            format: 'umd',
            name: umdGlobalName,
            ...commonOutputOptions,
        },
        {
            file: `dist/${outputFileNameBase}.umd.min.js`,
            format: 'umd',
            name: umdGlobalName,
            ...commonOutputOptions,
            plugins: [terser()],
        }
    ]
};