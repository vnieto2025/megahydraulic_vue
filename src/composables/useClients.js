import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { clientsApi } from '../api/clients.js';

/**
 * Query para listar clientes con paginación.
 * El queryKey incluye limit y position para cachear cada página.
 */
export function useClientList(limit, position) {
    return useQuery({
        queryKey: ['clients', 'list', limit, position],
        queryFn: () => clientsApi.list(limit.value, position.value).then(r => r.data.data),
        keepPreviousData: true,
    });
}

/**
 * Query para obtener un cliente por ID.
 */
export function useClient(clientId) {
    return useQuery({
        queryKey: ['clients', 'detail', clientId],
        queryFn: () => clientsApi.get(clientId.value ?? clientId).then(r => r.data.data),
        enabled: !!(clientId?.value ?? clientId),
    });
}

/**
 * Mutación para crear un cliente.
 * Invalida el listado automáticamente al tener éxito.
 */
export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => clientsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
        },
    });
}

/**
 * Mutación para actualizar un cliente (nombre, estado, líneas, personas).
 */
export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => clientsApi.update(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['clients', 'list'] });
            if (variables.client_id) {
                queryClient.invalidateQueries({ queryKey: ['clients', 'detail', variables.client_id] });
            }
            // También invalida la lista de params de clientes usada en los selects
            queryClient.invalidateQueries({ queryKey: ['params', 'clients'] });
        },
    });
}

/**
 * Mutación para agregar líneas/personas a un cliente.
 */
export function useAddLinePerson() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => clientsApi.addLinePerson(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['params', 'clients'] });
            if (variables.client_id) {
                queryClient.invalidateQueries({ queryKey: ['params', 'lines', variables.client_id] });
                queryClient.invalidateQueries({ queryKey: ['params', 'users-by-client', variables.client_id] });
                queryClient.invalidateQueries({ queryKey: ['clients', 'detail', variables.client_id] });
            }
        },
    });
}
