import http from './http.js';

export const clientsApi = {
    list: (limit, position) =>
        http.post('/client/list_client', { limit: parseInt(limit), position }),

    get: (clientId) =>
        http.post('/client/get_client', { client_id: clientId }),

    create: (data) =>
        http.post('/client/create', data),

    update: (data) =>
        http.post('/client/update_client', data),

    addLinePerson: (data) =>
        http.post('/client/add_line_person', data),
};
