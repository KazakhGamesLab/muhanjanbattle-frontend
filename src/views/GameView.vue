<script setup>
import GameWorld from '@/components/GameWorld.vue'
</script>



<template>
    <div class="game-container">
      <GameWorld />
    </div>
  </template>
  
  <style scoped>
  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  </style>