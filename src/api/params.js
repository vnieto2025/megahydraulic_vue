import http from './http.js';

export const paramsApi = {
    getClients: () =>
        http.post('/params/get_clients', {}),

    getLinesByClient: (clientId) =>
        http.post('/params/get_lines_by_client', { client: clientId }),

    getUsersByClient: (clientId) =>
        http.post('/params/get_users_by_client', { client: clientId }),

    getTypeService: () =>
        http.post('/params/get_type_service', {}),

    getTypeEquipments: () =>
        http.post('/params/get_type_equipments', {}),

    getTypeDocument: () =>
        http.post('/params/get_type_document', {}),

    getTypeUser: () =>
        http.post('/params/get_type_user', {}),

    getServiceStatuses: () =>
        http.post('/params/get_service_statuses', {}),

    getReportStatuses: () =>
        http.post('/params/get_report_statuses', {}),

    getComponents: () =>
        http.post('/params/get_components', {}),

    getTasksByEquipment: (equipmentId) =>
        http.post('/params/get_tasks_by_equipment', { equipment: equipmentId }),
};
