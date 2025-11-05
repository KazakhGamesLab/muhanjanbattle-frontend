// composables/useGameWorld.js
import { reactive, readonly } from 'vue';
import { useCamera } from './useCamera';

export function useGameWorld() {
    const state = reactive({
        canvas: null,
        ctx: null,
        isRunning: false,
        animationFrameId: null,
        camera: null,
    });

    const resizeCanvas = () => {
        if (!state.canvas) return;
        state.canvas.width = window.innerWidth;
        state.canvas.height = window.innerHeight;
    };

    const InitWorld = (canvas) => {
        state.canvas = canvas;
        state.ctx = canvas.getContext('2d');
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
        // логика обновления (позже)
    };

    const draw = () => {
        if (!state.ctx || !state.canvas || !state.camera) return;
        const ctx = state.ctx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

        state.camera.applyTransform(ctx);

        ctx.fillStyle = '#3498db';
        ctx.fillRect(300, 300, 20, 20);

        ctx.setTransform(1, 0, 0, 1, 0, 0); 
    };

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
    };
}