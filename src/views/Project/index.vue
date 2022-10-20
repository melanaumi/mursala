<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <!-- if semua project dan favorite kosong -->
        <div
          class="row"
          v-if="stateFavorit.length === 0 &&
           stateSemuaProject.length === 0 &&
            loadingFav === false &&
             loadingAll === false"
        >
          <h5>Semua KPI / Project</h5>
          <div class="mt-4">
            <div class="d-flex mb-3 justify-content-center">
              <img src="@/assets/img/icons/project-list-empty.png" alt="icon info" />
            </div>
            <div class="d-flex justify-content-center">
              <h5>Belum ada project</h5>
            </div>
            <div class="d-flex justify-content-center">
              <span>Anda belum memiliki project. Buat project pertama anda sekarang!</span>
            </div>
            <div class="mt-4 d-flex justify-content-center">
              <button
                type="button"
                data-bs-target="#myModal"
                data-bs-toggle="modal"
                class="btn btn-primary w-20"
              >Buat Project</button>
            </div>
          </div>
        </div>

        <!-- else salah satu atau kedua state favorit dan semua project tidak kosong -->
        <div class="row" v-else>
          <!-- favorit Project -->
          <h5>Favorit</h5>
          <!-- if load data -->
          <div v-if="loadingFav" class="d-flex justify-content-center">
            <Loading />
          </div>
          <!-- else -->
          <div
            v-else
            class="col-lg-4 col-md-6 col-sm-6 col-12 mt-3 mb-1"
            v-for="(stateFavorits, index) in stateFavorit"
            :key="index"
          >
            <card
              @clicked="onClickChildFav"
              :dataAll="stateFavorit"
              :project_id="stateFavorits.id"
              :value="stateFavorits.project_name"
              :color="stateFavorits.color"
              :detail="stateFavorits.project_type_name"
              :fav="stateFavorits.is_favorite"
              :type="'roomFav'"
            ></card>
          </div>
          <!-- semua Project -->
          <div class="d-flex justify-content-between">
            <h5>Semua KPI / Project</h5>
            <button
              type="button"
              data-bs-target="#myModal"
              data-bs-toggle="modal"
              class="btn btn-primary"
            >
              <i class="fas fa-plus me-2"></i>Tambah KPI / Project
            </button>
          </div>
          <!-- if load data -->
          <div v-if="loadingAll" class="d-flex justify-content-center">
            <Loading />
          </div>
          <!-- else -->
          <div
            v-else
            class="col-lg-4 col-md-6 col-sm-6 col-12 mt-3"
            v-for="(stateSemuaProjects, index) in stateSemuaProject"
            :key="index"
          >
            <card
              @clicked="onClickChildAll"
              :dataAll="stateSemuaProject"
              :dataFavorite="stateFavorit"
              :project_id="stateSemuaProjects.id"
              :value="stateSemuaProjects.project_name"
              :color="stateSemuaProjects.color"
              :detail="stateSemuaProjects.type_name"
              :fav="stateSemuaProjects.is_favorite"
              :type="'roomAllProject'"
            ></card>
          </div>
          <div v-if="loadingAllPagination" class="d-flex justify-content-center">
            <Loading />
          </div>
        </div>
      </div>
    </div>
    <!-- button load all data project -->
    <div
      class="d-flex justify-content-center mt-2"
      v-if="stateFavorit.length !== 0 || stateSemuaProject.length !== 0"
    >
      <button
        @click="this.getAllProject(this.countPage +=1, 'pagination')"
        type="button"
        class="btn btn-outline-primary"
      >Lihat Lebih banyak</button>
    </div>

    <!-- modal add project -->
    <div class="modal" id="myModal" ref="modalAddProject" v-show="isModalShow">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <!-- modal header -->
          <div class="modal-header">
            <h5 class="modal-title">Buat KPI / Project</h5>
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
              <!-- nama project -->
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Nama KPI / Project</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Bisa berupa nama tim, tujuan proyek, atau lainnya"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  v-model="inputNameProject"
                />
              </div>
              <!-- deskripsi -->
              <div class="mb-3">
                <label for="floatingTextarea2">Deskripsi KPI / Project</label>
                <textarea
                  class="form-control"
                  placeholder="Tulis Deskripsi KPI / Project"
                  id="floatingTextarea2"
                  style="height: 100px"
                  v-model="inputDesProject"
                ></textarea>
              </div>
              <!-- select tipe project -->
              <div class="mb-3">
                <label for="floatingTextarea2">Tipe KPI / project</label>
                <select
                  class="form-select"
                  placeholder="Pilih tipe project"
                  aria-label="Default select example"
                  v-model="selectedTypesProject"
                >
                  <option style="color: #b5b5b3;" value="" disabled selected>Pilih Tipe Project</option>
                  <option
                    id="style-option"
                    v-for="(stateTypesProject, index) in stateTypesProjects"
                    :key="index"
                    :value="stateTypesProject.id"
                  >{{stateTypesProject.name}}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="floatingTextarea2">Warna</label>
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
                        src="../../assets/img/icons/check-lingkaran.png"
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
                        src="../../assets/img/icons/moreIcon.png"
                        alt="icon more"
                      />
                    </div>
                  </div>
                </div>
                <!-- jika true tampil jika false display none -->
                <!-- opacity warna  1 -->
                <div class="row w-70" v-if="moreColor">
                  <div
                    class="col-lg-2"
                    v-for="(selectColorsOpacitys1, index) in selectColorOpacity1"
                    :key="index"
                  >
                    <div
                      @click="getColorValue(selectColorsOpacitys1)"
                      class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                      :style="{backgroundColor: selectColorsOpacitys1, display: moreColor === true ? 'flex' : 'none'}"
                    >
                      <img
                        v-if="colorValue === selectColorsOpacitys1"
                        class="position-absolute centered"
                        src="../../assets/img/icons/check-lingkaran.png"
                        alt="icon checklist"
                      />
                    </div>
                  </div>
                </div>
                <!-- opacity warna 2 -->
                <div class="row w-70" v-if="moreColor">
                  <div
                    class="col-lg-2"
                    v-for="(selectColorsOpacitys2, index) in selectColorOpacity2"
                    :key="index"
                  >
                    <div
                      @click="getColorValue(selectColorsOpacitys2)"
                      class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
                      :style="{backgroundColor: selectColorsOpacitys2, cursor: pointer, display: moreColor === true ? 'flex' : 'none'}"
                    >
                      <img
                        v-if="colorValue === selectColorsOpacitys2"
                        class="position-absolute centered"
                        src="../../assets/img/icons/check-lingkaran.png"
                        alt="icon checklist"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p>Dengan membuat KPI / project, tim dan atasan anda akan automatis terundang ke dalam KPI / project.</p>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-primary"
              data-bs-dismiss="modal"
              @click="closeCreateProject"
            >Batal</button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="addProject"
            >Buat KPI / Project</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="js" src="./Project_script.js"></script>
<style scoped>
.centered {
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
  width: 95%;
  height: auto;
}
.roundedCustom {
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.roundedCustom:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>
