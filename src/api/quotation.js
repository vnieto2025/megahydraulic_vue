import http from './http.js';

export const quotationApi = {
    getPlants: () =>
        http.post('/quotation/get_plants', {}),

    getLaborTypes: () =>
        http.post('/quotation/get_labor_types', {}),

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

    deletePhoto: (photoId) =>
        http.post('/quotation/delete_photo', { photo_id: photoId }),

    generatePdf: (quotationId) =>
        http.post('/quotation/generate_pdf', { quotation_id: quotationId }, { responseType: 'blob' }),

    duplicate: (payload) =>
        http.post('/quotation/duplicate', payload),
};
