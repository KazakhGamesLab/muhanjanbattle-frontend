import { reactive, readonly, onScopeDispose } from 'vue';
import castleIcon from '@/assets/editor/icons/castle.png';
import treeIcon from '@/assets/editor/icons/castle.png';
import rockIcon from '@/assets/editor/icons/castle.png';

let animationFrameId = null;

export function useEditor() {

const tools = [
    { name: 'castle', icon: castleIcon, label: 'Замок' },
    { name: 'tree', icon: treeIcon, label: 'Дерево' },
    { name: 'rock', icon: rockIcon, label: 'Камень' },
    ];

  const state = reactive({
    selectedTool: null,
    tools,
  });

  const selectTool = (toolName) => {
    if (state.selectedTool === toolName) {
      state.selectedTool = null;
    } else {
      state.selectedTool = toolName;
    }
  };

  const update = () => {
    if (!state.selectedTool) {
         animationFrameId = requestAnimationFrame(update);
        return;
    }

    console.log('Editor update tick');

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
    state: readonly(state),
    selectTool,
    startUpdateLoop,
    stopUpdateLoop,
  };
}