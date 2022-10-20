import { createRouter, createWebHistory } from "vue-router";
import useAuth from '@/composables/auth';
import Signup from "../views/Signup/index.vue";
import Dashboard from "../views/Dashboard/index.vue";
import Project from "../views/Project/index.vue";
import ProjectBoard from "../views/Project/ProjectBoard/index.vue";
import RiwayatAktifitas from "../views/RiwayatAktifitas/index.vue";
import AllNotif from "../views/AllNotif/index.vue";
import callBack from "../views/Signup/callBack.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signup",
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/callback",
    name: "callBack",
    component: callBack,
  },
  {
    path: '/sso/login',
    name: 'SSOLoginCallback',
    component: () => import('@/views/Signup/SSOLoginCallback.vue'),
    meta: {
      title: 'SSOLoginCallback',
      guard: false,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/project",
    name: "KPI/Project",
    component: Project,
  },
  {
    path: "/project/project-board",
    name: "Project Board",
    component: ProjectBoard,
  },
  {
    path: "/detail-riwayat-aktifitas",
    name: "Detail Riwayat Aktivitas",
    component: RiwayatAktifitas,
  },
  {
    path: "/detail-notifikasi",
    name: "Detail Notifikasi",
    component: AllNotif,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach(async (to, from, next) => {
  if (to.name === undefined) {
    document.title = `Task Management -  PESA`;  
  } else {
    document.title = `${to.name} -  PESA`;
  }
  const { isAuthenticated } = await useAuth();
  if ((to.name === 'Signup' || to.name === 'callBack') && isAuthenticated) next({ name: 'Dashboard' });
  else if (to.meta.guard && !isAuthenticated) next({ name: 'Signup' });
  else next();
});

export default router;
