<template>
  <div>
    <div class="modal" :id="`modal-delete-task${task.id}`">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <!-- modal header -->
          <div class="modal-header">
            <h5
              style="color:black;"
              class="modal-title mt-2"
              id="exampleModalToggleLabel"
            >Hapus Status</h5>
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
                  Apakah Anda Yakin Ingin Menghapus Pekerjaan Ini?
                  Pekerjaan yang telah dihapus tidak dapat dikembalikan.
                </span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-primary w-35"
              data-bs-dismiss="modal"
              @click="hitApiDelete()"
            >Hapus Pekerjaan</button>
            <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Batalkan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import {ToastError, ToastSuccess} from "@/composables/toast";

export default {
  name: "modal-delete-task",
  props: {
    task: {
      type: String,
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      token: '',
      idTask: this.task.id,
      idStatus: this.task.task_group_header_id,
      idProject: this.task.project_id,
    }
  },
  methods:{
    async hitApiDelete() {
      try {
        const response = await ApiService.deleteTask(this.token, this.idTask, this.idStatus)
        console.log("delete = ", response)
        ToastSuccess("Pekerjaan Ini Berhasil Dihapus")
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
