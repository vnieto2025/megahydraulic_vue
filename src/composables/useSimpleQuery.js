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

        // Solo la llamada a mutationFn está dentro del try: si un callback
        // (onSuccess/onSettled) lanza un error, NO debe hacerse pasar por una
        // falla de la mutación (el guardado ya se hizo). Igual que TanStack.
        let result;
        let failure = null;
        try {
            result = await mutationFn(variables);
        } catch (err) {
            failure = err;
        }

        const runCallback = (fn, ...args) => {
            try { fn?.(...args); } catch (cbErr) { console.error('[useMutation] error en callback:', cbErr); }
        };

        error.value = failure;
        if (failure) {
            runCallback(baseOnError, failure, variables);
            runCallback(callOptions.onError, failure, variables);
            runCallback(baseOnSettled, undefined, failure, variables);
            runCallback(callOptions.onSettled, undefined, failure, variables);
        } else {
            runCallback(baseOnSuccess, result, variables);
            runCallback(callOptions.onSuccess, result, variables);
            runCallback(baseOnSettled, result, null, variables);
            runCallback(callOptions.onSettled, result, null, variables);
        }

        isPending.value = false;
        return failure ? undefined : result;
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
    // En este reemplazo no hay caché real, así que refetchQueries e
    // invalidateQueries hacen lo mismo: volver a pedir las queries activas
    // cuya key empiece con el prefijo dado.
    refetchQueries({ queryKey }) {
        this.invalidateQueries({ queryKey });
    },
};

export function useQueryClient() {
    return client;
}
