<script setup>
import { onMounted,onUnmounted, computed } from 'vue';
import '@/assets/editor/main.css';
import { useEditor } from '@/composables/editor/editor.js';


const { state, selectTool, startUpdateLoop, setupMouseHandlers } = useEditor();

const props = defineProps({
  gameWorld: {
    type: Object,
    required: true,
  },
});
let removeMouseHandlers = null;

onMounted(() => {
  state.gameWorld = props.gameWorld;
  removeMouseHandlers = setupMouseHandlers();
  startUpdateLoop();
});

onUnmounted(() => {
  if (removeMouseHandlers) removeMouseHandlers();
});

const groupedTools = computed(() => {
  const groups = {}
  for (const tool of state.tools) {
    if (!groups[tool.type]) groups[tool.type] = []
    groups[tool.type].push(tool)
  }
  return groups
})
</script>

<template>
  
  <div class="tools-container">
    
    <div
      v-for="(tools, type) in groupedTools"
      :key="type"
      class="tool-column"
    >
      <div class="tool-column-inner">
        <div
          v-for="tool in tools"
          :key="tool.name"
          :class="[
            'tool-item',
            tool.type, // динамический класс
            { selected: state.selectedTool === tool.name }
          ]"
          @click="selectTool(tool.name)"
        >
          <img :src="tool.icon" :alt="tool.label" />
        </div>
      </div>
    </div>
  </div>
</template>