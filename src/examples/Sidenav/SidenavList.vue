<template>
  <div
    class="overflow-hidden collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item" @click="deleteCookies">
        <sidenav-item
          url="/dashboard"
          :class="getRoute() === 'dashboard' ? 'active' : ''"
          :navText="'Dashboard'"
          :toggleSideBar="toggleSideBar"
        >
          <template v-slot:icon>
            <img
              v-if="getRoute() === 'dashboard'"
              src="../../../src/assets/img/logo-dashboard.png"
              alt="logo dashboard"
              class="sizeLogo"
            />
            <img
              v-else
              src="../../../src/assets/img/icons/no-aktif-dashboard.png"
              alt="logo dashboard"
              class="sizeLogo"
            />
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item" @click="deleteCookies">
        <sidenav-item
          url="/project"
          :class="getRoute() === 'project' ? 'active' : ''"
          :navText="'KPI / Project'"
          :toggleSideBar="toggleSideBar"
        >
          <template v-slot:icon>
            <img
              v-if="getRoute() === 'project'"
              src="../../../src/assets/img/icons/aktif-project.png"
              alt="logo project"
              class="sizeLogo"
            />
            <img
              v-else
              src="../../../src/assets/img/logo-project.png"
              alt="logo project"
              class="sizeLogo"
            />
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String,
    toggleSideBar: Boolean
  },
  data() {
    return {
      title: "Argon Dashboard 2",
      controls: "dashboardsExamples",
      isActive: "active"
    };
  },
  components: {
    SidenavItem,
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    deleteCookies() {
      this.$cookies.remove('favorite');
      this.$cookies.remove('project_id');
      this.$cookies.remove('project_name');
      this.$cookies.remove('project_type');
    }
  }
};
</script>
<style scoped>
.sizeLogo {
  width: 170%;
}
</style>
