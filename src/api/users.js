import http from './http.js';

export const usersApi = {
    list: (limit, position) =>
        http.post('/user/list_user', { limit: parseInt(limit), position }),

    get: (userId) =>
        http.post('/user/get_user', { user_id: parseInt(userId) }),

    create: (data) =>
        http.post('/user/create_user', data),

    update: (data) =>
        http.post('/user/update_user', data),

    changePassword: (data) =>
        http.post('/user/change_password', data),

    changeStatus: (userId, status) =>
        http.post('/user/change_status', { user_id: userId, status }),

    updateTypeUser: (userId, userTypeId) =>
        http.post('/user/update_type_user', { user_id: userId, user_type_id: userTypeId }),
};
