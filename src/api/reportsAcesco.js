import http from './http.js';

export const reportsAcescoApi = {
    list: (payload) =>
        http.post('/reports/list_report_acesco', payload),

    create: (data) =>
        http.post('/reports/create_report_acesco', data),

    edit: (data) =>
        http.post('/reports/edit_report_acesco', data),

    getData: (reportId) =>
        http.post('/reports/generate_report_acesco', { report_id: reportId, flag: false }),

    generate: (reportId, flag) =>
        http.post('/reports/generate_report_acesco', { report_id: reportId, flag }, { responseType: 'blob' }),

    generateMultiple: (reportIds) =>
        http.post('/reports/generate_multiple_reports_acesco', { report_ids: reportIds }, { responseType: 'blob' }),
};
