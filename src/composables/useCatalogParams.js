import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { catalogParamsApi } from '../api/catalogParams.js';

export function useCatalogList(entity) {
    return useQuery({
        queryKey: computed(() => ['catalog-params', entity.value ?? entity]),
        queryFn: () => catalogParamsApi.list(entity.value ?? entity).then(r => r.data.data || []),
        enabled: computed(() => !!(entity.value ?? entity)),
    });
}

export function useCreateCatalogItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ entity, data }) => catalogParamsApi.create(entity, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['catalog-params', variables.entity] });
        },
    });
}

export function useUpdateCatalogItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ entity, id, data }) => catalogParamsApi.update(entity, id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['catalog-params', variables.entity] });
        },
    });
}

export function useToggleCatalogStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ entity, id, status }) => catalogParamsApi.toggleStatus(entity, id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['catalog-params', variables.entity] });
        },
    });
}

export function useTaskEquipmentList(equipmentId) {
    return useQuery({
        queryKey: computed(() => ['catalog-params', 'task-equipment', equipmentId.value ?? equipmentId]),
        queryFn: () => catalogParamsApi.listTaskEquipment(equipmentId.value ?? equipmentId).then(r => r.data.data || []),
        enabled: computed(() => !!(equipmentId.value ?? equipmentId)),
    });
}

export function useToggleTaskEquipment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ equipmentId, taskId, assign }) => catalogParamsApi.toggleTaskEquipment(equipmentId, taskId, assign),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['catalog-params', 'task-equipment', variables.equipmentId] });
        },
    });
}
