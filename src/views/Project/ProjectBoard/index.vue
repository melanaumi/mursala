<template>
  <main id="project-board">
    <div class="container-fluid mt-6">
      <div
        class="min-height-160"
        :style="{'backgroundColor': dataDetails.color === '' ? '#00a2b9' : dataDetails.color}"
        style="margin-right: -24px; margin-left: -34%;"
      >
        <span class="mask opacity-6"></span>
      </div>
      <div v-if="isLoadingDetailProject" class="d-flex justify-content-center">
        <Loading />
      </div>
      <div v-else class="mt-n7 mb-4" style="position: relative;">
        <div class="p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <!-- not hover -->
              <div
                id="palletWarna"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
                class="avatar avatar-xxl avatar-size-50 position-relative roundedCustom"
                style="background-color: white; cursor: pointer;"
              >
                <div
                  class="avatar avatar-xxl avatar-size-50 position-relative"
                  style="cursor: pointer;"
                  :style="{ 'backgroundColor': hexToRgbA(dataDetails.color === '' ? '#080808' : dataDetails.color) }"
                >
                  <div
                    class="avatar avatar-xxl avatar-size-50 position-absolute hoverEdit"
                    style="background-color: rgba(255, 255, 255, .6); cursor: pointer;"
                  >
                    <img
                      class="hoverImage"
                      style="width: 35px;"
                      src="../../../assets/img/icons/edit-avatar.png"
                      alt="icon edit"
                    />
                  </div>
                  <p
                    class="hoverText"
                    style="font-size: 20pt; font-weight: bolder; margin-top: 15px;"
                    :style="{'color': dataDetails.color === '' ? 'black' : dataDetails.color}"
                  >{{getInitials(dataDetails.project_name)}}</p>
                </div>
              </div>
              <palletColor @clicked="valueColorChild" />
            </div>
            <div class="col-8 my-auto">
              <div class="h-100">
                <!-- dropdown edit tipe project -->
                <div id="dropdownEditTipeProject" data-bs-toggle="dropdown" aria-expanded="false">
                  <span
                    style="cursor: pointer;"
                    :class="dataTypeProject.name === 'KPI' ? 'bg-kpi ms-2 d-inline-block py-1 px-2 rounded-2'
                    : dataTypeProject.name === 'Tupoksi' ? 'bg-tupoksi ms-2 d-inline-block py-1 px-2 rounded-2'
                      : 'bg-lainnya ms-2 d-inline-block py-1 px-2 rounded-2'"
                  >
                    <p
                      style="font-size:13px;"
                      class="m-0 text-center fw-bold"
                    >{{dataTypeProject.name}}</p>
                  </span>
                </div>
                <ul class="dropdown-menu" aria-labelledby="dropdownEditTipeProject" role="menu">
                  <div
                    class="p-2 d-flex"
                    v-for="(setTipeProject, index) in  dataTypesProject"
                    :key="index"
                  >
                    <a
                      class="dropdown-item fw-bold"
                      style="cursor: pointer;"
                      @click="updateTypeProject(setTipeProject)"
                    >{{setTipeProject.name}}</a>
                  </div>
                </ul>
                <!-- end dropdown -->

                <div class="mt-1 mb-2 d-flex text-white justify-content-start align-items-center">
                  <div>
                    <input
                      id="hideborder"
                      class="form-control text-white"
                      type="text"
                      v-model="dataDetails.project_name"
                      v-autowidth="{
                        minWidth: '75px'
                      }"
                      @change="updateJudulProject"
                    />
                  </div>&nbsp;
                  <!-- dropdown list project untuk pindah project-->
                  <span
                    id="dropdownListProject"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    class="text-white mx-2"
                    style="cursor: pointer; text-transform: none;"
                  >
                    <i class="fas fa-chevron-down text-white-50" aria-hidden="true"></i>
                  </span>
                  <ul
                    class="dropdown-menu dropdown-menu-end ul-scrollbar"
                    aria-labelledby="dropdownListProject"
                    role="menu"
                    style="max-height: 400px; overflow-y: auto;"
                  >
                    <div class="d-flex justify-content-center">
                      <div class="search-project w-95">
                        <i class="fa fa-search"></i>
                        <input
                          id="dropdownListProject"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          type="text"
                          class="form-control"
                          placeholder="Cari KPI / Project"
                          v-model="initModelSearchProject"
                        />
                      </div>
                    </div>
                    <div
                      style="width: 400px; margin-top:5px;"
                      v-if="isLoadingSearch"
                      class="d-flex justify-content-center"
                    >
                      <Loading />
                    </div>
                    <p
                      style="width: 400px; margin-top:5px; text-align: center;"
                      v-if="listProject.length === 0 && isLoadingSearch === false"
                    >KPI / Project tidak ditemukan</p>
                    <div
                      v-else
                      class="d-flex"
                      v-for="(setListProject, index) in filteredSearchProject"
                      :key="index"
                      style="width: 400px;"
                    >
                      <a
                        href="javascript:;"
                        class="dropdown-item"
                        @click="getListProjectValue(setListProject)"
                      >
                        <div class="d-flex align-items-center position-relative my-2">
                          <div
                            style="width:55px; height: 55px;"
                            class="rounded-2 d-flex justtify-content-center"
                            :style="{'backgroundColor': hexToRgbA(setListProject.color === null ? '#080808' : setListProject.color)}"
                          >
                            <div style="width:55px;">
                              <p
                                :style="{'color': setListProject.color === null ? 'black' : setListProject.color}"
                                class="fs-4 p-1 text-center mt-1 fw-bold"
                              >{{ getInitials(setListProject.project_name) }}</p>
                            </div>
                          </div>
                          <div style="width: 55px; color: black;">
                            <span class="font-weight-normal ms-3">{{ setListProject.project_name }}</span>
                          </div>
                          <div
                            v-if="setListProject.is_favorite === 1"
                            class="position-absolute right"
                          >
                            <img src="@/assets/img/icons/star3.png" />
                          </div>
                        </div>
                      </a>
                    </div>
                  </ul>
                  <!-- end dropdown -->
                </div>
                <div>
                  <textarea
                    class="form-control"
                    @change="updateDescriptionProject"
                    v-model="dataDetails.description"
                    @input="resize()"
                    ref="textarea"
                    id="hideborderTextArea"
                  ></textarea>
                  <div
                    :class="showDesMore === true ? 'colapse d-inline' : 'd-inline colapse d-none'"
                    id="collapseExample"
                  >
                    <div
                      class="border-radius-md bg-transparent w-60 mt-2 mx-2"
                      style="border: 1px solid gainsboro;"
                    >
                      <div
                        style="margin-top: 10px; margin-right: 10px; margin-left: 10px; margin-bottom: 5px;"
                      >
                        <h6 class="fw-normal">Kreator</h6>
                        <div class="row mt-2">
                          <div class="col-lg-2">
                            <div
                              :style="{'background': '#'+colorRandomSingle, 'borderRadius': '9px'}"
                              class="avatar avatar-lg avatar-size-50 mb-1"
                            >
                              <h4 class="text-white mt-2">{{getInitials(dataAuthor.fullname)}}</h4>
                            </div>
                          </div>
                          <div class="col-lg-10">
                            <h5 style="color: black;">{{dataAuthor.fullname}}</h5>
                            <p style="font-size:14px;">{{dataAuthor.long_name}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    style="cursor: pointer;"
                    @click="showDesMore = !showDesMore"
                    class="mx-3 mt-4 position-relative"
                  >
                    <span
                      class="fw-bold text-primary"
                      :class="showDesMore === true ? 'text-Less position-absolute mt-1' : 'text-More position-absolute mt-1'"
                      aria-hidden="true"
                    >
                      <i
                        :class="showDesMore === true ? 'fas fa-chevron-up position-absolute mt-1 mx-10' : 'fas fa-chevron-down position-absolute mt-1 mx-10'"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
    <div v-if="isLoadingDetailProject" class="d-flex justify-content-center">
      <Loading />
    </div>
    <div v-else class="py-4">
      <div class="card shadow-none bg-transparent">
        <div class="p-3">
          <div class="d-flex align-items-center justify-content-end">
            <div style="margin: 10px;">
              <div class="avatar-group">
                <a
                  v-for="(setMembers, index) in dataProjectMember"
                  :key="index"
                  href="javascript:;"
                  class="border-0 avatar avatar-sm rounded-circle"
                  data-bs-placement="bottom"
                  data-bs-target="#myModalUndangMember"
                  data-bs-toggle="modal"
                  :title="setMembers.full_name"
                  :style="{'backgroundColor': '#'+colorRandom(), 'fontWeight': 'bold', 'color': 'white'}"
                >{{getInitials(setMembers.full_name)}}</a>
                <a
                  v-if="dataProjectMember.length > 8"
                  href="javascript:;"
                  class="border-0 avatar avatar-sm rounded-circle"
                  data-bs-placement="bottom"
                  data-bs-target="#myModalUndangMember"
                  data-bs-toggle="modal"
                  title="16 More"
                  style="background-color: gainsboro; font-weight: bold; color: grey;"
                >+16</a>
              </div>
            </div>
            <div style="margin: 10px;">
              <argon-button
                color="primary"
                size="sm"
                data-bs-target="#myModalUndangMember"
                data-bs-toggle="modal"
              >
                <img src="../../../assets/img/icons/user-plus.png" />&nbsp;&nbsp;Undang
              </argon-button>
            </div>
            <div style="margin: 10px;">
              <!-- star favorite -->
              <div style="cursor: pointer;" v-if="is_favorite === 1" @click="removeToFavorite">
                <img src="../../../assets/img/icons/star3.png" />
              </div>
              <div style="cursor: pointer;" v-if="is_favorite === 0" @click="addToFavorite">
                <img
                  :src="defaultHover"
                  v-on:mouseover="mouseInStar"
                  v-on:mouseleave="mouseOutStar"
                />
              </div>
            </div>
            <div class="pe-md-3 d-flex align-items-center" style="margin: 10px;">
              <div class="search rounded-pill">
                <i class="fa fa-search"></i>
                <input
                  id="dropdownSearchCard"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  list="dataTask_Project"
                  type="text"
                  class="form-control"
                  placeholder="Cari Pekerjaan"
                  v-model="initModelSearchTask"
                />
                <datalist
                  aria-labelledby="dropdownSearchCard"
                  id="dataTask_Project"
                  class="dropdown-menu dropdown-menu-end datalist-scrollbar"
                  style="max-height: 380px; overflow-y: auto;"
                >
                  <div
                    style="width: 380px; margin-top:5px;"
                    v-if="isLoadingSearch"
                    class="d-flex justify-content-center"
                  >
                    <Loading />
                  </div>
                  <p
                    style="width: 380px; margin-top:5px; text-align: center;"
                    v-if="listTask.length === 0 && isLoadingSearch === false"
                  >Pekerjaan tidak ditemukan</p>
                  <div v-else style="width: 380px;">
                    <a
                      href="javascript:;"
                      class="dropdown-item"
                      v-for="(listTasks, index) in filteredSearchTask"
                      :key="index"
                      :data-bs-target="`#modal-detail-task${listTasks.id}`"
                      data-bs-toggle="modal"
                    >
                      <div class="d-flex align-items-center position-relative">
                        <div class="w-70">
                          <h6
                            style="color:black;"
                            class="font-weight-normal ms-2"
                          >{{listTasks.title}}</h6>
                          <span class="text-primary font-weight-normal ms-2">
                            {{moment(listTasks.end_datetime).locale("id").format("ll") === 'Invalid date' ?
                            'Tidak memiliki timeline' :
                            moment(listTasks.end_datetime).locale("id").format("ll")}}
                          </span>
                        </div>
                        <div class="position-absolute right">
                          <span
                            style="font-size:14px;"
                            :style="[`backgroundColor: ${hexToRgbA(listTasks.status_color)}; color: ${listTasks.status_color};`]"
                            class="fw-bold p-1 rounded-1"
                          >{{listTasks.task_group_name}}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </datalist>
              </div>
            </div>
            <!-- dropdown filter -->
            <div style="margin: 1px;">
              <button
                class="border-0 rounded-circle bg-transparent"
                type="button"
                id="dropdownFilter"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src="../../../assets/img/icons/Filter.png" />
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownFilter" role="menu">
                <div class="mt-2">
                  <span style="font-size: 18px;" class="text-dark fw-bold ms-3">Filter</span>
                  <hr />
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonCheckbox style="margin-right: 10px;">Ditugaskan kepada saya</ArgonCheckbox>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonCheckbox style="margin-right: 10px;">
                      <img class="me-2" src="../../../assets/img/icons/semi-deadline.png" />Mendekati deadline
                    </ArgonCheckbox>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonCheckbox style="margin-right: 10px;">
                      <img class="me-2" src="../../../assets/img/icons/deadline.png" />Terlambat
                    </ArgonCheckbox>
                  </a>
                </div>
              </ul>
            </div>
            <!-- dropdown sort -->
            <div style="margin-top: 1px;">
              <button
                class="border-0 rounded-circle bg-transparent"
                type="button"
                id="dropdownSort"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img class="w-100" src="../../../assets/img/icons/Sort.png" />
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownSort" role="menu">
                <div class="mt-2">
                  <span style="font-size: 18px;" class="text-dark fw-bold ms-3">Urutkan</span>
                  <hr />
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Batas Waktu</ArgonRadio>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Prioritas Tertinggi</ArgonRadio>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Prioritas Terendah</ArgonRadio>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Paling Baru</ArgonRadio>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Paling Lama</ArgonRadio>
                  </a>
                </div>
                <div class="p-2 d-flex">
                  <a class="dropdown-item" href="/data">
                    <ArgonRadio style="margin-right: 10px;">Nama Pekerjaan (A - Z)</ArgonRadio>
                  </a>
                </div>
              </ul>
            </div>

            <!-- dropdown aktivitas dan delete project -->
            <div style="margin-top: 1px;">
              <button
                class="border-0 rounded-circle bg-transparent"
                type="button"
                id="dropdownAktivitas"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img class="w-100" src="../../../assets/img/icons/Cho.png" />
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownAktivitas" role="menu">
                <button
                  class="p-1 d-flex align-items-center dropdown-item"
                  @click="showRiwayat = !showRiwayat"
                >
                  <div class="position-absolute mx-1">
                    <img style src="../../../assets/img/icons/aktivitas_dropdown.png" />
                  </div>
                  <div class="mx-3">
                    <button type="button" class="dropdown-item">Aktivitas</button>
                  </div>
                </button>
                <button
                  class="p-1 d-flex align-items-center dropdown-item"
                  data-bs-target="#myModalLogoutProject"
                  data-bs-toggle="modal"
                  v-if="!is_kreator"
                >
                  <div class="position-absolute">
                    <img style src="../../../assets/img/icons/bx_log-in.png" />
                  </div>
                  <div class="mx-3">
                    <button
                      type="button"
                      data-bs-target="#myModalLogoutProject"
                      data-bs-toggle="modal"
                      class="dropdown-item"
                    >Keluar dari KPI / project</button>
                  </div>
                </button>
                <button
                  class="p-1 d-flex align-items-center dropdown-item"
                  data-bs-target="#myModalDeleteProject"
                  data-bs-toggle="modal"
                  v-else
                >
                  <div class="position-absolute" style="margin-left: 2px;">
                    <img style src="../../../assets/img/icons/deleteIcon.png" />
                  </div>
                  <div class="mx-3">
                    <button
                      type="button"
                      data-bs-target="#myModalDeleteProject"
                      data-bs-toggle="modal"
                      class="dropdown-item"
                    >Hapus KPI / project</button>
                  </div>
                </button>
              </ul>
            </div>
          </div>
          <!-- modal undang member -->
          <modalUndangMember />
          <!-- modal logout project -->
          <modalLogoutProject />
          <!-- modal delete project -->
          <modalDeleteProject :id_project="dataDetails.id" />
          <!-- side riwayat aktivitas-->
          <RiwayatAktivitasSide
            :toggle="showRiwayat"
            :class="[showRiwayat ? 'show' : '']"
            @clicked="onClickChild"
          />
          <!-- task -->
          <div class="outer-wrapper">
            <div class="d-flex mt-3 inner-wrapper">
              <draggable
                v-model="dataProjectBoards"
                class="d-flex"
                :animation="200"
                ghost-class="ghost-card"
                group="dataProjectBoards"
                :disabled="false"
                @start="draStatus=true"
                :move="checkMoveStatus"
                @end="dragStatus=false"
                item-key="id"
              >
                <template #item="{element, index}">
                  <div style="width:350px;" class="mx-3">
                    <div class="rounded-3" style="background-color: #EFEFEF;">
                      <div
                        class="card-header d-flex justify-content-between pb-0 px-3"
                        style="background-color: #EFEFEF;"
                      >
                        <!-- judul status -->
                        <p>
                          <span
                            style="font-size:14px;"
                            :style="[

                          element.task_group_name === '' ? '' : { 'backgroundColor': hexToRgbA(element.color === '' ? '#080808' : element.color), 'color': element.color }
                          ]"
                            class="fw-bold p-1 rounded-1"
                          >{{element.task_group_name}}</span>
                          &nbsp;- {{element.taskrow.length}}
                        </p>
                        <div>
                          <!-- modal add task -->
                          <ModalAddTask :index="index" :propsTask="element" />
                          <!-- modal edit task -->
                          <ModalEditStatus :index="index" :propsTask="element" />
                          <!-- modal edit task -->
                          <ModalDeleteStatus :index="index" :propsTask="element" />
                          <!-- Menu Status -->
                          <button
                            class="border-0"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img class="w-80" src="@/assets/img/icons/Cho.png" />
                          </button>
                          <ul
                            class="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                            role="menu"
                          >
                            <div class="p-2 d-flex">
                              <a
                                class="dropdown-item"
                                href="javascript:;"
                                :data-bs-target="`#modal-edit-status${index}`"
                                data-bs-toggle="modal"
                                :board_id="element.id"
                              >
                                <i class="fas fa-pencil-alt text-dark me-2" />Perbarui Status
                              </a>
                            </div>
                            <div
                              v-if="element.task_group_name !== 'TO DO' &&
                         element.task_group_name !== 'ON WORKING' &&
                          element.task_group_name !== 'DONE'"
                              class="p-2 d-flex"
                            >
                              <a
                                class="dropdown-item"
                                href="javascript:;"
                                :data-bs-target="`#modal-delete-status${index}`"
                                data-bs-toggle="modal"
                                :board_id="element.id"
                              >
                                <i class="fas fa-trash text-dark me-2" />Hapus Status
                              </a>
                            </div>
                          </ul>
                        </div>
                      </div>
                      <div class="card-body pt-2 p-3 scroll">
                        <draggable
                          v-model="element.taskrow"
                          class="bigger-area"
                          :animation="200"
                          :disabled="dragLoading === true ? true : false"
                          ghost-class="ghost-card"
                          group="taskrow"
                          @start="drag=true"
                          :move="checkMove"
                          @change="finish(element.id)"
                          @end="drag=false"
                          item-key="id2"
                        >
                          <template #item="{element, index}">
                            <TaskCard :dragLoading="dragLoading" :index="index" :task="element" class="mt-3 cursor-move" />
                          </template>
                        </draggable>
                      </div>
                      <!-- Tambah Pekerjaan -->
                      <div
                        class="card shadow-none p-3 rounded-3"
                        style="background-color: #EFEFEF;"
                      >
                        <a
                          style="color: #00A2B9; cursor: pointer;"
                          class="text-black ms-1"
                          :data-bs-target="`#modal-add-task${index}`"
                          data-bs-toggle="modal"
                          :board_id="element.id"
                        >
                          <span style="color: #00A2B9; font-weight: bolder; font-size: x-large;">+</span> &nbsp;&nbsp;Tambah Pekerjaan
                        </a>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
              <!-- and task -->
              <div>
                <div
                  class="card"
                  style="background-color: #FFFFFF; border: 1px dashed; border-color: green; width: 220px !important;"
                >
                  <div class="card-body p-1">
                    <div class="mb-0 d-flex justify-content-center text-black rounded-3">
                      <a
                        class="dropdown-item rounded-3"
                        href="#"
                        data-bs-target="#modal-status"
                        data-bs-toggle="modal"
                      >
                        <span style="color: #00A2B9; font-weight: bolder; font-size: x-large;">+</span> &nbsp;&nbsp;Tambah Status
                      </a>
                    </div>

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
                              data-bs-dismiss="modal"
                            >Buat Status</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pseduo-track"></div>
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="js" src="./ProjectBoard_script.js"></script>
<style scoped>
.outer-wrapper {
  /* min-width: 100vw; */
  /* max-width: 100vh; */
  overflow-x: scroll;
  position: relative;
  scrollbar-color: #45464b #454d54;
  scrollbar-width: thin;
  -ms-overflow-style: none;
}

