import { reactive, readonly, onScopeDispose } from 'vue';
import castleIcon from '@/assets/editor/icons/castle.png';
import tsunami from '@/assets/editor/icons/tsunami.png';

let animationFrameId = null;

export function useEditor() {

const tools = [
    { name: 'castle', icon: castleIcon, label: 'Замок', type: 'struct' },
    { name: 'tsunami', icon: tsunami, label: 'Цунами', type: 'weather' },
    { name: 'tsu23nami', icon: tsunami, label: 'Цунами', type: 'weather' },
    { name: 'tsun43ami', icon: tsunami, label: 'Цунами', type: 'weather' },
  ];

  const state = reactive({
    selectedTool: null,
    tools,
    gameWorld : null
  });

  const selectTool = (toolName) => {
    if (state.selectedTool === toolName) {
      state.selectedTool = null;
      state.gameWorld.clearOverlayEditor();
    } else {
      state.selectedTool = toolName;
    }
  };

  const update = () => {
    if (!state.selectedTool) {
         animationFrameId = requestAnimationFrame(update);
        return;
    }

    state.gameWorld.prewiewEditor('asd', state.gameWorld.state.camera.getMouseWorld());

    animationFrameId = requestAnimationFrame(update);
  };

  const startUpdateLoop = () => {
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(update);
    }
  };

  const stopUpdateLoop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  onScopeDispose(() => {
    stopUpdateLoop();
  });

  return {
    state,
    selectTool,
    startUpdateLoop,
    stopUpdateLoop,
  };
}