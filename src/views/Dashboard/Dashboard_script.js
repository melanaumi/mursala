import ListTaskCard from "@/views/components/ListTaskCard.vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
import { ToastError } from "../../composables/toast";
import ApiService from '../../services/ApiService';
import Loading from '../components/Loading.vue';
import { mapActions } from "vuex";
import moment from 'moment';

export default {
  name: "dashboard-default",
  data() {
    return {
      moment: moment,
      isLoadingRiwayat: false,
      isLoadingMyTask: false,
      isLoadingSchedule: false,
      token: '',
      dateSchedule: '',
      colorRandomSingle: Math.floor(Math.random() * 16777215).toString(16),
      terlambat: [],
      mendekati_deadline: [],
      semua_kerjaan: [],
      stateRiwayat: [],
      dataSchedules: [],
    };
  },
  components: {
    ListTaskCard, Datepicker, Loading
  },
  methods: {
    ...mapActions(["toggleSidebarColor", 'updateProjectIdAction',
      'updateFavoriteAction', 'updateShowNavbarAction']),
    ////////////////////////////////////////////////////// FUNCTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    toDetailRiwayatActivity() {
      this.$router.push({ name: 'Detail Riwayat Aktivitas' })
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

    ///////////////////////////////////////////////////// HIT API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    async getListTaskInDashboard() {
      let data = {
        token: this.token
      }
      try {
        this.isLoadingMyTask = true
        const response = await ApiService.listTask(data)
        this.isLoadingMyTask = false
        if (response !== undefined) {
          let toData = response.data.data;
          this.terlambat = toData.terlambat;
          this.mendekati_deadline = toData.mendekati_deadline;
          this.semua_kerjaan = toData.semua_kerjaan;
        }
      } catch (error) {
        this.isLoadingMyTask = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else if (err === '') {
          ToastError('Kerjaan saya: Server error')
        } else {
          ToastError(err)
        }
      }
    },

    async getListTaskSchedule() {
      let data = {
        token: this.token,
        date: this.dateSchedule
      }
      console.log("ini date", this.dateSchedule)
      try {
        this.isLoadingSchedule = true
        const response = await ApiService.listTaskSchedule(data)
        this.isLoadingSchedule = false
        if (response !== undefined) {
          let toData = response.data.data;
          this.dataSchedules = toData;

          console.log("response kalender = ", toData)
        }
      } catch (error) {
        this.isLoadingSchedule = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else if (err === '') {
          ToastError('Kalender: Server error')
        } else {
          ToastError(err)
        }
      }
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
        this.emitter.emit("params-project-detail", value);
        this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
      } else {
        this.$router.push({ name: 'Project Board' })
        this.addCookiesAndState(value.project_id, value.is_favorite, breadcumbs)
      }
    },

    async getRiwayatActivity() {
      let data = {
        token: this.token,
        page: 1
      }
      try {
        this.isLoadingRiwayat = true
        const response = await ApiService.riwayatActivity(data)
        this.isLoadingRiwayat = false
        if (response !== undefined) {
          let toData = response.data.data;
          this.stateRiwayat = toData.data;
          console.log("response riwayat = ", toData)
        }
      } catch (error) {
        this.isLoadingRiwayat = false
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
  mounted() {
    this.getListTaskInDashboard()
    this.getListTaskSchedule()
    this.getRiwayatActivity()
  },
  created() {
    console.log(window.location)
    this.$store.state.showNavbar = true;
    // get token
    if (window.location.hostname === 'localhost') {
      this.token = process.env.VUE_APP_TOKEN;
    } else {
      let token = this.$cookies.get("token_pesa");
      this.token = token;
    }
  }
};
