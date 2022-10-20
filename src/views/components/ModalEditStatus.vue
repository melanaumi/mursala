<template>
  <!-- Modal Edit Pekerjaan -->
  <div class="modal" :id="`modal-edit-status${index}`" v-show="isModalShow">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h5 class="modal-title">Perbarui Status</h5>
          <i type="button" data-bs-dismiss="modal" aria-label="Close" class="bi bi-x-lg"></i>
        </div>
        <!-- modal body -->
        <div class="modal-body">
          <form>
            <!-- nama project -->
            <div
              class="mb-3"
              v-if="propsTask.task_group_name !== 'TO DO' &&
               propsTask.task_group_name !== 'ON WORKING' &&
                propsTask.task_group_name !== 'DONE'"
            >
              <label class="form-label">Nama Status</label>
              <input
                v-model="inputStatusName"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label>Warna</label>
              <div class="row w-70">
                <div class="col-lg-2" v-for="(selectColors, index) in selectColor" :key="index">
                  <div
                    @click="getColorValue(selectColors)"
                    class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                    :style="{backgroundColor: selectColors}"
                  >
                    <img
                      v-if="colorValue === selectColors"
                      class="position-absolute centered w-95"
                      src="@/assets/img/icons/check-lingkaran.png"
                      alt="icon checklist"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Batal</button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="editStatus"
          >Perbarui Status</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/services/ApiService";
import {ToastError, ToastSuccess} from "@/composables/toast";

export default {
  name: 'modal-edit-status',
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
      inputStatusName: this.propsTask.task_group_name,
      isLoadingEditStatus: false,
      colorValue: "",
      isModalShow: true,
      selectColor: [
        "#DDDDDD",
        "#00A2B9",
        "#36B37E",
        "#F3AF00",
        "#DE350B",
        "#7039CB",
      ]
    }
  },
  methods: {
    getColorValue(value) {
      this.colorValue = value;
    },

    // Add Status
    async editStatus()  {
      const data = {
        token: this.token,
        board_id: this.propsTask.id,
        title: this.inputStatusName.toUpperCase(),
        color: this.colorValue
      }
      try {
        this.isLoadingEditStatus = true
        const response = await ApiService.editStatus(data)
        console.log(response)
        this.isModalShow = false
        ToastSuccess("Status Berhasil Diperbarui")
      } catch (error) {
        this.isLoadingEditStatus = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    showModal() {
      this.isModalShow = true;
    },

    closeModal() {
      this.isModalShow = false;
    }
  },
  mounted() {
    // console.log("props task = ",this.propsTask)
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
.centered {
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
}
.roundedCustom {
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.roundedCustom:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>
