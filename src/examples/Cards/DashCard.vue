<template>
  <div class="card" style="background-color: #FFFFFF; border: 1px dashed; border-color: green;">
    <div class="card-body">
      <div class="mb-0 d-flex justify-content-center text-black">
        <a class="dropdown-item" href="/data" data-bs-target="#myModal" data-bs-toggle="modal">
          <span style="color: #00A2B9; font-weight: bolder; font-size: x-large;">+</span> &nbsp;&nbsp;Tambah Status
        </a>
      </div>
      <div class="modal" id="myModal">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <!-- modal header -->
            <div class="modal-header">
              <h5 class="modal-title">Buat Status</h5>
              <i type="button" data-bs-dismiss="modal" aria-label="Close" class="bi bi-x-lg"></i>
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
                  />
                </div>

                <div class="mb-3">
                  <label>Warna</label>
                  <div class="row w-70">
                    <div class="col-lg-2" v-for="(selectColors, index) in selectColor" :key="index">
                      <div
                        v-if="selectColors !== '#DDDDDD'"
                        @click="getColorValue(selectColors)"
                        class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                        :style="{backgroundColor: selectColors}"
                      >
                        <img
                          v-if="colorValue === selectColors"
                          class="position-absolute centered"
                          src="@/assets/img/icons/check.png"
                          alt="icon checklist"
                        />
                      </div>
                      <div
                        v-else
                        @click="moreColor = !moreColor"
                        class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                        :style="{backgroundColor: selectColors, display: moreColor === false ? 'flex' : 'none'}"
                      >
                        <img
                          class="position-absolute centered"
                          src="@/assets/img/icons/moreIcon.png"
                          alt="icon more"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p>Dengan membuat KPI / project, tim dan atasan anda akan automatis terundang ke dalam KPI / project.</p>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Batal</button>
              <button type="button" class="btn btn-primary">Buat KPI / Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dash-card",
  components: {},
  data() {
    return {
      upload: null,
      moreColor: false,
      colorValue: "",
      selectColor: [
        "#00A2B9",
        "#36B37E",
        "#F3AF00",
        "#DE350B",
        "#7039CB",
        "#DDDDDD"
      ]
    };
  },
  methods: {
       getColorValue(value) {
      this.colorValue = value;
    }
  },
}
</script>

<style scoped>
</style>