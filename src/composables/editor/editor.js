import { reactive, readonly, onScopeDispose } from 'vue';
import castleIcon from '@/assets/editor/icons/castle.png';
import tsunami from '@/assets/editor/icons/tsunami.png';
import { imageUrls } from '../../constants/preloadImages';
import { Tile } from '../entities/tile.js';
import { useApi } from '../api/useApi.js';

let animationFrameId = null;

export function useEditor() {

  const tools = [
    { name: 'castle', icon: castleIcon, label: 'Замок', type: 'struct' },
    { name: 'tsunami', icon: tsunami, label: 'Цунами', type: 'weather' },
    { name: 'water_1', icon: imageUrls['water_1'], label: 'Вода нижний уровень', type: 'tile_water'},
    { name: 'water_2', icon: imageUrls['water_2'], label: 'Вода верхний уровень', type: 'tile_water'},
    { name: 'sand_1', icon: imageUrls['sand_1'], label: 'Песок', type: 'tile_earth'},
    { name: 'earth_1', icon: imageUrls['earth_1'], label: 'Земля', type: 'tile_earth'},
    { name: 'background', icon: imageUrls['background'], label: 'Задник', type: 'background'},
  ];

  const getTypeByName = (name) => {
      const tool = tools.find(tool => tool.name === name);
      return tool ? tool.type : null;
  };

  const state = reactive({
    selectedTool: null,
    tools,
    gameWorld : null,
    tempCoord: {x : 0, y: 0},
    isMouseDown: false, 
    api : useApi()
  });

  const selectTool = (toolName) => {
    if (state.selectedTool === toolName) {
      state.selectedTool = null;
      state.tempCoord = { x:0, y:0 };
      state.gameWorld?.clearOverlayEditor();
    } else {
      state.selectedTool = toolName;
    }
  };

  const update = () => {
    if (!state.selectedTool) {
         animationFrameId = requestAnimationFrame(update);
        return;
    }

    state.tempCoord = state.gameWorld.prewiewEditor(state.selectedTool);
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

  const handleClick = (worldCoords) => {
      if (state.selectedTool && state.gameWorld) {
          //state.gameWorld.state.camera.removeEventListeners();
          let tile = new Tile(
            state.tempCoord.x, 
            state.tempCoord.y, 
            imageUrls[state.selectedTool], 
            state.selectedTool,
            getTypeByName(state.selectedTool)
          )

          state.api.addTile(tile).catch(err => {
            console.error('Не удалось добавить тайл:', err);
          });
      }
  };

  const handleMouseDown = (worldCoords) => {
      if (state.selectedTool && state.gameWorld) {
          state.isMouseDown = true;
          //state.gameWorld.addTile(state.selectedTool, worldCoords);
      }
  };

  const handleMouseUp = () => {
      if (state.isMouseDown) {
          state.isMouseDown = false;
      }
  };

  const handleMouseMove = (worldCoords) => {
      if (state.isMouseDown && state.selectedTool && state.gameWorld) {
          //state.gameWorld.addTile(state.selectedTool, worldCoords);
      }
  };

  const setupMouseHandlers = () => {
      if (!state.gameWorld?.state?.canvas) return;

      const canvas = state.gameWorld.state.canvas;
      const camera = state.gameWorld.state.camera;

      const getWorldCoords = (e) => {
          const rect = canvas.getBoundingClientRect();
          return camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
      };

      const onMouseDown = (e) => handleMouseDown(getWorldCoords(e));
      const onMouseUp = () => handleMouseUp();
      const onMouseMove = (e) => handleMouseMove(getWorldCoords(e));
      const onClick = (e) => handleClick(getWorldCoords(e));

      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('click', onClick);
      canvas.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      return () => {
          canvas.removeEventListener('mousedown', onMouseDown);
          canvas.removeEventListener('click', onClick);
          canvas.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
      };
  };

  onScopeDispose(() => {
    stopUpdateLoop();
  });

  return {
    state,
    selectTool,
    startUpdateLoop,
    stopUpdateLoop,
    setupMouseHandlers,
  };
}