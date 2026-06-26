import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { reportsAcescoApi } from '../api/reportsAcesco.js';

export function useReportAcescoList(payload) {
    return useQuery({
        queryKey: ['reports-acesco', 'list', payload],
        queryFn: () => reportsAcescoApi.list(payload.value ?? payload).then(r => r.data.data),
        keepPreviousData: true,
    });
}

export function useCreateReportAcesco() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => reportsAcescoApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports-acesco', 'list'] });
        },
    });
}

export function useEditReportAcesco() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => reportsAcescoApi.edit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports-acesco', 'list'] });
        },
    });
}

export function useGenerateReportAcesco() {
    return useMutation({
        mutationFn: ({ reportId, flag }) => reportsAcescoApi.generate(reportId, flag),
    });
}

export function useGenerateMultipleReportsAcesco() {
    return useMutation({
        mutationFn: (reportIds) => reportsAcescoApi.generateMultiple(reportIds),
    });
}

export function useChangeStatusReportAcesco() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reportId) => reportsAcescoApi.changeStatus(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports-acesco', 'list'] });
        },
    });
}
