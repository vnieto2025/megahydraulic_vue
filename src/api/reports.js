import http from './http.js';

export const reportsApi = {
    list: (payload) =>
        http.post('/reports/list_report', payload),

    create: (data) =>
        http.post('/reports/create_report', data),

    edit: (data) =>
        http.post('/reports/edit_report', data),

    getData: (reportId) =>
        http.post('/reports/generate_report', { report_id: reportId, flag: false }),

    generate: (reportId, flag) =>
        http.post('/reports/generate_report', { report_id: reportId, flag }, { responseType: 'blob' }),

    generateMultiple: (reportIds) =>
        http.post('/reports/generate_multiple_reports', { report_ids: reportIds }, { responseType: 'blob' }),

    changeStatus: (reportId) =>
        http.post('/reports/change_status_report', { report_id: reportId }),
};
