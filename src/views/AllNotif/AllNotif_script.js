import ApiService from "../../services/ApiService";
import { mapActions } from "vuex";
import { ToastError, ToastSuccess, ToastInfo } from "@/composables/toast";
import Loading from '../components/Loading.vue';
import moment from 'moment'

export default {
  name: "all-notif",
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
    // get notification
    async getNotification(page,loading) {
      let data = {
        token: this.token,
        page: page === undefined ? 1 : page
      }
      try {
        loading === "pagination" ? this.isLoadingDataNotifPagination = true : this.isLoadingDataNotif = true
        const response = await ApiService.notification(data)
        loading === "pagination" ? this.isLoadingDataNotifPagination = false : this.isLoadingDataNotif = false

        if (response !== undefined) {
          let toData = response.data.data;
          console.log("toData notification = ", toData)
          if (toData !== undefined) {
            if (data.page === 1) {
              this.dataAllNotif = toData.notifications.data;
            } else {
              let respNextPages = toData.notifications.data;
              if (respNextPages.length === 0) {
                ToastInfo("Semua data Notifikasi sudah ditampilkan")
              } else {
                this.dataAllNotif = this.dataAllNotif.concat(respNextPages)
              }
            }
          }
        }
      } catch (error) {
        loading === "pagination" ? this.isLoadingDataNotifPagination = false : this.isLoadingDataNotif = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    // read all
    async readAllNotification() {
      try {
        this.isLoadingReadAll = true
        const response = await ApiService.updateReadNotifAll(this.token)
        this.isLoadingReadAll = false
        console.log(response)
        ToastSuccess(response.data.message)
        this.getNotification()
      } catch (error) {
        this.isLoadingReadAll = false
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
      console.log("read single notif = ", value)
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
    async accInvitation(value, project_id, notif_id) {
      try {
        const data = {
          token: this.token,
          project_id: project_id,
          notif_id: notif_id
        }
        this.isLoadingAcc = true;
        const response = await ApiService.accInvitation(data)
        console.log("response acc = ", response)
        ToastSuccess(response.data.message)
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
        }, 1000)
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
    this.getNotification()
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