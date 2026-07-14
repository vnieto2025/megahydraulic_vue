import http from './http.js';

export const quotationApi = {
    getPlants: () =>
        http.post('/quotation/get_plants', {}),

    create: (data) =>
        http.post('/quotation/create', data),

    list: (payload) =>
        http.post('/quotation/list', payload),

    get: (data) =>
        http.post('/quotation/get', data),

    edit: (data) =>
        http.post('/quotation/edit', data),

    changeStatus: (quotationId) =>
        http.post('/quotation/change_status', { quotation_id: quotationId }),
};