.pseduo-track {
  height: 5px;
  width: 100%;
  position: relative;
  top: -3px;
  z-index: -10;
}

@media (any-hover: none) {
  .pseduo-track {
    display: none;
  }
}

.outer-wrapper::-webkit-scrollbar {
  height: 5px;
}

.outer-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
}

.outer-wrapper::-webkit-scrollbar-thumb {
  height: 5px;
  background-color: #71737c;
}

.outer-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #7d878f;
}

.outer-wrapper::-webkit-scrollbar:vertical {
  display: none;
}

.inner-wrapper {
  display: flex;
  padding-bottom: 10px;
}

.pseudo-item {
  height: 300px;
  width: 369px;
  margin-right: 59px;
  flex-shrink: 0;
  background-color: gray;
}

.pseudo-item:nth-of-type(2n) {
  background-color: lightgray;
}
.bigger-area {
  min-height: 60vh;
  display: block;
}
.bg-lainnya {
  color: #666666;
  background-color: #efefef;
}
.bg-tupoksi {
  color: #36b37e;
  background-color: #eafbef;
}
.bg-kpi {
  color: #5c00b9;
  background-color: #efe6f8;
}
.centered {
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
  width: 95%;
  height: auto;
}
.hoverEdit {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}
.roundedCustom {
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.roundedCustom:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
.roundedCustom:hover > div > .hoverEdit {
  box-shadow: 0 0 5px rgba(33, 33, 33, 0.3);
  visibility: visible;
  opacity: 1;
}
#hideborder {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  color: white;
  font-size: 25px;
}
#hideborder:focus {
  background-color: rgb(255, 255, 255, 0.1);
}
#hideborderTextArea {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  resize: none !important;
  /* width: 1300px;
  max-height: 1000px; */
}
#hideborderTextArea:focus {
  border: 1px solid rgb(206, 206, 206);
  box-shadow: none;
  resize: none !important;
}
.search {
  position: relative;
  width: 250px;
}

