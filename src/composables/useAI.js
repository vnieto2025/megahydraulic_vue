import { useMutation } from './useSimpleQuery.js';
import { aiApi } from '../api/ai.js';

export function useReportAssistant() {
    return useMutation({
        mutationFn: (data) => aiApi.reportAssistant(data).then(r => r.data.data),
    });
}
