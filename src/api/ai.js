import http from './http.js';

export const aiApi = {
    reportAssistant: (data) => http.post('/ai/report-assistant', data),
};
