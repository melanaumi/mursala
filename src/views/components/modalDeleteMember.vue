<template>
  <div class="modal" :id="`myModalDeleteMember${index}`" data-bs-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <!-- modal header -->
        <!-- <div class="modal-header-delete">
          <h5 style="color:black;" class="modal-title mt-2" id="exampleModalToggleLabel"></h5>
        </div>-->
        <!-- modal body -->
        <div class="modal-body">
          <div class="d-flex justify-content-end">
            <i type="button" data-bs-dismiss="modal" aria-label="Close" class="bi bi-x-lg"></i>
          </div>
          <div class="d-flex justify-content-center">
            <img width="110" src="@/assets/img/icons/info-icon.png" alt="icon info" />
          </div>
          <div class="d-flex justify-content-center">
            <h5>Hapus member</h5>
          </div>
          <div class="d-flex justify-content-center">
            <span>
              Penghapusan member akan mengakibatkan
              <strong>:</strong>
            </span>
          </div>
          <ul class="mt-2">
            <li>Member keluar dari project ini</li>
            <li>Semua task yang sudah ia kerjakan akan dihapus darinya</li>
          </ul>
        </div>
        <div class="modal-footer-delete d-flex justify-content-center">
          <button
            type="button"
            class="btn btn-primary w-35"
            @click="hitApiDelete()"
            data-bs-dismiss="modal"
          >Oke, Mengerti</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from '../../services/ApiService';
import { ToastError, ToastSuccess } from "../../composables/toast";

export default {
  name: "modalDeleteMember",
  props: {
    id_member: {
      type: String,
    },
    id_project: {
      type: String,
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      token: ''
    }
  },
  methods:{
    async hitApiDelete() {
      let data = {
        project_id : this.id_project,
        user_id : this.id_project,
        token : this.token
      }
      try {
        const response = await ApiService.kickUser(data)
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
  mounted() {
    console.log(this.id_member)
    console.log(this.id_project)
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
.modal:nth-of-type(even) {
    z-index: 1062 !important;
}
.modal-backdrop.show:nth-of-type(even) {
    z-index: 1061 !important;
}
</style>
