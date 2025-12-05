// composables/useGameWorld.js
import { reactive, readonly } from 'vue';
import { useCamera } from './useCamera';
import { images } from '../../constants/preloadImages';
import { useTileStream } from '../api/useTileStream';
import { Tile } from '../entities/tile';

export function useGameWorld() {
    const state = reactive({
        canvas: null,
        canvasOverlay: null,
        ctx: null,
        overlayCtx: null,
        isRunning: false,
        animationFrameId: null,
        camera: null,
        tileStream: useTileStream()
    });

    const resizeCanvas = () => {
        if (!state.canvas) return;
        state.canvas.width = window.innerWidth;
        state.canvas.height = window.innerHeight;

        state.canvasOverlay.width = window.innerWidth;
        state.canvasOverlay.height = window.innerHeight;
    };

    const InitWorld = (canvas, canvasOverlay) => {
        state.canvas = canvas;
        state.ctx = canvas.getContext('2d');
        state.canvas.style.backgroundColor = '#2d64b6';
        state.canvasOverlay = canvasOverlay;
        state.overlayCtx = canvasOverlay.getContext('2d');
        if (!state.ctx) return;

        resizeCanvas();

        state.camera = useCamera(canvas, {
            minZoom: 0.1,
            maxZoom: 5,
            dragToPan: true,
            zoomWithWheel: true,
        });
        state.camera.setupEventListeners();

        window.addEventListener('resize', resizeCanvas);

        state.isRunning = true;
        gameLoop();
    };

    const update = () => {
    };

    const draw = () => {
        if (!state.ctx || !state.canvas || !state.camera) return;
        const ctx = state.ctx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        state.camera.applyTransform(ctx);

        // отрисовка
        /** @type {Tile[]} */
        state.tileStream.tiles.forEach(/** @param {Tile} tile */ tile => {
            tile.draw(ctx);
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0); 
    };

    const prewiewEditor = (tool, size, worldCoords = state.camera.getMouseWorld()) => {
        if (!state.ctx || !state.canvas || !state.camera || !images[tool]) return;
        const ctx = state.overlayCtx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

        state.camera.applyTransform(ctx);

        let gridSize = 0;

        if (size == 'small'){
            gridSize = 4;
        }

        if (size == 'normal') {
            gridSize = 8;
        }

        if (size == 'big') 
        {
            gridSize = 32;
        }

        const snappedX = Math.round(worldCoords.x / gridSize) * gridSize;
        const snappedY = Math.round(worldCoords.y / gridSize) * gridSize;

        ctx.drawImage(
            images[tool],
            snappedX - images[tool].width / 2,
            snappedY - images[tool].height / 2,
            images[tool].width,
            images[tool].height 
        );

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        return {x: snappedX, y: snappedY}
    };

    const clearOverlayEditor = () =>{
        if (!state.ctx || !state.canvas || !state.camera) return;
        const ctx = state.overlayCtx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }

    const gameLoop = () => {
        if (!state.isRunning) return;
        update();
        draw();
        state.animationFrameId = requestAnimationFrame(gameLoop);
    };

    const destroy = () => {
        state.isRunning = false;
        if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
        }
        if (state.camera) {
            state.camera.removeEventListeners();
        }
        window.removeEventListener('resize', resizeCanvas);
    };

    return {
        state,
        InitWorld,
        destroy,
        prewiewEditor,
        clearOverlayEditor,
    };
}