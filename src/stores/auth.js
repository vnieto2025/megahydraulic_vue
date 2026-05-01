import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // --- Estado ---
    const token = ref(localStorage.getItem('token') || null);
    const userId = ref(localStorage.getItem('user_id') || null);
    const firstName = ref(localStorage.getItem('first_name') || null);
    const lastName = ref(localStorage.getItem('last_name') || null);
    const userTypeId = ref(localStorage.getItem('user_type_id') || null);
    const permissions = ref(JSON.parse(localStorage.getItem('permissions') || 'null'));
    const photo = ref(localStorage.getItem('photo') || null);

    // --- Getters ---
    const isAuthenticated = computed(() => !!token.value);
    const fullName = computed(() => `${firstName.value || ''} ${lastName.value || ''}`.trim());

    // --- Acciones ---
    function setSession(data) {
        token.value = data.token;
        userId.value = String(data.id);
        firstName.value = data.first_name;
        lastName.value = data.last_name;
        userTypeId.value = String(data.user_type_id);
        permissions.value = data.permission;
        photo.value = data.photo;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
        localStorage.setItem('user_type_id', data.user_type_id);
        localStorage.setItem('permissions', JSON.stringify(data.permission));
        localStorage.setItem('photo', data.photo);
    }

    function clearSession() {
        token.value = null;
        userId.value = null;
        firstName.value = null;
        lastName.value = null;
        userTypeId.value = null;
        permissions.value = null;
        photo.value = null;

        localStorage.clear();
    }

    return {
        token,
        userId,
        firstName,
        lastName,
        userTypeId,
        permissions,
        photo,
        isAuthenticated,
        fullName,
        setSession,
        clearSession,
    };
});
