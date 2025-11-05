<script setup>
import { onMounted, computed } from 'vue';
import '@/assets/editor/main.css';
import { useEditor } from '@/composables/editor/editor.js';


const { state, selectTool, startUpdateLoop } = useEditor();


const props = defineProps({
  gameWorld: {
    type: Object,
    required: true,
  },
});

const camera = computed(() => {
  return props.gameWorld.state.camera;
});


onMounted(() => {
  startUpdateLoop();
});

</script>

<template>
  <div class="container-fluid">
    <div class="row d-flex justify-content-center text-center">
      <div
        v-for="tool in state.tools"
        :key="tool.name"
        class="col-2 col-sm-1 col-md-1 col-lg-1"
      >
        <img
          :src="tool.icon"
          width="50"
          class="icon-top p-2"
          :class="{ 'icon-selected': state.selectedTool === tool.name }"
          @click="selectTool(tool.name)"
          :alt="tool.label"
        />
      </div>
    </div>
  </div>
</template>