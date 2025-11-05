<script setup>
import LevelEditor from '@/components/LevelEditor.vue'
import GameWorld from '@/components/GameWorld.vue'
</script>

<template>
  <div class="game-container">
    <GameWorld />
    <LevelEditor class="level-editor-panel" />
  </div>
</template>

<style scoped>
.game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.level-editor-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
</style>