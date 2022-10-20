import { createStore } from "vuex";
import { useStorage } from '@vueuse/core';
import ApiService from '../services/ApiService';

export default createStore({
  state: {
    // Authentication
    auth: {
      isAuthenticated: false,
      user: {},
      token: '',
    },
    // State Tampilan
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sideonoff: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    // global state data
    project_id: "",
    favorite: null,
    project: [],
    tipe_project: [],
    riwayatActivity: [],
    member: [],
  },

  mutations: {
    // // Authentication Mut
    SET_AUTH_TOKEN(state, token) {
      const authStorage = useStorage('auth', null);
      authStorage.value = JSON.stringify({ token });
      state.auth.token = token;
    },

    SET_AUTH_USER(state, user) {
      state.auth.isAuthenticated = true;
      state.auth.user = user;
    },

    RESET_AUTH(state) {
      state.auth = {
        isAuthenticated: false,
        user: {},
        token: '',
      };
    },

    // mutatation tampilan state
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },

    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      }
    },

    setIdProject(state, payload) {
      state.project_id = payload;
    },

    setShowNavbar(state, payload) {
      state.showNavbar = payload;
      console.log("show nav = ",payload)
    },

    setFavorite(state, payload) {
      state.favorite = payload;
    },

    setTypeProject(state, payload) {
      state.tipe_project = payload;
    },

    sidebarType(state, payload) {
      state.sidebarType = payload;
    },

    sidebarOnOff(state, payload) {
      state.sideonoff = payload;
    },

    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    }

    // mutation global state data
  },

  actions: {
    // project_id
    updateProjectIdAction({ commit }, payload) {
      commit('setIdProject', payload)
    },
    updateShowNavbarAction({ commit }, payload) {
      commit('setShowNavbar', payload)
    },
    updateFavoriteAction({ commit }, payload) {
      commit('setFavorite', payload)
    },
    // type_project
    updateTypeProjectAction({ commit }, payload) {
      commit('setTypeProject', payload)
    },
    // Authentication
    async refreshToken({ commit }, { token }) {
      let result = null;
      try {
        const response = await ApiService.refreshToken({ token });
        const authStorage = useStorage('auth', null);
        authStorage.value = null;
        result = response.data;
        // console.log('berhasil refresh token');
      } catch (error) {
        // console.log('error refresh', error);
        return error;
      }
      commit('SET_AUTH_TOKEN', result.token);
      return false;
    },
    async logout({ commit }, { token }) {
      try {
        const user = await ApiService.getUser(token);
        // console.log(user.data.data.is_sso);
        if (user.data.data.is_sso === true) {
          await ApiService.logout({ token });
          await ApiService.SSOLogout({ token });
        } else {
          await ApiService.logout({ token });
        }
      } catch (error) {
        commit('RESET_AUTH');
        const authStorage = useStorage('auth', null);
        authStorage.value = null;
        return error;
      }
      const authStorage = useStorage('auth', null);
      authStorage.value = null;
      commit('RESET_AUTH');
      return false;
    },
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    }
  },

  getters: {
    getToken: (state) => {
      let token = '';
      const authStorage = useStorage('auth', null);
      // if empty
      if (!authStorage.value) {
        token = state.auth.token;
        return token;
      }
      // if not json
      try {
        token = JSON.parse(authStorage?.value)?.token;
      } catch (error) {
        token = state.auth.token;
        return token;
      }
      return token;
    },
    getAuth: (state) => state.auth,
  }
});
