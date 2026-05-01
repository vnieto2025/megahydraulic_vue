import http from './http.js';

export const serviceControlApi = {
    list: (payload) =>
        http.post('/service_control/list', payload),

    get: (recordId) =>
        http.post('/service_control/get', { record_id: recordId }),

    create: (data) =>
        http.post('/service_control/create', data),

    update: (data) =>
        http.post('/service_control/update', data),

    updateInlineStatus: (data) =>
        http.post('/service_control/update_inline_status', data),

    convertToReport: (recordId) =>
        http.post('/service_control/convert_to_report', { record_id: recordId }),

    convertMultiple: (recordIds) =>
        http.post('/service_control/convert_multiple', { record_ids: recordIds }),

    changeStatus: (recordId) =>
        http.post('/service_control/change_status', { record_id: recordId }),

    getOcList: (filters) =>
        http.post('/service_control/get_oc_list', { filters }),

    getHesList: (filters) =>
        http.post('/service_control/get_hes_list', { filters }),

    getSolpedList: (filters) =>
        http.post('/service_control/get_solped_list', { filters }),
};
