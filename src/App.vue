<template>
  <div>
    <div
      v-show="this.$store.state.layout === 'landing'"
      class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
    ></div>
    <sidenav
      :custom_class="this.$store.state.mcolor"
      :class="['fixed-start']"
      v-if="this.$store.state.showSidenav"
    />

    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <!-- navbar -->
      <navbar
        :class="[navClasses]"
        :textWhite="
        this.$store.state.isAbsolute ? 'text-white opacity-8' : 'text-white'
        "
        :minNav="navbarMinimize"
        v-if="this.$store.state.showNavbar"
      />
      <router-view />
    </main>
  </div>
</template>
<script>

import Sidenav from "./examples/Sidenav";
import Navbar from "@/examples/Navbars/Navbar.vue";
import Swal from 'sweetalert2';
import { mapMutations, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Sidenav,
    Navbar
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"]),
    ...mapActions(['updateShowNavbarAction']),
  },
  created() {
    let location = window.location.pathname;
    let expiredUrl = window.location.search;
    console.log("window location = ",window.location)
    if (location === '/signup' ||  location === '/'){
      this.updateShowNavbarAction(false)
    } else {
      this.updateShowNavbarAction(true)
    }
    if (expiredUrl === '?token_expired=true'){
      this.updateShowNavbarAction(false)
      Swal.fire({
        text: 'Sesi Anda Telah Berakhir, Silahkan Login Kembali !',
        icon: 'warning',
        confirmButtonText: 'Oke',
      })
    }
  },
  computed: {
    // navClasses() {
    //   return {
    //     "position-sticky bg-white left-auto top-2 z-index-sticky":
    //       this.$store.state.isNavFixed && !this.$store.state.darkMode,
    //     "position-sticky bg-default left-auto top-2 z-index-sticky":
    //       this.$store.state.isNavFixed && this.$store.state.darkMode,
    //     "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
    //       .isAbsolute,
    //     "px-0 mx-4": !this.$store.state.isAbsolute
    //   };
    // }
  },
  beforeMount() {
    // this.$store.state.isTransparent = "bg-transparent";
  },
};
</script>
<style>
* {
  font-family: "Roboto", sans-serif;
}
.scroll {
  max-height: 500px;
  overflow-y: auto;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #bdbdbd;
}
</style>
