<template>
  <div class="fixed-plugin">
    <div class="shadow-lg card">
      <hr class="horizontal dark" />
      <div style="margin-top: 70px;">
        <div class="mx-2 d-flex">
          <i
            v-if="toggle !== false"
            v-on:click="onClickButton(showSide)"
            class="position-absolute rounded-circle fas fa-chevron-right btnBack"
          ></i>
          <h6 class="ms-2">Riwayat Aktivitas</h6>
        </div>
        <hr />
        <div class="p-1 card-body scroll-side mb-6">
          <a
            href="javascript:;"
            class="d-flex mb-2 border-radius-md hover-click"
            v-for="(dataRiwayat, index) in stateRiwayat"
            :key="index"
            :data-bs-target="`#modal-detail-task${dataRiwayat.task_id}`"
            data-bs-toggle="modal"
            @click="toProjectDetail(dataRiwayat)"
          >
            <div class="py-1 d-flex">
              <div>
                <a
                  href="javascript:;"
                  class="border-0 avatar avatar-sm rounded-circle me-3 text-white"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  :style="{'backgroundColor': '#'+colorRandom(), 'fontWeight': 'bold'}"
                >{{ getInitials(dataRiwayat.creator_full_name) }}</a>
              </div>
              <!-- kondisi 1 (tampilan blank default) -->
              <div
                v-if="
                      dataRiwayat.activity_code === 'project.add'
                      || dataRiwayat.activity_code === 'project.update'
                      || dataRiwayat.activity_code === 'project.delete'
                      || dataRiwayat.activity_code === 'project.invite.accept'
                      || dataRiwayat.activity_code === 'project.leave'
                      || dataRiwayat.activity_code === 'project.invite.kick'
                      || dataRiwayat.activity_code === 'task.add'
                      || dataRiwayat.activity_code === 'task.update.desc'
                      "
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-1 text-sm font-weight-normal">
                  <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                  {{ dataRiwayat.event1 }}
                  <span
                    v-if="dataRiwayat.activity_code !== 'task.add'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.project_title }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'task.add' || dataRiwayat.activity_code === 'task.update.desc'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.task_title }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'task.add'"
                  >&nbsp;{{ dataRiwayat.event2 }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'task.add'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >&nbsp;{{ dataRiwayat.project_title }}</span>
                </h6>
                <p class="mb-0 text-xs text-secondary">
                  <i class="fa fa-clock me-1"></i>
                  {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                </p>
              </div>

              <!-- kondisi 2 (tampilan arrow edit task) -->
              <div
                v-if="dataRiwayat.activity_code === 'task.update.title'
                        || dataRiwayat.activity_code === 'task.update.status'
                        || dataRiwayat.activity_code === 'task.update.project'
                        || dataRiwayat.activity_code === 'task.update.priority'
                        || dataRiwayat.activity_code === 'task.update.start'
                        || dataRiwayat.activity_code === 'task.update.end'
                        || dataRiwayat.activity_code === 'project.update.title'
                        || dataRiwayat.activity_code === 'project.update.type'
                        || dataRiwayat.activity_code === 'project.update.color'
                        "
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-1 text-sm font-weight-normal">
                  <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                  {{ dataRiwayat.event1 }}
                  <span
                    v-if="dataRiwayat.activity_code === 'project.update.title'
                        || dataRiwayat.activity_code === 'project.update.type'
                        || dataRiwayat.activity_code === 'project.update.color'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.project_title }}</span>
                  <span
                    v-else
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.task_title }}</span>
                </h6>
                <p class="mb-0 text-xs text-secondary">
                  <i class="fa fa-clock me-1"></i>
                  {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                </p>
                <div
                  v-if="dataRiwayat.activity_code === 'project.update.color'"
                  class="mt-2 border-radius-sm d-inline-flex"
                  style="border: 0.3px solid gainsboro;"
                >
                  <p
                    class="text-sm text-secondary mb-2 mt-2"
                    style="margin-left: 10px; margin-right: 10px;"
                    :style="{'backgroundColor': dataRiwayat.before}"
                  >
                    {{ dataRiwayat.before }} &nbsp;
                    <span
                      class="text-dark"
                      style="font-weight: bolder;"
                      :style="{'backgroundColor': dataRiwayat.after}"
                    >
                      <i class="fas fa-arrow-right" />
                      &nbsp; {{ dataRiwayat.after }}
                    </span>
                  </p>
                </div>
                <div
                  v-if="dataRiwayat.activity_code !== 'task.add' || dataRiwayat.activity_code !== 'task.update.desc'"
                  class="mt-2 border-radius-sm d-inline-flex"
                  style="border: 0.3px solid gainsboro;"
                >
                  <p
                    class="text-sm text-secondary mb-2 mt-2"
                    style="margin-left: 10px; margin-right: 10px;"
                  >
                    {{ dataRiwayat.before }} &nbsp;
                    <span
                      class="text-dark"
                      style="font-weight: bolder;"
                    >
                      <i class="fas fa-arrow-right" />
                      &nbsp; {{ dataRiwayat.after }}
                    </span>
                  </p>
                </div>
              </div>
              <!-- kondisi 3 -->
              <div>
                <div
                  v-if="
                  dataRiwayat.activity_code === 'status.update.mobile'
                  || dataRiwayat.activity_code === 'status.delete'
                  || dataRiwayat.activity_code === 'status.add'
                  || dataRiwayat.activity_code === 'status.update.color'
                  || dataRiwayat.activity_code === 'status.update.title'
                  || dataRiwayat.activity_code === 'task.attachment.add'
                  || dataRiwayat.activity_code === 'task.attachment.delete'
                  || dataRiwayat.activity_code === 'task.comment.add'
                  "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span>{{ dataRiwayat.event2 }}</span>
                    <span v-if="dataRiwayat.activity_code === 'status.add'">{{ dataRiwayat.event3 }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'task.attachment.add' 
                      || dataRiwayat.activity_code === 'task.attachment.delete' 
                      || dataRiwayat.activity_code === 'task.comment.add'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >&nbsp;{{ dataRiwayat.task_title }}</span>
                    <span
                      v-else
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.project_title }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                  <div
                    v-if="dataRiwayat.activity_code === 'task.comment.add'"
                    class="mb-2 border-radius-sm mt-2"
                    style="background-color: #ffff; border: 0.3px solid gainsboro;"
                  >
                    <p
                      style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                    >{{ dataRiwayat.comment.comment }}</p>
                  </div>
                  <div
                    v-if="dataRiwayat.activity_code === 'task.comment.add' && dataRiwayat.comment.attachment !== null"
                    class="mb-2 border-radius-sm mt-2"
                    style="background-color: #ffff; border: 0.3px solid gainsboro;"
                  >
                    <p
                      style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                    >{{ dataRiwayat.comment.attachment }}</p>
                  </div>
                  <!-- arrow -->
                  <div
                    v-if="dataRiwayat.activity_code === 'status.update.title'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                  <!-- color -->
                  <div
                    v-if="dataRiwayat.activity_code === 'status.update.color'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                      :style="{'backgroundColor': dataRiwayat.before}"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                        :style="{'backgroundColor': dataRiwayat.after}"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <!-- kondisi 4 (tampilan blank default) -->
              <div
                v-if="
                      dataRiwayat.activity_code === 'project.invite.kick'
                      || dataRiwayat.activity_code === 'task.assign'
                      || dataRiwayat.activity_code === 'task.assign.leave'
                      || dataRiwayat.activity_code === 'project.update.mobile'
                      "
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-1 text-sm font-weight-normal">
                  <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                  {{ dataRiwayat.event1 }}
                  <span
                    v-if="dataRiwayat.activity_code === 'project.invite.kick' || dataRiwayat.activity_code === 'task.assign' || dataRiwayat.activity_code === 'task.assign.leave'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.targeted_full_name }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'project.update.mobile'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.targeted_full_name }}</span>
                  <span>&nbsp;{{ dataRiwayat.event2 }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'task.assign' || dataRiwayat.activity_code === 'task.assign.leave'"
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >&nbsp;{{ dataRiwayat.task_title }}</span>
                </h6>
                <p class="mb-0 text-xs text-secondary">
                  <i class="fa fa-clock me-1"></i>
                  {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                </p>
              </div>

              <!-- kondisi 5 (task delete and update mobile) -->
              <div
                v-if="
                      dataRiwayat.activity_code === 'task.delete'
                      || dataRiwayat.activity_code === 'task.update.mobile'
                      "
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-1 text-sm font-weight-normal">
                  <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                  {{ dataRiwayat.event1 }}
                  <span
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >&nbsp;{{ dataRiwayat.task_title }}</span>
                  <span>&nbsp;{{ dataRiwayat.event2 }}</span>
                  <span
                    class="font-weight-bold"
                    style="color: #00A2B9;"
                  >{{ dataRiwayat.project_title }}</span>
                  <span
                    v-if="dataRiwayat.activity_code === 'project.update.mobile'"
                  >&nbsp;{{ dataRiwayat.event3 }}</span>
                </h6>
                <p class="mb-0 text-xs text-secondary">
                  <i class="fa fa-clock me-1"></i>
                  {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                </p>
              </div>
            </div>
          </a>
          <div
            style="margin-top:5px;"
            v-if="isLoadingDataNotifPagination"
            class="d-flex justify-content-center"
          >
            <Loading />
          </div>
          <div v-else class="d-flex justify-content-center mt-3">
            <button
              @click="this.getRiwayatActivity(this.page +=1, 'pagination')"
              type="button"
              class="btn btn-outline-primary"
            >Lihat Lebih banyak</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService.js'
import { mapMutations, mapActions } from "vuex";
import { activateDarkMode, deactivateDarkMode } from "@/assets/js/dark-mode";
import { ToastError, ToastInfo } from "@/composables/toast";
import Loading from '../views/components/Loading.vue';
import moment from 'moment'
export default {
  name: "RiwayatAktivitasSide",
  props: ["toggle"],
  components: {
    Loading
  },
  data() {
    return {
      moment: moment,
      showSide: false,
      isLoadingDataNotifPagination: false,
      isLoadingDataNotif: false,
      stateRiwayat: [],
      page: 1,
      token: ''
    }
  },
  methods: {
    ...mapMutations(["navbarMinimize", "sidebarType", "navbarFixed"]),
        ...mapActions(["toggleSidebarColor", 'updateProjectIdAction',
      'updateFavoriteAction', 'updateShowNavbarAction']),

    onClickButton (event) {
      this.$emit('clicked', event)
    },
    sidebarColor(color = "success") {
      document.querySelector("#sidenav-main").setAttribute("data-color", color);
      this.$store.state.mcolor = `card-background-mask-${color}`;
    },
    sidebarType(type) {
      this.$store.state.sidebarType = type;
    },
    setNavbarFixed() {
      if (
        this.$route.name !== "Profile" ||
        this.$route.name !== "All Projects"
      ) {
        this.$store.state.isNavFixed = !this.$store.state.isNavFixed;
      }
    },
    setDarkMode() {
      if (this.$store.state.darkMode) {
        this.$store.state.darkMode = false;
        this.$store.state.sidebarType = "bg-white";
        deactivateDarkMode();
        return;
      } else {
        this.$store.state.darkMode = true;
        this.$store.state.sidebarType = "bg-default";
        activateDarkMode();
      }
    },

    colorRandom() {
      return Math.floor(Math.random() * 16777215).toString(16)
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
    
    // function to project detail
    toProjectDetail(value) {
      console.log("dari riwayat = ", value)
      let location = window.location.pathname;
      let breadcumbs = {
        condition: true,
        project_name: value.project_title
      }
      if (location === '/project/project-board') {
        if (value.task_id === null) {
          this.emitter.emit("params-project-detail-for-riwayat", value);
          this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
        } else {
          this.emitter.emit("params-task-project-detail", value);
          this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
        }
      }
    },
    
    // api riwayat aktivitas
    async getRiwayatActivity(page, loading) {
      let data = {
        token: this.token,
        page: page === undefined ? 1 : page
      }
      try {
        loading === "pagination" ? this.isLoadingDataNotifPagination = true : this.isLoadingDataNotif = true
        const response = await ApiService.riwayatActivity(data)
        loading === "pagination" ? this.isLoadingDataNotifPagination = false : this.isLoadingDataNotif = false
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("toData state riwayat = ", toData)
          if (toData !== undefined) {
            if (data.page === 1) {
              this.stateRiwayat = toData.data;
            } else {
              let respNextPages = toData.data;
              if (respNextPages.length === 0) {
                ToastInfo("Semua data Riwayat sudah ditampilkan")
              } else {
                this.stateRiwayat = this.stateRiwayat.concat(respNextPages)
              }
            }
          }
        }
      } catch (error) {
        loading === "pagination" ? this.isLoadingDataNotifPagination = false : this.isLoadingDataNotif = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else if (err === '') {
          ToastError('Riwayat Aktivitas: Server error')
        } else {
          ToastError(err)
        }
      }
    },
  },
  computed: {
    sidenavResponsive() {
      return this.sidenavTypeOnResize;
    }
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
    window.addEventListener("resize", this.sidenavTypeOnResize);
    window.addEventListener("load", this.sidenavTypeOnResize);
  },
  mounted() {
    this.getRiwayatActivity()  
  },
  created() {
    // get token
    if (window.location.hostname === 'localhost') {
      this.token = process.env.VUE_APP_TOKEN;
    } else {
      let token = this.$cookies.get("token_pesa");
      this.token = token;
    }
  },
};
</script>
<style scoped>
.btnBack {
  color: grey;
  cursor: pointer;
  padding: 5px 8px 5px 8px;
  margin-left: -32px;
  border: 1px solid gainsboro;
  background-color: white;
}
.scroll-side {
  max-height: 75vh;
  overflow-x: auto;
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
a.hover-click > div {
  transition: 0.3s;
  padding: 5px;
  border-radius: 5px;
}
a.hover-click:hover > div {
  background-color: rgb(228, 228, 228) !important;
  padding: 5px;
  border-radius: 5px;
}
</style>
