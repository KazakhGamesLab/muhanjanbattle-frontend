<script setup>
import { onMounted } from 'vue';
import { useGameWorld } from '@/composables/world/index.js';

const { InitWorld } = useGameWorld();

onMounted(() => {
    InitWorld(document.getElementById("world"));
  });
</script>

<template>
    <canvas id="world"></canvas>
</template>
