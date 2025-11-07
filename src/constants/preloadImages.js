const imageModules = import.meta.glob('@/assets/tiles/*.png', { eager: true });

export const images = {};
export const imageUrls = {}; // ← ← ← Добавляем отдельный объект для URL

Object.entries(imageModules).forEach(([path, module]) => {
    const name = path.split('/').pop().replace('.png', '');
    const img = new Image();
    img.src = module.default;
    images[name] = img;             // Для drawImage
    imageUrls[name] = module.default; // ← ← ← Для использования в DOM
});