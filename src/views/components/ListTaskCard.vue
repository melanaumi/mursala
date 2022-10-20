<template>
  <div class="card">
    <div class="p-3 mt-1 card-header">
      <h5 class="mb-0">{{ cardTitle }}</h5>
    </div>
    <div style="margin-top:5px;" v-if="isLoadingMyTask" class="d-flex justify-content-center">
      <Loading />
    </div>
    <div class="card-body p-3 mb-2 scroll" v-else>
      <!-- terlambat -->
      <div>
        <div
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
          style="cursor: pointer;"
          @click="showDesLate = !showDesLate"
        >
          <h6>
            <i
              :class="showDesLate === true ? 'bi bi-chevron-up text-primary' : 'bi bi-chevron-right'"
              aria-hidden="true"
            ></i>
            {{ title }}
            <span class="fw-normal">({{ terlambat.length }})</span>
          </h6>
          <hr class="divider" />
        </div>
        <div class="dropdown-item m-0 p-0" v-for="(terlambats, index) in terlambat" :key="index">
          <a
            :class="showDesLate === true ? 'colapse d-inline' : 'd-inline colapse d-none'"
            id="collapseExample"
            href="javascript:;"
            @click="terlambats.id === undefined || terlambats.id ===  null ? null : toTaskDetail(terlambats)"
            :data-bs-target="terlambats.id === undefined || terlambats.id ===  null ? '#modal-del-kpi' : ''"
            :data-bs-toggle="terlambats.id === undefined || terlambats.id ===  null ? 'modal' : ''"
          >
            <div class="d-flex justify-content-between align-items-center mx-3">
              <div data-bs-target="#modal-del-kpi" data-bs-toggle="modal" class="my-2">
                <span style="font-size: 15px; color: black;">{{ terlambats.title }}</span>
                <br />
                <span
                  style="font-size: 13px; color: grey;"
                  class="text-dark"
                >{{ terlambats.project.project_name }}</span>
              </div>
              <div>
                <span
                  style="font-size: 13px; color: #00A2B9;"
                  class="fw-bold"
                >{{ terlambats.end_datetime == null ? '' : moment(terlambats.end_datetime).locale('id').format("DD MMM") }}</span>
              </div>
            </div>
            <hr class="divider" />
          </a>
        </div>
      </div>
      <!-- mendekati deadline -->
      <div>
        <div
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample1"
          aria-expanded="false"
          aria-controls="collapseExample1"
          style="cursor: pointer;"
          @click="showDesDeadline = !showDesDeadline"
        >
          <h6 class="mt-3">
            <i
              :class="showDesDeadline === true ? 'bi bi-chevron-up text-primary' : 'bi bi-chevron-right'"
              aria-hidden="true"
            ></i>
            {{ title2 }}
            <span class="fw-normal">({{ mendekati_deadline.length }})</span>
          </h6>
          <hr class="divider" />
        </div>
        <div
          class="dropdown-item m-0 p-0"
          v-for="(mendekati_deadlines, index) in mendekati_deadline"
          :key="index"
        >
          <a
            :class="showDesDeadline === true ? 'colapse d-inline' : 'd-inline colapse d-none'"
            id="collapseExample1"
            href="javascript:;"
            @click="mendekati_deadlines.id === undefined || mendekati_deadlines.id ===  null ? null : toTaskDetail(mendekati_deadlines)"
            :data-bs-target="mendekati_deadlines.id === undefined || mendekati_deadlines.id ===  null ? '#modal-del-kpi' : ''"
            :data-bs-toggle="mendekati_deadlines.id === undefined || mendekati_deadlines.id ===  null ? 'modal' : ''"
          >
            <div class="d-flex justify-content-between align-items-center mx-3">
              <div data-bs-target="#modal-del-kpi" data-bs-toggle="modal" class="my-2">
                <span style="font-size: 15px; color: black;">{{ mendekati_deadlines.title }}</span>
                <br />
                <span
                  style="font-size: 13px; color: grey;"
                  class="text-dark"
                >{{ mendekati_deadlines.project.project_name }}</span>
              </div>
              <div>
                <span
                  style="font-size: 13px; color: #00A2B9;"
                  class="fw-bold"
                >{{ mendekati_deadlines.end_datetime == null ? '' : moment(mendekati_deadlines.end_datetime).locale('id').format("DD MMM") }}</span>
              </div>
            </div>
            <hr class="divider" />
          </a>
        </div>
      </div>
      <!-- semua kerjaan -->
      <div>
        <div
          data-bs-toggle="collapse"
          data-bs-target="#collapseExample2"
          aria-expanded="false"
          aria-controls="collapseExample2"
          style="cursor: pointer;"
          @click="showDesAll = !showDesAll"
        >
          <h6 class="mt-3">
            <i
              :class="showDesAll === true ? 'bi bi-chevron-up text-primary' : 'bi bi-chevron-right'"
              aria-hidden="true"
            ></i>
            {{ title3 }}
            <span class="fw-normal">({{ semua_kerjaan.length }})</span>
          </h6>
          <hr class="divider" />
        </div>
        <div
          class="dropdown-item m-0 p-0"
          v-for="(semua_kerjaans, index) in semua_kerjaan"
          :key="index"
        >
          <a
            :class="showDesAll === true ? 'd-inline colapse' : 'd-inline colapse d-none'"
            id="collapseExample2"
            href="javascript:;"
            @click="semua_kerjaans.id === undefined || semua_kerjaans.id ===  null ? null : toTaskDetail(semua_kerjaans)"
            :data-bs-target="semua_kerjaans.id === undefined || semua_kerjaans.id ===  null ? '#modal-del-kpi' : ''"
            :data-bs-toggle="semua_kerjaans.id === undefined || semua_kerjaans.id ===  null ? 'modal' : ''"
          >
            <div class="d-flex justify-content-between align-items-center mx-3">
              <div data-bs-target="#modal-del-kpi" data-bs-toggle="modal" class="my-2">
                <span style="font-size: 15px; color: black;">{{ semua_kerjaans.title }}</span>
                <br />
                <span
                  style="font-size: 13px; color: grey;"
                  class="text-dark"
                >{{ semua_kerjaans.project.project_name }}</span>
              </div>
              <div>
                <span
                  style="font-size: 13px; color: #00A2B9;"
                  class="fw-bold"
                >{{ semua_kerjaans.end_datetime == null ? '' : moment(semua_kerjaans.end_datetime).locale('id').format("DD MMM") }}</span>
              </div>
            </div>
            <hr class="divider" />
          </a>
        </div>
      </div>
      <!-- modal -->
      <div class="modal" id="modal-del-kpi">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <!-- modal header -->
            <div class="modal-header-delete justify-content-end mt-4">
              <i
                style="margin-top: -20px;"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                class="bi bi-x-lg"
              ></i>
            </div>
            <!-- modal body -->
            <div class="modal-body text-center">
              <img src="@/assets/img/icons/delpro.png" />
              <h3 class="mt-3">Oops, KPI / Project Ini Telah Dihapus.</h3>
              <p>Kamu tidak dapat melihat detail KPI / Project yang telah dihapus.</p>
            </div>
            <div class="modal-footer-delete justify-content-center">
              <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Oke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Loading from './Loading.vue'
