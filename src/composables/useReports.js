import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { reportsApi } from '../api/reports.js';

export function useReportList(payload) {
    return useQuery({
        queryKey: ['reports', 'list', payload],
        queryFn: () => reportsApi.list(payload.value ?? payload).then(r => r.data.data),
        keepPreviousData: true,
    });
}

export function useCreateReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => reportsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
        },
    });
}

export function useEditReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => reportsApi.edit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
        },
    });
}

export function useGenerateReport() {
    return useMutation({
        mutationFn: ({ reportId, flag }) => reportsApi.generate(reportId, flag),
    });
}

export function useGenerateMultipleReports() {
    return useMutation({
        mutationFn: (reportIds) => reportsApi.generateMultiple(reportIds),
    });
}

export function useChangeStatusReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reportId) => reportsApi.changeStatus(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports', 'list'] });
        },
    });
}
