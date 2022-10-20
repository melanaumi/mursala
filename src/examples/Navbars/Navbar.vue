<template>
  <nav class="navbar w-100 navbar-main navbar-expand-lg fixed-top">
    <div class="px-4 py-1 container-fluid">
      <breadcrumbs :currentPage="currentRouteName" textBlack="text-black" />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="this.$store.state.isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-4 pe-4 d-flex align-items-center"
          :class="this.$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <div class="search rounded-pill">
            <i class="fa fa-search"></i>
            <input
              v-model="initModelSearchProjectAndTask"
              id="dropdownSearch"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              list="dataTask_Project"
              type="text"
              class="form-control"
              placeholder="Cari KPI / project atau kerjaan"
            />
            <datalist
              aria-labelledby="dropdownSearch"
              id="dataTask_Project"
              class="dropdown-menu dropdown-menu-end datalist-scrollbar"
              style="max-height: 480px; overflow-y: auto;"
            >
              <div style="width: 480px;">
                <p class="mt-2 px-3">KPI / Project</p>
                <div
                  style="width: 480px; margin-top:5px;"
                  v-if="isLoadingProject"
                  class="d-flex justify-content-center"
                >
                  <Loading />
                </div>
                <p
                  style="width: 480px; margin-top:5px; text-align: center;"
                  v-if="dataSearchProject.length === 0 && isLoadingProject === false"
                >KPI / Project tidak ditemukan</p>
                <div v-else>
                  <a
                    href="javascript:;"
                    class="dropdown-item"
                    v-for="(dataSearchProjects, index) in filteredSearchProject"
                    :key="index"
                    @click="toProjectDetail('search',dataSearchProjects)"
                  >
                    <div class="d-flex align-items-center position-relative">
                      <div style="width: 40px;">
                        <p
                          :style="{'backgroundColor': hexToRgbA(dataSearchProjects.color === undefined ?  '#080808' : dataSearchProjects.color), 'color': dataSearchProjects.color}"
                          class="text-center rounded-2 fs-5 p-1 mt-3"
                        >{{ getInitials(dataSearchProjects.project_name) }}</p>
                      </div>
                      <div class="w-70">
                        <h6 class="font-weight-normal ms-3">{{dataSearchProjects.project_name}}</h6>
                      </div>
                      <div
                        v-if="dataSearchProjects.is_favorite === 1"
                        class="position-absolute right"
                      >
                        <img src="@/assets/img/icons/star3.png" />
                      </div>
                    </div>
                  </a>
                </div>
                <p class="mt-2 px-3">Pekerjaan</p>
                <div
                  style="width: 480px; margin-top:5px;"
                  v-if="isLoadingTask"
                  class="d-flex justify-content-center"
                >
                  <Loading />
                </div>
                <p
                  style="width: 480px; margin-top:5px; text-align: center;"
                  v-if="dataSearchTask.length === 0 && isLoadingTask === false"
                >Pekerjaan tidak ditemukan</p>
                <div v-else>
                  <a
                    href="javascript:;"
                    class="dropdown-item"
                    v-for="(dataSearchTasks, index) in filteredSearchTask"
                    :key="index"
                    :data-bs-target="`#modal-detail-task${dataSearchTasks.id}`"
                    data-bs-toggle="modal"
                    @click="toTaskDetail(dataSearchTasks)"
                  >
                    <div class="d-flex align-items-center position-relative">
                      <div style="width: 40px;">
                        <p
                          :style="{'backgroundColor': hexToRgbA(dataSearchTasks.project_color === undefined ?  '#080808' : dataSearchTasks.project_color), 'color': dataSearchTasks.project_color}"
                          class="text-center rounded-2 fs-5 p-1 mt-3"
                        >{{ getInitials(dataSearchTasks.project_name) }}</p>
                      </div>
                      <div class="w-70">
                        <h6 class="font-weight-normal ms-3">{{ dataSearchTasks.title }}</h6>
                        <span class="ms-3">KPI / Project {{ dataSearchTasks.project_name }}</span>
                      </div>
                      <div v-if="dataSearchTasks.is_favorite === 1" class="position-absolute right">
                        <img src="@/assets/img/icons/star3.png" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </datalist>
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item dropdown d-flex align-items-center pe-4">
            <a
              href="#"
              class="p-0 nav-link text-black"
              :class="[showMenu ? 'show' : '']"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :data-bs-auto-close="toggleDropdown ? 'outside' : 'inside'"
              @click="showMenu = !showMenu"
            >
              <div class="position-absolute mt-1" v-if="totalNotification !== '0'">
                <div class="bg-danger text-white rounded-pill ms-2">
                  <p class="mx-1" style="font-size: 10px;">{{ totalNotification }}</p>
                </div>
              </div>
              <i class="cursor-pointer bi bi-bell" style="font-size: x-large;"></i>
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <div class="mt-2">
                <span style="font-size: 16px;" class="text-dark fw-bold ms-3">Notifikasi</span>
                <hr />
              </div>
              <p
                style="width: 550px; margin-top:10px; text-align: center;"
                v-if="dataNotification.length === 0"
              >Belum ada Notifikasi</p>
              <div style="max-height: 480px; overflow-y: auto;">
                <li
                  class="mb-2"
                  v-for="(dataNotifications, index) in dataNotification"
                  :style="{'backgroundColor': dataNotifications.viewed_at !== null ? '#ffff' : '#e6f6f8'}"
                  :key="index"
                >
                  <a
                    class="dropdown-item border-radius-md"
                    href="javascript:;"
                    @click="dataNotifications.menu === 'project.invitation' ? null : readSingleNotification(dataNotifications)"
                  >
                    <div class="py-1 d-flex">
                      <div class>
                        <a
                          href="javascript:;"
                          class="border-0 avatar avatar-sm rounded-circle me-3"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          :style="{'backgroundColor': '#'+colorRandomSingle}"
                          style="font-weight: bolder;"
                        >{{ getInitials(dataNotifications.title_1) }}</a>
                      </div>
                      <!-- kondisi 1 (tampilan blank default) -->
                      <div
                        v-if="
                      dataNotifications.menu === 'project.create'
                      || dataNotifications.menu === 'project.edit.mobile'
                      || dataNotifications.menu === 'project.delete'
                      || dataNotifications.menu === 'project.kick'
                      || dataNotifications.menu === 'project.leave'
                      || dataNotifications.menu === 'status.edit.mobile'
                      || dataNotifications.menu === 'status.delete'
                      || dataNotifications.menu === 'task.edit.mobile'
                      || dataNotifications.menu === 'task.delete'
                      || dataNotifications.menu === 'task.attachment'
                      || dataNotifications.menu === 'task.assign'
                      || dataNotifications.menu === 'task.kick'
                      || dataNotifications.menu === 'task.move'
                      "
                        class="d-flex flex-column justify-content-center"
                      >
                        <h6 class="mb-1 text-sm font-weight-normal">
                          <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                          {{ dataNotifications.title_2 }}
                          <span
                            class="font-weight-bold"
                            style="color: #00A2B9;"
                          >{{ dataNotifications.object_code }}</span>
                        </h6>
                        <p class="mb-0 text-xs text-secondary">
                          <i class="fa fa-clock me-1"></i>
                          {{ dataNotifications.jam }} WIB
                        </p>
                        <p
                          class="text-xs text-secondary mt-2"
                        >{{ dataNotifications.tanggal }} {{ dataNotifications.jam }} WIB</p>
                      </div>

                      <!-- kondisi 2 (tampilan arrow edit) -->
                      <div
                        v-if="dataNotifications.menu === 'project.edit.title'
                        || dataNotifications.menu === 'task.edit.status'
                        || dataNotifications.menu === 'task.edit.project'
                        || dataNotifications.menu === 'task.edit.start'
                        || dataNotifications.menu === 'task.edit.end'
                        "
                        class="d-flex flex-column justify-content-center"
                      >
                        <h6 class="mb-1 text-sm font-weight-normal">
                          <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                          {{ dataNotifications.title_2 }}
                          <span
                            class="font-weight-bold"
                            style="color: #00A2B9;"
                          >{{ dataNotifications.object_code }}</span>
                        </h6>
                        <p class="mb-0 text-xs text-secondary">
                          <i class="fa fa-clock me-1"></i>
                          {{ dataNotifications.jam }} WIB
                        </p>
                        <div
                          class="mt-2 border-radius-sm d-inline-flex"
                          style="border: 0.3px solid gainsboro;"
                        >
                          <p
                            class="text-sm text-secondary mb-2 mt-2"
                            style="margin-left: 10px; margin-right: 10px;"
                          >
                            {{ dataNotifications.before }} &nbsp;
                            <span
                              class="text-dark"
                              style="font-weight: bolder;"
                            >
                              <i class="fas fa-arrow-right" />
                              &nbsp; {{ dataNotifications.after }}
                            </span>
                          </p>
                        </div>
                        <p
                          class="text-xs text-secondary mt-2"
                        >{{ dataNotifications.tanggal }} {{ dataNotifications.jam }} WIB</p>
                      </div>

                      <!-- kondisi 3 (tampilan invitation) -->
                      <div
                        v-if="dataNotifications.menu === 'project.invitation'"
                        class="d-flex flex-column justify-content-center"
                      >
                        <h6 class="mb-1 text-sm font-weight-normal">
                          <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                          {{ dataNotifications.title_2 }}
                          <span
                            class="font-weight-bold"
                            style="color: #00A2B9;"
                          >{{ dataNotifications.object_code }}</span>
                          <span
                            v-if="dataNotifications.is_action === 0"
                          >&nbsp;{{ dataNotifications.title_3 }}</span>
                        </h6>
                        <p class="mb-0 text-xs text-secondary">
                          <i class="fa fa-clock me-1"></i>
                          {{ dataNotifications.jam }} WIB
                        </p>
                        <div
                          v-if="dataNotifications.is_action === 1"
                          class="mb-2 mt-2 d-inline-flex"
                        >
                          <button
                            @click="rejectInvitation(dataNotifications.object_id, dataNotifications.id)"
                            class="btn btn-outline-primary m-1"
                            style="width: 140px;"
                          >Tolak</button>
                          <button
                            @click="accInvitation(dataNotifications, dataNotifications.object_id, dataNotifications.id)"
                            class="btn btn-primary m-1"
                            style="width: 140px;"
                          >Terima</button>
                        </div>
                        <p
                          class="text-xs text-secondary mt-2"
                        >{{ dataNotifications.tanggal }} {{ dataNotifications.jam }} WIB</p>
                      </div>

                      <!-- kondisi 4 task comment -->
                      <div
                        v-if="dataNotifications.menu === 'task.comment'"
                        class="d-flex flex-column justify-content-center"
                      >
                        <h6 class="mb-1 text-sm font-weight-normal">
                          <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                          {{ dataNotifications.title_2 }}
                          <span
                            class="font-weight-bold"
                            style="color: #00A2B9;"
                          >{{ dataNotifications.object_code }}</span>
                        </h6>
                        <p class="mb-0 text-xs text-secondary">
                          <i class="fa fa-clock me-1"></i>
                          {{ dataNotifications.jam }} WIB
                        </p>
                        <div
                          class="mb-2 card border-radius-sm mt-2"
                          style="background-color: #ffff;"
                        >
                          <p
                            style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                          >{{ dataNotifications.title_3 }}</p>
                        </div>
                        <p
                          class="text-xs text-secondary mt-2"
                        >{{ dataNotifications.tanggal }} {{ dataNotifications.jam }} WIB</p>
                      </div>
                    </div>
                  </a>
                </li>
              </div>
              <hr />
              <div class="d-flex justify-content-between mt-2">
                <div @click="readAll">
                  <span class="ms-3" v-if="isLoadingNotification">
                    <Loading />
                  </span>
                  <span
                    v-else
                    style="font-size: 13px; color: #00A2B9;"
                    class="fw-bold ms-3"
                  >Tandai Semua Telah Dibaca</span>
                </div>
                <di>
                  <span
                    @click="toAllNotif()"
                    style="cursor:pointer; font-size: 13px; color: #00A2B9;"
                    class="fw-bold ms-3"
                  >Lihat Semua</span>
                </di>
              </div>
            </ul>
          </li>
          <li class="dropdown">
            <button
              class="border-0 rounded-circle bg-white"
              type="button"
              id="dropdownLogout"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :class="[showLogout ? 'show' : '']"
              @click="showLogout = !showLogout"
            >
              <li
                class="border-0 avatar avatar-sm rounded-circle"
                :style="{'backgroundColor': '#'+colorRandomSingle}"
              >
                <p
                  data-toggle="tooltip"
                  data-placement="bottom"
                  style="margin-top: 15px; font-size: 1rem; font-weight: 700;"
                >{{ getInitials(fullname) }}</p>
              </li>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              :class="showLogout ? 'show' : ''"
              aria-labelledby="dropdownLogout"
            >
              <button class="p-1 d-flex align-items-center dropdown-item" @click="logOut">
                <div class="mx-3">
                  <button type="button" class="dropdown-item text-dark">
                    <i class="fa fa-sign-out" /> &nbsp;Log Out
                  </button>
                </div>
              </button>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import { mapMutations, mapActions } from "vuex";
