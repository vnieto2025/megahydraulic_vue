import { useMutation } from '@tanstack/vue-query';
import { aiApi } from '../api/ai.js';

export function useReportAssistant() {
    return useMutation({
        mutationFn: (data) => aiApi.reportAssistant(data).then(r => r.data.data),
    });
}

export function useServiceQuery() {
    return useMutation({
        mutationFn: (question) => aiApi.serviceQuery(question).then(r => r.data.data.answer),
    });
}
