// composables/useCamera.js
import { reactive, onMounted, onUnmounted } from 'vue';

/**
 * 2D Camera для canvas с поддержкой панорамирования и зума.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} options
 * @param {number} [options.minZoom=0.1]
 * @param {number} [options.maxZoom=5]
 * @param {boolean} [options.dragToPan=true]
 * @param {boolean} [options.zoomWithWheel=true]
 */
export function useCamera(canvas, options = {}) {
    const {
        minZoom = 0.1,
        maxZoom = 5,
        dragToPan = true,
        zoomWithWheel = true,
    } = options;

    const state = reactive({
        x: 0,           // Позиция камеры в мировых координатах (левый верхний угол видимой области)
        y: 0,
        scale: 1,       // Масштаб (1 = 1:1, >1 = зум, <1 = отдаление)
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        lastMouseWorld: { x: 0, y: 0 },
        mouseScreen: { x: 0, y: 0 },
    });


    // Преобразование: экранные → мировые координаты
    const screenToWorld = (screenX, screenY) => {
        return {
            x: state.x + screenX / state.scale,
            y: state.y + screenY / state.scale,
        };
    };

    // Преобразование: мировые → экранные координаты
    const worldToScreen = (worldX, worldY) => {
        return {
            x: (worldX - state.x) * state.scale,
            y: (worldY - state.y) * state.scale,
        };
    };

    const getMouseWorld = () => {
        return screenToWorld(state.mouseScreen.x, state.mouseScreen.y);
    };

    const getMouseScreen = () => {
        return { ...state.mouseScreen };
    };

    // Обновление позиции мыши
    const onMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        state.mouseScreen.x = e.clientX - rect.left;
        state.mouseScreen.y = e.clientY - rect.top;
        state.lastMouseWorld = screenToWorld(state.mouseScreen.x, state.mouseScreen.y);
    };

    // Начало перетаскивания
    const onMouseDown = (e) => {
        if (!dragToPan) return;
        state.isDragging = true;
        state.dragStart.x = e.clientX - canvas.getBoundingClientRect().left;
        state.dragStart.y = e.clientY - canvas.getBoundingClientRect().top;
        canvas.style.cursor = 'grabbing';
    };

    // Завершение перетаскивания
    const onMouseUp = () => {
        if (!dragToPan) return;
        state.isDragging = false;
        canvas.style.cursor = 'default';
    };

    // Перемещение при перетаскивании
    const onMouseDrag = (e) => {
        if (!state.isDragging || !dragToPan) return;
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const deltaX = (currentX - state.dragStart.x) / state.scale;
        const deltaY = (currentY - state.dragStart.y) / state.scale;

        state.x -= deltaX;
        state.y -= deltaY;

        // Обновляем стартовую точку для плавности
        state.dragStart.x = currentX;
        state.dragStart.y = currentY;
    };

    // Зум с учётом позиции мыши (фиксация под курсором)
    const onWheel = (e) => {
        if (!zoomWithWheel) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldPointBefore = screenToWorld(mouseX, mouseY);

        const wheelDelta = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        state.scale = Math.max(minZoom, Math.min(maxZoom, state.scale * wheelDelta));

        const worldPointAfter = screenToWorld(mouseX, mouseY);

        // Смещаем камеру, чтобы точка под курсором осталась на месте
        state.x += (worldPointAfter.x - worldPointBefore.x);
        state.y += (worldPointAfter.y - worldPointBefore.y);
    };

    // Применение трансформации к контексту canvas перед отрисовкой
    const applyTransform = (ctx) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Сброс
        ctx.translate(
            Math.round(-state.x * state.scale), // Округляем до целых
            Math.round(-state.y * state.scale)  // Округляем до целых
        );
        ctx.scale(state.scale, state.scale);

        // Отключить сглаживание (для чётких пикселей)
        ctx.imageSmoothingEnabled = false;
    };

    // Установка обработчиков
    const setupEventListeners = () => {
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp); // на window — на случай, если курсор выйдет за пределы canvas
        canvas.addEventListener('mousemove', onMouseDrag);
        canvas.addEventListener('wheel', onWheel, { passive: false });
    };

    const removeEventListeners = () => {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseDrag);
        canvas.removeEventListener('wheel', onWheel);
    };

    // Публичный API
    const api = reactive({
        ...state,
        screenToWorld,
        worldToScreen,
        getMouseWorld,
        getMouseScreen,
        applyTransform,
        setupEventListeners,
        removeEventListeners,
    });

    return api;
}