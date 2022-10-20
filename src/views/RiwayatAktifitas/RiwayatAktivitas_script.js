import ApiService from "../../services/ApiService";
import { mapActions } from "vuex";
import { ToastError, ToastInfo } from "@/composables/toast";
import Loading from '../components/Loading.vue';
import moment from 'moment'

export default {
  name: "RiwayatAktifitas",
  components: {
    Loading
  },
  data() {
    return {
      moment: moment,
      token: '',
      page: 1,
      isLoadingDataNotif: false,
      isLoadingDataNotifPagination: false,
      isLoadingAcc: false,
      isLoadingReject: false,
      isLoadingReadAll: false,
      dataAllNotif: [],
      stateRiwayat: [],
      colorRandomSingle: Math.floor(Math.random() * 16777215).toString(16),
    }
  },
  methods: {
    ...mapActions(["toggleSidebarColor", 'updateProjectIdAction',
      'updateFavoriteAction', 'updateShowNavbarAction']),
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
      console.log("dari riwayat = ",value)
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
    // get notification
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
}