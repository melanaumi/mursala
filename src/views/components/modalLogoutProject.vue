<template>
  <div class="modal" id="myModalLogoutProject">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header-delete">
          <h5 style="color:black;" class="modal-title mt-2" id="exampleModalToggleLabel">
            Anda yakin ingin keluar dari project
            <!-- color state -->
            <span class="text-primary">UX/UI Design</span>
            ?
          </h5>
          <i
            style="margin-top: -20px;"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
            class="bi bi-x-lg"
          ></i>
        </div>
        <!-- modal body -->
        <div class="modal-body">
          <span style="font-size: 15px;">Berikut hal yang anda harus perhatikan <strong>:</strong></span>
          <ul>
            <li>Anda tidak akan bisa melihat semua kerjaan pada project ini lagi sampai anda diinvite kembali oleh kreator</li>
            <li>Semua kerjaan anda pada project ini akan dihapus dari daftar kerjaan anda termasuk kerjaan yang sudah selesai</li>
          </ul>
        </div>
        <div class="modal-footer-delete">
          <button
            type="button"
            class="btn btn-outline-primary w-35"
            data-bs-dismiss="modal"
            @click="hitApiDelete()"
          >Ya, keluar</button>
          <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Batalkan</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from '../../services/ApiService';
import { ToastError, ToastSuccess } from '../../composables/toast';
export default {
  name: "modal-delete",
  components:{
  },
  data() {
    return {
      token: '',
    }
  },
  methods:{
    async hitApiDelete() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let data = {
        project_id: id === "" ? dataCookie : id,
        token: this.token
      }
      try {
        const response = await ApiService.leaveProject(data)
        this.$cookies.remove('favorite');
        this.$cookies.remove('project_id');
        this.$cookies.remove('project_name');
        this.$router.push({name: 'KPI/Project'})
        ToastSuccess(response.data.data)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
        ToastError(err)
        }
      }
    }
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
</script>
<style scoped>
</style>