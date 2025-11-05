<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useGameWorld } from '@/composables/world/index.js';


const gameWorld = useGameWorld();

const canvasRef = ref(null);

onMounted(() => {
  if (canvasRef.value) {
    gameWorld.InitWorld(canvasRef.value);
  }
});

onUnmounted(() => {
  gameWorld.destroy();
});

defineExpose({
  gameWorld
});

</script>

<template>
  <canvas
    ref="canvasRef"
    style="display: block; width: 100%; height: 100%;"
  ></canvas>
</template>