import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { usersApi } from '../api/users.js';

export function useUser(userId) {
    return useQuery({
        queryKey: ['users', 'detail', userId],
        queryFn: () => usersApi.get(userId).then(r => r.data.data),
        enabled: !!userId,
    });
}

export function useUserList(limit, position) {
    return useQuery({
        queryKey: ['users', 'list', limit, position],
        queryFn: () => usersApi.list(limit.value, position.value).then(r => r.data.data),
        keepPreviousData: true,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => usersApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => usersApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data) => usersApi.changePassword(data),
    });
}

export function useChangeUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, status }) => usersApi.changeStatus(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
}

export function useUpdateTypeUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userTypeId }) => usersApi.updateTypeUser(userId, userTypeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
        },
    });
}