.search input {
  text-indent: 25px;
  border: 1px solid #d6d4d4;
  border-radius: 20px !important;
  background-color: rgb(248, 248, 248);
}

.search input:focus {
  box-shadow: none;
  border: 1px solid #00a2b9;
}

.search .fa-search {
  position: absolute;
  top: 13px;
  left: 15px;
}

.search-project {
  position: relative;
  width: 250px;
  margin-bottom: 5px;
  font-size: 16px;
}

.search-project input {
  text-indent: 25px;
  border: 1px solid #d6d4d4;
  border-radius: 10px !important;
  background-color: rgb(255, 255, 255);
  height: 50px;
}

.search-project input:focus {
  box-shadow: none;
  border: 1px solid #00a2b9;
}

.search-project .fa-search {
  position: absolute;
  top: 17px;
  left: 15px;
}

.content-horizontal {
  display: inline-block;
}

.scroll-horizontal {
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  width: auto;
}

.scroll {
  max-height: 450px;
  height: 450px;
  overflow-x: auto;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

ul.ul-scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: white;
}

datalist.datalist-scrollbar::-webkit-scrollbar {
  width: 5px;
  background-color: white;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px transparent;
  background-color: transparent;
}

ul.ul-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px transparent;
  background-color: #bdbdbd;
}

datalist.datalist-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px transparent;
  background-color: #bdbdbd;
}

.list-item {
  width: 200px;
  height: 100%;
  background: rgba(255, 0, 0, 0.1);
  margin-left: 10px;
  display: inline-block;
}

.grid-container {
  background: white;
}
.right {
  right: 5px;
}
.text-More:after {
  content: "Tampilkan Lebih Banyak  ";
}

.text-Less:after {
  content: "Tampilkan Lebih Sedikit  ";
}
</style>
