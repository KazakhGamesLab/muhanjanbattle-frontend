import { reactive, onMounted, computed } from 'vue';
import { useCamera } from './useCamera';

export function useGameWorld() {
    const alerts = reactive({
        canvas: null,
        ctx: null,
        isRunning: false,
        animationFrameId: null,
        camera: null,
    });

    const resizeCanvas = () => {
        if (!alerts.canvas) return;

        alerts.canvas.width = window.innerWidth - 15;
        alerts.canvas.height = window.innerHeight - 15;
    };

    /**
     * @param {HTMLElement} canvas
     */
    const InitWorld = (canvas) => {
        alerts.canvas = canvas;
        alerts.ctx = canvas.getContext('2d');

        if (!alerts.ctx) return;

        resizeCanvas();

        alerts.camera = useCamera(canvas, {
            minZoom: 0.2,
            maxZoom: 4,
            dragToPan: true,
            zoomWithWheel: true,
        });
        alerts.camera.setupEventListeners();

        window.addEventListener('resize', resizeCanvas);

        alerts.isRunning = true;
        gameLoop();
    };

    const update = () => {
    };

    const draw = () => {
        if (!alerts.ctx || !alerts.canvas || !alerts.camera) return;

        const ctx = alerts.ctx;
        ctx.clearRect(0, 0, alerts.canvas.width, alerts.canvas.height);

        // Применяем трансформацию камеры
        alerts.camera.applyTransform(ctx);

        // Теперь рисуем в мировых координатах!
        const size = 20;
        const x = 300;
        const y = 300;

        ctx.fillStyle = '#3498db';
        ctx.fillRect(x, y, size, size);

        // Возврат к исходной системе координат (для UI, если понадобится)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const gameLoop = () => {
        if (!alerts.isRunning) return;

        update();
        draw();

        alerts.animationFrameId = requestAnimationFrame(gameLoop);
    };

    const destroy = () => {
        alerts.isRunning = false;
        if (alerts.animationFrameId) {
            cancelAnimationFrame(alerts.animationFrameId);
        }
        if (alerts.camera) {
            alerts.camera.removeEventListeners();
        }
        window.removeEventListener('resize', resizeCanvas);
    };

    const getCamera = () => alerts.camera;

    return { InitWorld, destroy, getCamera };
}