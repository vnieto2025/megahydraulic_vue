import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue';
import CreateReportView from '@/views/CreateReportView.vue';
import ListReportView from '@/views/ListReportView.vue';
import EditProfileView from '@/views/EditProfileView.vue';
import EditReportView from '@/views/EditReportView.vue';
import CreateUserView from '@/views/CreateUserView.vue';
import ListUserView from '@/views/ListUserView.vue';
import ChangePasswordView from '@/views/ChangePasswordView.vue';
import CreateClientView from '@/views/CreateClientView.vue';
import ListClientView from '@/views/ListClientView.vue';
import EditClientview from '@/views/EditClientview.vue';
import AddLinePersonView from '@/views/AddLinePersonView.vue';
import CreateReportAcescoView from '@/views/CreateReportAcescoView.vue';
import ListReportAcescoView from '@/views/ListReportAcescoView.vue';
import EditReportAcescoView from '@/views/EditReportAcescoView.vue';
import ControlServicioView from '@/views/ControlServicioView.vue';
import ListServiceControlView from '@/views/ListServiceControlView.vue';
import EditServiceControlView from '@/views/EditServiceControlView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'login', component: LoginView},
    {path: '/dashboard', name: 'dashboard', component: DashboardView},
    {path: '/report/create', name: 'report/create', component: CreateReportView},
    {path: '/reports', name: 'reports', component: ListReportView},
    {path: '/profile/edit/:id', name: 'profile/edit/', component: EditProfileView},
    {path: '/report/edit/:id', name: 'report/edit/', component: EditReportView},
    {path: '/user/create', name: 'user/create', component: CreateUserView},
    {path: '/users', name: 'users', component: ListUserView},
    {path: '/profile/change_password/:id', name: 'profile/change_password/', component: ChangePasswordView},
    {path: '/client/create', name: 'client/create', component: CreateClientView},
    {path: '/clients', name: 'clients', component: ListClientView},
    {path: '/client/edit/:id', name: 'client/edit/', component: EditClientview},
    {path: '/client/addLinePerson', name: 'client/addLinePerson/', component: AddLinePersonView},
    {path: '/report/create-acesco', name: 'report/create-acesco/', component: CreateReportAcescoView},
    {path: '/reports-acesco', name: 'reports-acesco', component: ListReportAcescoView},
    {path: '/report-acesco/edit/:id', name: 'report-acesco/edit/', component: EditReportAcescoView},
    {path: '/control-servicio', name: 'control-servicio/', component: ControlServicioView},
    {path: '/ver-lista-control-servicio', name: 'ver-lista-control-servicio/', component: ListServiceControlView},
    {path: '/service-control/edit/:id', name: 'service-control/edit/', component: EditServiceControlView},
  ]
})

router.beforeEach((to, from, next) => {
  // useAuthStore() se llama aquí dentro (en runtime), cuando Pinia ya está instalada
  const auth = useAuthStore();

  if (to.path === '/' || to.name === 'login') {
    next();
  } else {
    if (!auth.isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  }
});

export default router
