/**
 * Reemplazo mínimo de @tanstack/vue-query, hecho a medida para el subconjunto
 * de la API que usa esta app: useQuery (con queryKey reactiva, enabled,
 * keepPreviousData), useMutation (con onSuccess/onError/onSettled tanto a
 * nivel del composable como del sitio de la llamada) y useQueryClient().
 * invalidateQueries({queryKey}) con coincidencia por prefijo.
 *
 * No reimplementa un caché real entre componentes ni `staleTime` (nada en
 * el código actual depende de eso) — cada useQuery hace su propio fetch y
 * se puede refrescar bajo demanda vía refetch()/invalidateQueries().
 */
import { ref, computed, watch, unref, onUnmounted } from 'vue';

function deepUnref(value) {
    if (value && value.__v_isRef) return deepUnref(value.value);
    if (Array.isArray(value)) return value.map(deepUnref);
    if (value && typeof value === 'object' && value.constructor === Object) {
        const out = {};
        for (const key in value) out[key] = deepUnref(value[key]);
        return out;
    }
    return value;
}

function keyStartsWith(activeKey, prefix) {
    if (!Array.isArray(activeKey) || !Array.isArray(prefix)) return false;
    if (prefix.length > activeKey.length) return false;
    return prefix.every((seg, i) => JSON.stringify(seg) === JSON.stringify(activeKey[i]));
}

// Registro global de queries activas, para poder invalidarlas por prefijo de key.
const registry = new Set();

export function useQuery(options) {
    const { queryKey, queryFn, enabled = true, keepPreviousData = false } = options;

    const data = ref(undefined);
    const error = ref(null);
    const isFetching = ref(false);
    const isLoading = ref(false);
    const isError = computed(() => !!error.value);

    const keyRef = computed(() => deepUnref(unref(queryKey)));
    const enabledRef = computed(() => unref(enabled));

    let requestId = 0;

    async function fetch() {
        if (!enabledRef.value) return;
        const myId = ++requestId;

        if (!keepPreviousData) data.value = undefined;
        if (data.value === undefined) isLoading.value = true;
        isFetching.value = true;

        try {
            const result = await queryFn();
            if (myId !== requestId) return;
            data.value = result;
            error.value = null;
        } catch (err) {
            if (myId !== requestId) return;
            error.value = err;
        } finally {
            if (myId === requestId) {
                isFetching.value = false;
                isLoading.value = false;
            }
        }
    }

    watch([keyRef, enabledRef], fetch, { immediate: true, deep: true });

    const entry = { keyFn: () => keyRef.value, refetch: fetch };
    registry.add(entry);
    onUnmounted(() => registry.delete(entry));

    return {
        data,
        error,
        isError,
        isLoading,
        isPending: isLoading,
        isFetching,
        refetch: fetch,
    };
}

export function useMutation(options = {}) {
    const { mutationFn, onSuccess: baseOnSuccess, onError: baseOnError, onSettled: baseOnSettled } = options;

    const isPending = ref(false);
    const error = ref(null);

    async function mutate(variables, callOptions = {}) {
        isPending.value = true;
        try {
            const result = await mutationFn(variables);
            error.value = null;
            baseOnSuccess?.(result, variables);
            callOptions.onSuccess?.(result, variables);
            baseOnSettled?.(result, null, variables);
            callOptions.onSettled?.(result, null, variables);
            return result;
        } catch (err) {
            error.value = err;
            baseOnError?.(err, variables);
            callOptions.onError?.(err, variables);
            baseOnSettled?.(undefined, err, variables);
            callOptions.onSettled?.(undefined, err, variables);
            return undefined;
        } finally {
            isPending.value = false;
        }
    }

    return {
        mutate,
        isPending,
        isLoading: isPending,
        error,
    };
}

const client = {
    invalidateQueries({ queryKey }) {
        for (const entry of registry) {
            if (keyStartsWith(entry.keyFn(), queryKey)) entry.refetch();
        }
    },
};

export function useQueryClient() {
    return client;
}
