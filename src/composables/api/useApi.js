import { ref, readonly } from 'vue';
import { API_URL } from '../../constants/consts';
import { Tile } from '../entities/tile.js';


export function useApi() {
    const loading = ref(false);
    const error = ref(null);

    const request = async (url, options = {}) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            error.value = err.message;
            console.error('API Error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * 
     * @param { Tile } tile 
     * @returns 
     */
    const addTile = async (tile) => {
        return request( API_URL + '/tiles', {
            method: 'POST',
            body: JSON.stringify(tile.toJSON()),
        });
    };

    const getTiles = async (since = null) => {
        const url = since
            ? API_URL + `/tiles?since=${encodeURIComponent(since)}`
            : API_URL + '/tiles';

        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    };

    return {
        loading: readonly(loading),
        error: readonly(error),
        addTile,
        getTiles,
    };
}