import ApiService from "../../services/ApiService";
import { ToastError, ToastSuccess }  from "@/composables/toast";
import Loading from '../../views/components/Loading.vue';

export default {
  name: "navbar",
  data() {
    return {
      token: '',
      toggleDropdown: false,
      isLoadingProject: false,
      isLoadingTask: false,
      isLoadingAcc: false,
      isLoadingReject: false,
      isLoadingNotification: false,
      dataUser: [],
      dataNotification: [],
      totalNotification: '0',
      inputNameSearch: '',
      fullname: '',
      showMenu: false,
      showLogout: false,
      colorRandomSingle: Math.floor(Math.random() * 16777215).toString(16),
      dataSearchProject: [],
      dataSearchTask: []
    };
  },
  props: ["minNav", "textBlack"],
  beforeMount() {
    this.getDataUser()
  },
  created() {
    // get token
    if (window.location.hostname === 'localhost') {
      this.token = process.env.VUE_APP_TOKEN;
    } else {
      let token = this.$cookies.get("token_pesa");
      this.token = token;
    }
    this.minNav;
  },
  methods: {
    /////////////////////////////////////////////////// MUTATION AND ACTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    ...mapActions(["toggleSidebarColor", 'updateProjectIdAction',
      'updateFavoriteAction', 'updateShowNavbarAction']),
    ////////////////////////////////////////////////// FUNCTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    colorRandom(){
      return Math.floor(Math.random() * 16777215).toString(16)
    },
    hexToRgbA(hex) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
      }
      throw new Error('Bad Hex');
    },
    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
    addCookiesAndState(project_id, fav, project_name) {
      // update state
      this.updateProjectIdAction(project_id)
      this.updateFavoriteAction(fav)
      // cookies
      this.$cookies.set('project_id', project_id);
      this.$cookies.set('favorite', fav);
      this.$cookies.set("project_name", project_name);
      // emit breadcumbs
      this.emitter.emit("event-data", project_name);
    },
    removeCookies() {
      this.$cookies.remove('favorite');
      this.$cookies.remove('project_id');
      this.$cookies.remove('project_name');
      this.$cookies.remove('project_type');
      this.$cookies.remove('user');
    },

    async logOut() {
      try {
        await ApiService.SSOLogout(this.token)
        // update state
        this.$cookies.remove('token_pesa');
        this.updateShowNavbarAction(false)
        this.updateProjectIdAction('')
        this.updateFavoriteAction(null)
        // remove cookies
        this.removeCookies()
        // redirect to login
        this.$router.push({ name: 'Signup' })
        ToastSuccess('Berhasil logout SSO')
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }

    },
    toAllNotif(){
      this.$router.push({name: 'Detail Notifikasi'})
    },
    // function get initials text
    getInitials(string) {
      let names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
        initials += names[1].substring(0, 1).toUpperCase();
      }
      let text = initials.toUpperCase();
      return text;
    },
    // function to project detail
    toProjectDetail(type, value) {
      let location = window.location.pathname;
      if (type === 'search'){
        let breadcumbs = {
          condition: true,
          project_name: value.project_name
        }
        if (location === '/project/project-board') {
          this.emitter.emit("params-project-detail", value);
          this.addCookiesAndState(value.id, value.is_favorite, breadcumbs)
        } else {
          this.$router.push({ name: 'Project Board' })
          this.addCookiesAndState(value.id, value.is_favorite, breadcumbs)
        }
      }
    },
    // function to task detail
    toTaskDetail(value) {
      let location = window.location.pathname;
      let breadcumbs = {
        condition: true,
        project_name: value.project_name
      }
      if (location === '/project/project-board') {
        this.emitter.emit("params-task-project-detail", value);
        this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
      } else {
        // console.log("task detail = ", value)
        this.$router.push({ name: 'Project Board' })
        this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
      }
    },
    ////////////////////////////////////////////////// HIT API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     async getDataUser() {
      try {
        const response = await ApiService.getUser(this.token)
        if (response !== null) {
          let toData = response.data.data;
          this.dataUser = toData;
          this.fullname = toData.full_name;
          let dataUser = {
            id: toData.id,
            fullname: toData.full_name,
          }
          this.$cookies.set('user',dataUser);
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    // get notification
    async getNotification() {
      let data = {
        token: this.token,
        page: 1
      }
      try {
        const response = await ApiService.notification(data)
        if (response !== null) {
          let toData = response.data.data;
          console.log("toData notification = ", toData)
          this.totalNotification = toData.total_notif_active.toString();
          this.dataNotification = toData.notifications.data;
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    // read all
    async readAll() {
      try {
        this.toggleDropdown = true
        this.isLoadingNotification = true
        const response = await ApiService.updateReadNotifAll(this.token)
        this.isLoadingNotification = true
        console.log(response)
        ToastSuccess(response.data.message)
        this.getNotification()
      } catch (error) {
        this.isLoadingNotification = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    // read single
    async readSingleNotification(value) {
      console.log("read single notif = ",value)
      if (value.viewed_at === null) {
        let data = {
          token: this.token,
        notif_id: value.id
      }
      try {
        await ApiService.updateReadNotifSingle(data)
        this.getNotification()
         let breadcumbs = {
          condition: true,
          project_name: value.object_code
        }
        if (location === '/project/project-board') {
          this.emitter.emit("params-project-detail", value);
          this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
        } else {
          this.$router.push({ name: 'Project Board' })
          this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    } else {
      let breadcumbs = {
          condition: true,
          project_name: value.object_code
        }
        if (location === '/project/project-board') {
          this.emitter.emit("params-project-detail", value);
          this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
        } else {
          this.$router.push({ name: 'Project Board' })
          this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
        }
      }
    },
    // Get Project Favorit
    async searchProject() {
      try {
        const data = {
          name: this.inputNameSearch,
          token: this.token
        }
        this.isLoadingProject = true;
        const response = await ApiService.getSearchProject(data)
        let toData = response.data.data;
        // console.log("Search Project = ",toData)
        this.isLoadingProject = false;
        if (toData !== undefined || toData !== null) {
          this.dataSearchProject = toData;
        }
      } catch (error) {
        this.isLoadingProject = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    async searchTask() {
      try {
        const data = {
          name: this.inputNameSearch,
          token: this.token
        }
        this.isLoadingTask = true;
        const response = await ApiService.getSearchTask(data)
        let toData = response.data.data;
        // console.log("Search Task navbar = ",toData)
        this.isLoadingTask = false;
        if (toData !== undefined || toData !== null) {
          this.dataSearchTask = toData;
        }
      } catch (error) {
        this.isLoadingTask = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    async accInvitation(value, project_id, notif_id) {
      try {
         const data = {
          token: this.token,
          project_id: project_id,
          notif_id: notif_id
        }
        this.isLoadingAcc = true;
        const response = await ApiService.accInvitation(data)
        this.isLoadingAcc = false;
        ToastSuccess(response.data.message)
        console.log("response acc = ",response)
        setTimeout(() => {
          let breadcumbs = {
           condition: true,
           project_name: value.object_code
         }
         if (location === '/project/project-board') {
           this.emitter.emit("params-project-detail", value);
           this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
         } else {
           this.$router.push({ name: 'Project Board' })
           this.addCookiesAndState(value.object_id, value.is_favorite, breadcumbs)
         }
        },1000)
      } catch (error) {
        this.isLoadingAcc = false;
        let err = error.response.data.message;
        let errDetail = error.response.data.data;
        if (errDetail !== null || errDetail !== undefined) {
          ToastError(errDetail.project_id)
        } else {
          ToastError(err)
        }
      }
    },
    async rejectInvitation(project_id, notif_id) {
      try {
        const data = {
          token: this.token,
          project_id: project_id,
          notif_id: notif_id
        }
        this.isLoadingReject = true;
        const response = await ApiService.rejectInvitation(data)
        ToastSuccess(response.data.message)
        console.log("response reject = ", response)
      } catch (error) {
        this.isLoadingReject = false;
         let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    }
  },
  mounted() {
    this.searchProject()
    this.searchTask()
    this.getNotification()
  },
  components: {
    Breadcrumbs,
    Loading
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },

    initModelSearchProjectAndTask: {
      get() {
        return this.inputNameSearch
      },
      set(value) {
        this.inputNameSearch = value
        this.searchProject()
        this.searchTask()
      }
    },

    filteredSearchProject() {
      var self = this;
      let arr = [];
      let dataSearchProjects = this.dataSearchProject.filter((searchproject) => {
        let data = searchproject.project_name.toLowerCase().indexOf(self.inputNameSearch.toLowerCase()) >= 0 ||
          searchproject.project_name.toLowerCase().indexOf(self.inputNameSearch.toLowerCase()) >= 0;
          if (data == true) {
          arr.push(data)
        }
        return data;
      });
      return dataSearchProjects;
    },

    filteredSearchTask() {
      var self = this;
      let arr = [];
      let dataSearchTasks = this.dataSearchTask.filter((searchtask) => {
        let data = searchtask.title.toLowerCase().indexOf(self.inputNameSearch.toLowerCase()) >= 0 ||
          searchtask.title.toLowerCase().indexOf(self.inputNameSearch.toLowerCase()) >= 0;
           if (data == true) {
          arr.push(data)
        }
        return data;
      });
      return dataSearchTasks;
    },
  }
};
</script>
<style scoped>
::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}
datalist.datalist-scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: white;
}
datalist.datalist-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px transparent;
  background-color: #bdbdbd;
}
.search {
  position: relative;
  width: 250px;
}

.search input {
  text-indent: 25px;
  border: 1px solid #d6d4d4;
  border-radius: 20px !important;
  background-color: rgb(248, 248, 248);
}

.search input:focus {
  box-shadow: none;
  border: 1px solid #00a2b9;
}

.search .fa-search {
  position: absolute;
  top: 13px;
  left: 15px;
}
.bg-lainnya {
  color: #666666;
  background-color: #efefef;
}
.bg-tupoksi {
  color: #36b37e;
  background-color: #eafbef;
}
.bg-kpi {
  color: #5c00b9;
  background-color: #efe6f8;
}
.right {
  right: 10px;
}
</style>
