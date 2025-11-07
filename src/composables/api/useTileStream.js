import { ref, readonly, onUnmounted } from 'vue';
import { Tile } from '../entities/tile';
import { useApi } from '@/composables/api/useApi.js';
import { API_URL } from '../../constants/consts';

export function useTileStream() {
  const tiles = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const api = useApi();
  let eventSource = null;

  // 🧩 Первичная загрузка всех тайлов из API (кэш Redis)
  const fetchInitialTiles = async () => {
    loading.value = true;
    try {
      const data = await api.getTiles(); // без since
      tiles.value = Array.isArray(data)
        ? data.map(tile => Tile.fromJSON(tile))
        : [];
    } catch (err) {
      console.error('Ошибка загрузки тайлов:', err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // 🔥 Инициализация SSE-потока
  const initStream = () => {
    if (eventSource) eventSource.close();

    eventSource = new EventSource(`${API_URL}/tiles-stream`);
    console.log('[SSE] Подключение к потоку тайлов...');

    eventSource.addEventListener('open', () => {
      console.log('[SSE] Соединение установлено');
    });

    eventSource.addEventListener('tile_update', e => {
      try {
        const newTile = JSON.parse(e.data);
        const idx = tiles.value.findIndex(
          t => t.x === newTile.x && t.y === newTile.y
        );
        if (idx >= 0) {
          tiles.value[idx] = Tile.fromJSON(newTile);
        } else {
          tiles.value.push(Tile.fromJSON(newTile));
        }
      } catch (err) {
        console.error('[SSE] Ошибка парсинга события:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('[SSE] Ошибка соединения:', err);
      if (eventSource.readyState === EventSource.CLOSED) {
        console.warn('[SSE] Соединение закрыто, переподключение...');
        reconnect();
      }
    };
  };

  // 🔁 Автоматическое переподключение SSE
  const reconnect = () => {
    if (eventSource) eventSource.close();
    setTimeout(initStream, 3000); // попытка переподключения через 3с
  };

  const start = async () => {
    await fetchInitialTiles();
    initStream();
  };

  const stop = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };

  onUnmounted(stop);

  return {
    tiles: readonly(tiles),
    loading: readonly(loading),
    error: readonly(error),
    start,
    stop,
  };
}
