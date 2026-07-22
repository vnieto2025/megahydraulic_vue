import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
import { quotationApi } from '../api/quotation.js';

export function useQuotationLaborTypes() {
    return useQuery({
        queryKey: ['quotation', 'labor-types'],
        queryFn: () => quotationApi.getLaborTypes().then(r => r.data.data || []),
        staleTime: 5 * 60 * 1000,
    });
}

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

export function useDeleteQuotationPhoto() {
    return useMutation({
        mutationFn: (photoId) => quotationApi.deletePhoto(photoId),
    });
}

export function useGenerateQuotationPDF() {
    return useMutation({
        mutationFn: (quotationId) => quotationApi.generatePdf(quotationId),
        onSuccess: (response, quotationId) => {
            const disposition = response.headers['content-disposition'] || '';
            const match = disposition.match(/filename=(.+)/);
            const filename = match ? match[1] : `Cotizacion_${quotationId}.pdf`;
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        },
    });
}
