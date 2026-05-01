import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { serviceControlApi } from '../api/serviceControl.js';

export function useServiceControlList(payload) {
    return useQuery({
        queryKey: ['service-control', 'list', payload],
        queryFn: () => serviceControlApi.list(payload.value ?? payload).then(r => r.data.data),
        keepPreviousData: true,
    });
}

export function useServiceControl(recordId) {
    return useQuery({
        queryKey: ['service-control', 'detail', recordId],
        queryFn: () => serviceControlApi.get(recordId.value ?? recordId).then(r => r.data.data),
        enabled: !!(recordId?.value ?? recordId),
    });
}

export function useCreateServiceControl() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => serviceControlApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
        },
    });
}

export function useUpdateServiceControl() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => serviceControlApi.update(data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
            if (variables.record_id) {
                queryClient.invalidateQueries({ queryKey: ['service-control', 'detail', variables.record_id] });
            }
        },
    });
}

export function useUpdateInlineStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => serviceControlApi.updateInlineStatus(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
        },
    });
}

export function useConvertToReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (recordId) => serviceControlApi.convertToReport(recordId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
        },
    });
}

export function useConvertMultiple() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (recordIds) => serviceControlApi.convertMultiple(recordIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
        },
    });
}

export function useChangeStatusServiceControl() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (recordId) => serviceControlApi.changeStatus(recordId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-control', 'list'] });
        },
    });
}
