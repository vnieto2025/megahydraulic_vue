import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { quotationApi } from '../api/quotation.js';

export function useQuotationPlants() {
    return useQuery({
        queryKey: ['quotation', 'plants'],
        queryFn: () => quotationApi.getPlants().then(r => r.data.data || []),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateQuotation() {
    return useMutation({
        mutationFn: (data) => quotationApi.create(data),
    });
}

export function useQuotationList(payload) {
    return useQuery({
        queryKey: computed(() => ['quotation', 'list', payload.value ?? payload]),
        queryFn: () => quotationApi.list(payload.value ?? payload).then(r => r.data.data),
        keepPreviousData: true,
    });
}

export function useQuotationDetail(quotationId) {
    return useQuery({
        queryKey: computed(() => ['quotation', 'detail', quotationId.value]),
        queryFn: () => quotationApi.get({ quotation_id: quotationId.value }).then(r => r.data.data),
        enabled: computed(() => !!quotationId.value),
    });
}

export function useEditQuotation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => quotationApi.edit(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['quotation', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['quotation', 'detail', variables.quotation_id] });
        },
    });
}

export function useChangeStatusQuotation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (quotationId) => quotationApi.changeStatus(quotationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotation', 'list'] });
        },
    });
}
