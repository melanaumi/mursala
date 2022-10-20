<template>
  <div class="modal" id="myModalDeleteProject">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header-delete">
          <h5
            style="color:black;"
            class="modal-title mt-2"
            id="exampleModalToggleLabel"
          >Hapus KPI / Project</h5>
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
          <form>
            <div
              style="color: black; font-size:13px; background-color: #FFF5E9;"
              class="alert d-flex align-items-center"
              role="alert"
            >
              <i class="text-warning fs-4 bi bi-exclamation-triangle me-3"></i>
              <span>
                Semua pekerjaan dan aktivitas yang ada di KPI / project ini akan di hapus,
                dan anda tidak akan bisa membukanya kembali. Penghapusan ini tidak bisa diundo.
              </span>
            </div>
            <div class="mb-3">
              <p
                style="font-size: 15px;"
              >Masukkan nama KPI / project untuk konfirmasi proyek yang ingin Anda hapus</p>
              <input
                v-model="project_name"
                type="text"
                placeholder="Tulis nama KPI / project"
                class="form-control"
                id="recipient-name"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer-delete">
          <button
            type="button"
            class="btn btn-outline-primary w-35"
            data-bs-dismiss="modal"
            @click="hitApiDelete()"
          >Hapus KPI / Project</button>
          <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Batalkan</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ToastError, ToastSuccess } from '../../composables/toast';
import ApiService from '../../services/ApiService';

export default {
  name: "modal-delete",
  props: {
    id_project: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      token: '',
      project_name: '' 
    }
  },
  methods:{
    async hitApiDelete() {
      let data = {
        id: this.id_project,
        project_name: this.project_name
      }
      try {
        const response = await ApiService.deleteProject(this.token, data)
        this.$router.push({name: 'KPI/Project'})
        this.$cookies.remove('favorite');
        this.$cookies.remove('project_id');
        this.$cookies.remove('project_name');
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