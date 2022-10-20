<template>
  <!-- <div v-show="this.$store.state.layout === 'default'" class="min-height-50 position-absolute" /> -->
  <aside
    class="overflow-hidden border-1 navbar navbar-vertical navbar-expand-xs"
    :class="`${
    this.$store.state.isRTL
    ? 'me-3 rotate-caret fixed-end'
    : 'fixed-start'
  } 
  ${
    this.$store.state.layout === 'landing'
    ? 'bg-transparent shadow-none'
    : ' '
  } ${this.$store.state.sidebarType} ${toggleSideBar?'onToggle sidenavOff' : 'sidenav'}`"
    id="sidenav-main"
  >
    <div class="sidenav-header position-relative">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <!-- sidebar toggle -->
      <div
        :class="`${toggleSideBar ? 'position-absolute rounded-circle btnBackFalse' : 'position-absolute rounded-circle btnBackTrue'}`"
        @click="toggleOnOff(!toggleSideBar)"
      >
        <i
          :class="`${toggleSideBar ? 'fas fa-chevron-right px-2 py-1' : 'fas fa-chevron-left px-2 py-1'}`"
          id="header-toggle"
        ></i>
      </div>
      <div class="m-0 navbar-brand">
        <img
          v-if="toggleSideBar === false"
          :src="
            this.$store.state.darkMode ||
            this.$store.state.sidebarType === 'bg-default'
              ? logoWhite
              : logo
          "
          class="navbar-brand-img h-100"
          alt="main_logo"
        />
        <span v-if="toggleSideBar === false" class="ms-2 font-weight-bold me-2">PESA</span>
      </div>
    </div>
    <!-- <hr class="mt-0 horizontal dark" /> -->
    <sidenav-list :toggleSideBar="toggleSideBar" :cardBg="custom_class" />
  </aside>
</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/Logo.png";
import logoWhite from "@/assets/img/Logo.png";
import { mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    SidenavList
  },
  data() {
    return {
      toggleSideBar: false,
      logo,
      logoWhite
    };
  },
  props: ["custom_class", "layout"],
  methods:{
    ...mapMutations(["sidebarOnOff"]),
    toggleOnOff(state) {
      this.sidebarOnOff(state)
      return this.toggleSideBar = state;
    }
  }
};
</script>
<style scoped>
.btnBackTrue {
  right: 0px;
  bottom: 25px;
  color: grey;
  cursor: pointer;
  padding: 1px;
  border: 1px solid gainsboro;
  background-color: white;
}
.btnBackFalse {
  right: 25px;
  bottom: 25px;
  color: grey;
  cursor: pointer;
  padding: 1px;
  border: 1px solid gainsboro;
  background-color: white;
}
.onToggle {
  width: 80px !important;
}
</style>
