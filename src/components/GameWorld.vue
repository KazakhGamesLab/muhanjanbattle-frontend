<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useGameWorld } from '@/composables/world/index.js'

const gameWorld = useGameWorld();
const canvasRef = ref(null);
const canvasOverlay = ref(null);

onMounted(() => {
  if (canvasRef.value && canvasOverlay.value) {
    gameWorld.InitWorld(canvasRef.value, canvasOverlay.value)
    gameWorld.state.tileStream.start();
  }
});

onUnmounted(() => {
  gameWorld.state.tileStream.stop();
  gameWorld.destroy()
});

defineExpose({ gameWorld });
</script>

<template>
  <div class="game-canvas-container">
    <canvas
      ref="canvasRef"
      class="canvas-main"
    ></canvas>

    <canvas
      ref="canvasOverlay"
      class="canvas-overlay"
    ></canvas>
  </div>
</template>

<style scoped>
.game-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas-main,
.canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.canvas-main {
  z-index: 1;
}

.canvas-overlay {
  z-index: 2;
  pointer-events: none; /* чтобы мышка шла к нижнему canvas */
}
</style>
