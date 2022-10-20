<template>
  <div class="modal" id="modal-status" ref="modalAddStatus">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h5 class="modal-title">Buat Status</h5>
          <i
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
            class="bi bi-x-lg"
          ></i>
        </div>
        <!-- modal body -->
        <div class="modal-body">
          <form>
            <!-- nama project -->
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Nama Status</label>
              <input
                type="text"
                class="form-control"
                placeholder="Bisa berupa nama tim, tujuan proyek, atau lainnya"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                v-model="inputStatusName"
              />
            </div>

            <div class="mb-3">
              <label>Warna</label>
              <div class="row w-70">
                <div
                  class="col-lg-2"
                  v-for="(selectColors, index) in selectColor"
                  :key="index"
                >
                  <div
                    @click="getColorValue(selectColors)"
                    class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                    :style="{backgroundColor: selectColors}"
                  >
                    <img
                      v-if="colorValue === selectColors"
                      class="position-absolute centered"
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
          <button
            type="button"
            class="btn btn-outline-primary"
            data-bs-dismiss="modal"
            @click="clearAddStatus"
          >Batal</button>
          <button
            type="button"
            class="btn btn-primary"
            :loading="loadingAll"
            @click="addStatus"
          >Buat Status</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalAddStatus"
}
</script>

<style scoped>

</style>
