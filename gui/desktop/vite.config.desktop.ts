/// <reference types="vite/client" />

import path from 'path';
import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

import type { UserConfigExport } from 'vite';

export default ({ mode }): UserConfigExport => {
    return defineConfig({
        server: { port: 3000, host: '0.0.0.0' },
        plugins: [preact()],
        root: path.resolve('./desktop'),
        base: './',
        build: {
            chunkSizeWarningLimit: 4000,
            outDir: '../../desktop/gui-dist',
            minify: mode === 'production' ? true : false,

            rollupOptions: {
                input: {
                    app: path.resolve('desktop/index.html')
                    // 'sample-processor': path.resolve('src/sample-processor.ts')
                },
                output: {
                    // manualChunks: { app: ['app'], worker: ['worker'] },
                    entryFileNames: `[name].js`,
                    chunkFileNames: `[name].js`,
                    assetFileNames: `[name].[ext]`
                }
            }
        }
    });
};
