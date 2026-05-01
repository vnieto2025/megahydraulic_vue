/**
 * Composables TanStack Query para datos de referencia (params).
 * Usan staleTime alto porque son datos casi estáticos.
 * Se cachean automáticamente y se comparten entre todas las vistas que los usen.
 */
import { useQuery } from '@tanstack/vue-query';
import { paramsApi } from '../api/params.js';

const STALE_5MIN = 5 * 60 * 1000;
const STALE_INFINITE = Infinity;

export function useParamClients() {
    return useQuery({
        queryKey: ['params', 'clients'],
        queryFn: () => paramsApi.getClients().then(r => r.data.data || []),
        staleTime: STALE_5MIN,
    });
}

export function useParamLinesByClient(clientId) {
    return useQuery({
        queryKey: ['params', 'lines', clientId],
        queryFn: () => paramsApi.getLinesByClient(clientId.value ?? clientId).then(r => r.data.data || []),
        enabled: !!(clientId?.value ?? clientId),
        staleTime: STALE_5MIN,
    });
}

export function useParamUsersByClient(clientId) {
    return useQuery({
        queryKey: ['params', 'users-by-client', clientId],
        queryFn: () => paramsApi.getUsersByClient(clientId.value ?? clientId).then(r => r.data.data || []),
        enabled: !!(clientId?.value ?? clientId),
        staleTime: STALE_5MIN,
    });
}

export function useParamTypeService() {
    return useQuery({
        queryKey: ['params', 'type-service'],
        queryFn: () => paramsApi.getTypeService().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamTypeEquipments() {
    return useQuery({
        queryKey: ['params', 'type-equipments'],
        queryFn: () => paramsApi.getTypeEquipments().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamTypeDocument() {
    return useQuery({
        queryKey: ['params', 'type-document'],
        queryFn: () => paramsApi.getTypeDocument().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamTypeUser() {
    return useQuery({
        queryKey: ['params', 'type-user'],
        queryFn: () => paramsApi.getTypeUser().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamServiceStatuses() {
    return useQuery({
        queryKey: ['params', 'service-statuses'],
        queryFn: () => paramsApi.getServiceStatuses().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamReportStatuses() {
    return useQuery({
        queryKey: ['params', 'report-statuses'],
        queryFn: () => paramsApi.getReportStatuses().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamComponents() {
    return useQuery({
        queryKey: ['params', 'components'],
        queryFn: () => paramsApi.getComponents().then(r => r.data.data || []),
        staleTime: STALE_INFINITE,
    });
}

export function useParamTasksByEquipment(equipmentId) {
    return useQuery({
        queryKey: ['params', 'tasks-by-equipment', equipmentId],
        queryFn: () => paramsApi.getTasksByEquipment(equipmentId.value ?? equipmentId).then(r => r.data.data || []),
        enabled: !!(equipmentId?.value ?? equipmentId),
        staleTime: STALE_5MIN,
    });
}
