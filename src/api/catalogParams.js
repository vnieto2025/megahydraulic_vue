import http from './http.js';

export const catalogParamsApi = {
    list: (entity) =>
        http.post('/catalog_params/list', { entity }),

    create: (entity, data) =>
        http.post('/catalog_params/create', { entity, data }),

    update: (entity, id, data) =>
        http.post('/catalog_params/update', { entity, id, data }),

    toggleStatus: (entity, id, status) =>
        http.post('/catalog_params/toggle_status', { entity, id, status }),

    listTaskEquipment: (equipmentId) =>
        http.post('/catalog_params/task_equipment_list', { equipment_id: equipmentId }),

    toggleTaskEquipment: (equipmentId, taskId, assign) =>
        http.post('/catalog_params/task_equipment_toggle', { equipment_id: equipmentId, task_id: taskId, assign }),
};