import { mapActions } from 'vuex'

export default {
  name: "list-task-card",
  components: {
    Loading
  },
  data() {
    return {
      moment: moment,
      showDesLate: false,
      showDesDeadline: false,
      showDesAll: false,
      deskripsiValue: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    };
  },
  props: {
    isLoadingMyTask: {
      type: Boolean
    },
    cardTitle: {
      type: String,
      default: "Kerjaan Saya",
    },
    title: {
      type: String,
      default: "Terlambat",
    },
    title2: {
      type: String,
      default: "Mendekati Deadline",
    },
    title3: {
      type: String,
      default: "Semua Pekerjaan",
    },
    terlambat: {
      type: Array,
      required: true
    },
    mendekati_deadline: {
      type: Array,
      required: true
    },
    semua_kerjaan: {
      type: Array,
      required: true
    },
  },
   watch: {
    terlambat (n, o) {
      console.log("terlambat = ",n, o) // n is the new value, o is the old value.
    },
    mendekati_deadline (n, o) {
      console.log("mendekati_deadline = ",n, o) // n is the new value, o is the old value.
    },
    semua_kerjaan (n, o) {
      console.log("semua_kerjaan = ",n, o) // n is the new value, o is the old value.
    }
  },
  methods: {
    ...mapActions(["toggleSidebarColor", 'updateProjectIdAction',
      'updateFavoriteAction', 'updateShowNavbarAction']),

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
    // function to task detail
    toTaskDetail(value) {
      let location = window.location.pathname;
      let breadcumbs = {
        condition: true,
        project_name: value.project.project_name
      }
      if (location === '/project/project-board') {
        this.emitter.emit("params-task-project-detail", value.project);
        this.addCookiesAndState(value.project.id, value.project.is_favorite, breadcumbs)
      } else {
        // console.log("task detail = ", value)
        this.$router.push({ name: 'Project Board' })
        this.addCookiesAndState(value.project.id, value.is_favorite, breadcumbs)
      }
    },
  },
  mounted() {
  }
};
</script>
<style scoped>
hr.divider {
  margin: 0em;
  border-width: 2px;
}
.scroll {
  max-height: 700px;
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
