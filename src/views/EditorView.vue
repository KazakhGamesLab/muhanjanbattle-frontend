<script setup>
import { onMounted, onUnmounted, computed, ref, watch } from 'vue';
import LevelEditor from '@/components/LevelEditor.vue'
import GameWorld from '@/components/GameWorld.vue'

const gameWorldComponentRef = ref(null);

const gameWorldLogic = computed(() => {
  return gameWorldComponentRef.value?.gameWorld ?? null;
});


</script>

<template>
  <div class="game-container">
    <GameWorld ref="gameWorldComponentRef" />
    <LevelEditor
      v-if="gameWorldLogic"
      :game-world="gameWorldLogic"
      class="level-editor-panel"
    />
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