<template>
  <div>
    <div class="modal" :id="`modal-delete-status${index}`" v-show="isModalShow">
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
                  Semua task yang ada di status ini akan dihapus dan anda tidak akan bisa melihatnya kembali.
                  Penghapusan ini tidak bisa diundo.
                </span>
              </div>
              <div class="mb-3">
                <p style="font-size: 15px;">Masukkan nama status untuk konfirmasi</p>
                <input
                  type="text"
                  placeholder="Tulis nama status"
                  class="form-control"
                  id="recipient-name"
                  v-model="inputStatusName"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-primary w-35"
              data-bs-dismiss="modal"
              @click="hitApiDelete()"
            >Hapus Status</button>
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
  name: "modal-delete-status",
  props: {
    propsTask: {
      type: String,
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      token: '',
      inputStatusName: '',
      isModalShow: true,
      project_id: this.propsTask.project_id,
      board_id: this.propsTask.id
    }
  },
  methods:{
    async hitApiDelete() {
      try {
        const response = await ApiService.deleteStatus(this.token, this.inputStatusName, this.project_id, this.board_id)
        console.log("delete = ", response)
        ToastSuccess("Status Berhasil Dihapus")
        this.getProjectDetail()
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
