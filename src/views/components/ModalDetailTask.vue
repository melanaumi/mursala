<template>
  <div class="modal" :id="`modal-detail-task${task.id}`">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header-delete d-flex justify-content-between">
          <di>
            <nav aria-label="breadcrumb">
              <ol class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb">
                <li class="text-sm breadcrumb-item">Project</li>
                <li class="text-sm breadcrumb-item">{{ dataDetails.project_name }}</li>
                <li
                    class="text-sm breadcrumb-item active"
                    :class="'text-black-50'"
                    aria-current="page"
                >{{ dataDetails.title }}</li>
              </ol>
            </nav>
          </di>
          <div>
              <button
                  class="border-0 bg-transparent"
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
              >
                <img class="w-70" src="@/assets/img/icons/Cho.png" />
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2" role="menu">
                <a
                  class="dropdown-item"
                  style="color: red; cursor: pointer;"
                  :data-bs-target="`#modal-delete-task${task.id}`"
                  data-bs-toggle="modal"
                  :id="task.id"
                >
                  <img class="w-15" src="@/assets/img/icons/deleteIcon.png" /> &nbsp;Hapus Pekerjaan
                </a>
              </ul>

            <i
                style="margin-top: -20px;"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                class="bi bi-x-lg text-black"
            ></i>
          </div>
        </div>

        <ModalDeleteTask :index="index" :task="task" />

        <!-- modal body -->
        <div
          class="modal-body"
        >
          <div
            class="row"
          >
            <div class="col-lg-7">
              <div class="card-body scroll">
                <input
                    id="hideborder"
                    class="form-control text-black"
                    type="text"
                    v-model="dataDetails.title"
                    @change="updateTitle"
                />

                <div class="form-group">
                  <label :for="hideborderTextArea">
                    <h6 class="text-black mt-3 mx-2">Deskripsi Pekerjaan</h6>
                  </label>
                  <textarea
                      class="form-control"
                      placeholder="Tambahkan Deskripsi Pekerjaan"
                      v-model="dataDetails.description"
                      id="hideborderTextArea"
                      ref="textarea"
                      @change="updateDesc"
                      @input="resize()"
                  ></textarea>
                </div>

                <h6 class="text-black mt-3">Aktivitas</h6>
                <div class="d-flex">
                  <button class="btn btn-outline-primary text-black m-1">
                    Semua
                  </button>
                  <button class="btn btn-outline-primary text-black m-1">
                    Lampiran
                  </button>
                  <button class="btn btn-outline-primary text-black m-1">
                    Komentar
                  </button>
                  <button class="btn btn-outline-primary text-black m-1">
                    Riwayat
                  </button>
                </div>

                <div class="row form-group mt-3 d-flex justify-content-between">
                  <div class="col-lg-9">
                    <textarea
                        class="form-control"
                        rows="1"
                        placeholder="Berikan Komentar ..."
                        v-model="inputComment"
                    >
                    </textarea>
                  </div>
                  <div class="col-lg-3">
                    <img class="w-11" src="@/assets/img/icons/lampiran.png" />
                    <img class="w-11 mx-2" @click="addComment" src="@/assets/img/icons/send.png" />
                  </div>
                </div>

                <div>
                  <div
                    class="d-flex"
                    v-for="(stateCom, index)  in  stateComments"
                    :key="index"
                  >
                    <div class="">
                      <a
                          class="border-0 avatar avatar-sm rounded-circle me-3"
                          style="font-weight: bolder;"
                          :style="{'backgroundColor': '#'+stateCom.bgColor}"
                      >
                        {{ getInitials(stateCom.member.full_name)  }}
                      </a>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">{{ stateCom.member.full_name }}</span>
                        <span class="mb-0 text-xs text-secondary mx-2" style="color: #00A2B9;"><i class="fa fa-clock me-1"></i>{{ moment(stateCom.updated_at).startOf('day hour').lang('id').fromNow() }}</span>
                      </h6>
                      <div>
                        <p class="text-black">{{ stateCom.comment }}</p>
<!--                        <input-->
<!--                          id="hideborder"-->
<!--                          class="form-control text-black"-->
<!--                          type="text"-->
<!--                          v-model="stateCom.comment"-->
<!--                          @change="editComment"-->
<!--                        />-->
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="">
                      <a
                          href="javascript:;"
                          class="border-0 avatar avatar-sm rounded-circle me-3"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          style="background-color: #8d3531; font-weight: bolder;"
                      >
                        DF
                      </a>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">Jhon</span> menambahkan lampiran
                        <span class="mb-0 text-xs text-secondary mx-2" style="color: #00A2B9;"><i class="fa fa-clock me-1"></i>6 menit lalu</span>
                      </h6>
                      <div class="mt-1">
                        <span>
                          <img src="@/assets/img/icons/lamp1.png" />
                          <img src="@/assets/img/icons/lamp2.png" class="mx-2" />
                        </span><br>
                        <span>
                          <img class="mt-2 w-70" src="@/assets/img/icons/lamp3.png" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex mt-4">
                    <div class="">
                      <a
                          href="javascript:;"
                          class="border-0 avatar avatar-sm rounded-circle me-3"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          style="background-color: #2e8d3b; font-weight: bolder;"
                      >
                        GT
                      </a>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">Ciko</span> mengubah prioritas
                        <span class="mb-0 text-xs text-secondary mx-2" style="color: #00A2B9;"><i class="fa fa-clock me-1"></i>2 menit lalu</span>
                      </h6>
                      <div>
                        <p class="text-black">Rendah &nbsp;<span style="font-weight: bolder;"><i class="fas fa-arrow-right" /> &nbsp;Urgent</span></p>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div class="">
                      <a
                          href="javascript:;"
                          class="border-0 avatar avatar-sm rounded-circle me-3"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          style="background-color: #75513b; font-weight: bolder;"
                      >
                        JJ
                      </a>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">Sonya</span> membuat pekerjaan ini
                        <span class="mb-0 text-xs text-secondary mx-2" style="color: #00A2B9;"><i class="fa fa-clock me-1"></i>12 Agustus 2022</span>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-5">
              <div
                  class="card border-radius-sm mt-2 mb-2 mx-2 me-2"
                  style="border: 0.3px solid #9d9898;"
              >
                <div class="mt-2 mb-2 mx-2 me-2">
                  <h5 class="text-black">Detail</h5><hr />
                  <div class="row">
                    <div class="col-lg-5">
                      <div>
                        <h6 class="text-black-50"> Status</h6>
                      </div>
                      <div class="mt-4">
                        <h6 class="text-black-50"> <img class="w-10" src="@/assets/img/icons/org.png" /> &nbsp; Penerima Tugas</h6>
                      </div>
                      <div class="mt-3">
                        <h6 class="text-black-50"> <img class="w-10" src="@/assets/img/icons/tanggal.png" /> &nbsp;Tanggal Mulai</h6>
                      </div>
                      <div class="mt-3">
                        <h6 class="text-black-50"> <img class="w-10" src="@/assets/img/icons/tanggal.png" /> &nbsp;Tanggal Selesai</h6>
                      </div>
                      <div class="mt-3">
                        <h6 class="text-black-50"> <img class="w-10" src="@/assets/img/icons/prioritas.png" /> &nbsp;Prioritas</h6>
                      </div>
                    </div>
                    <div
                      class="col-lg-7"
                    >
                      <!-- dropdown edit status -->
                      <div
                        id="dropdownEditStatus"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="cursor: pointer; text-transform: none;"
                      >
                          <span
                            style="cursor: pointer;"
                            class="d-inline-block py-1 px-2 rounded-2"
                            :style="[dataDetails.status_name === '' ? '' : { 'backgroundColor': hexToRgbA(dataDetails.status_color === '' ? '#080808' : dataDetails.status_color), 'color': dataDetails.status_color }]"
                          >
                            <p
                              style="font-size:13px;"
                              class="m-0 text-center fw-bold"
                            >{{dataDetails.status_name}}</p>
                          </span>
                      </div>
                      <ul class="dropdown-menu" aria-labelledby="dropdownEditStatus" role="menu">
                        <div
                          class="p-2 d-flex"
                          v-for="(setStatus, index) in  stateStatuses"
                          :key="index"
                        >
                          <a
                            class="dropdown-item fw-bold"
                            style="cursor: pointer;"
                            @click="updateStatusTask(setStatus.id)"
                          >{{setStatus.task_group_name}}</a>
                        </div>
                      </ul>

                      <!-- end dropdown -->

                      <div class="mt-3">
                        <div class="avatar-group">
                          <a
                            v-for="(assignee, index) in stateAssignees"
                            :key="index"
                            href="javascript:;"
                            class="border-0 avatar avatar-sm rounded-circle"
                            data-bs-placement="bottom"
                            data-bs-target="#myModalUndangMember"
                            data-bs-toggle="modal"
                            :style="{'backgroundColor': '#'+assignee.bgColor, 'fontWeight': 'bolder', 'color': 'white'}"
                            :propsAssignee="assignee"
                          >{{getInitials(assignee.full_name)}}</a>
                          <a
                              v-if="stateAssignees.length >= 1"
                              href="javascript:;"
                              class="border-0 avatar avatar-sm rounded-circle"
                              id="dropdownSearchAssignee"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              list="dataTask_Assignee"
                              style="background-color: #E6F6F8; border: 1px dashed #00A2B9; color: #00A2B9; font-weight: bolder; font-size: larger;"
                          >
                            +
                          </a>
                        </div>
                      </div>

                      <div class="mt-3">
                        <h6 class="text-black">
                          {{ moment(dataDetails.start_date).lang('id').format("DD MMMM YYYY hh:mm:s") }} &nbsp;&nbsp;
                          <span><input type="datetime-local" id="hideborder-date" v-model="inputDateStart" @change="updateStartTime" /></span>
                        </h6>
                      </div>
                      <div class="mt-3">
                        <h6 class="text-black">
                          {{ moment(dataDetails.end_date).lang('id').format("DD MMMM YYYY hh:mm:s") }} &nbsp;&nbsp;
                          <span><input type="datetime-local" id="hideborder-date" v-model="inputDateEnd" @change="updateEndTime" /></span>
                        </h6>
                      </div>
                      <div
                        id="dropdownEditPriority"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="cursor: pointer; text-transform: none;"
                      >
                          <span
                            style="cursor: pointer;"
                            class="d-inline-block py-1 px-2 rounded-2"
                            :style="[dataDetails.priority_id === 1 ? { 'backgroundColor': hexToRgbA('#fc030b'), 'color': '#fc030b' } :
                                     dataDetails.priority_id === 2 ? { 'backgroundColor': hexToRgbA('#d26561'), 'color': '#d26561' } :
                                     dataDetails.priority_id === 3 ? { 'backgroundColor': hexToRgbA('#f5b412'), 'color': '#f5b412' } :
                                     { 'backgroundColor': hexToRgbA('#02944b'), 'color': '#02944b' }]"
                          >
                             <p
                               style="font-size:13px;"
                               class="m-0 text-center fw-bold"
                             >{{dataDetails.priority_name}}</p>
                          </span>
                      </div>
                      <ul class="dropdown-menu" aria-labelledby="dropdownEditPriority" role="menu">
                          <div
                              class="p-2 d-flex"
                              v-for="(setPriority, index) in  statePriorities"
                              :key="index"
                          >
                            <a
                                class="dropdown-item fw-bold"
                                style="cursor: pointer;"
                                @click="updatePriorityTask(setPriority.id)"
                            >{{setPriority.name}}</a>
                          </div>
                        </ul>
                    </div>
                  </div>
                </div>
              </div>

              <p class="text-black-50 mt-4 mx-2">Terakhir diperbarui {{ moment(dataDetails.update_date).startOf('day hour').lang('id').fromNow() }} <br> Dibuat pada {{ moment(dataDetails.update_date).lang('id').format("dddd, DD MMMM YYYY hh:mm:s") }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import {ToastError, ToastSuccess} from "@/composables/toast";
import ModalDeleteTask from "@/views/components/ModalDeleteTask";
import moment from 'moment';
// import Datepicker from '@vuepic/vue-datepicker';

export default {
  name: "modal-detail-task",
  components: {
    ModalDeleteTask,
// Datepicker
  },
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
      isLoading: false,
      moment: moment,
      title: "title",
      desc: "desc",
      start: "start",
      end: "end",
      is_set_time: 1,
      status: "status",
      priority: "priority",
      isLoadingSearch: false,

// Edit
      inputTaskName: this.task.title,
      idTask: this.task.id,
      idStatus: this.task.task_group_header_id,
      idProject: this.task.project_id,
      stateProjects: [],
      selectedProject: "",
      inputDesTask: "",
      stateStatuses: [],
      selectedProjectStatus: "",
      statePriorities: [],
      selectedProjectPriority: "",
      stateAssignees: [],
      selectedProjectAssignee: "",
      stateDetailTask: [],
      inputDateStart: "",
      inputDateEnd: "",
      stateComments: [],

      dataComments: {
        idComment: 0,
      },

      dataDetails: {
        project_id: 0,
        project_name: "",
        task_id: 0,
        title: "",
        description: "",
        status_id: 0,
        status_name: "",
        priority_id: 0,
        priority_name: "",
        end_date: "",
        start_date: "",
        update_date: "",
      },

// Comment
      inputComment: "",
      isLoadingComment: false,

// Attachment
      fileRecords: [],
      config: {
        maxSize: 10,
        uploadConfig: {
          url: "test url",
          method: "POST",
          userRef: "test user, this is user token we will use as a bearer",
        },
        formatsAllowed: ".jpg, .png, .mp4",
      },

      statusList: ["TO DO","ON WORKING","DONE"],
      statusValue: "ON WORKING",
      priorityList: ["RENDAH","SEDANG","TINGGI", "PRIORITY"],
      priorityValue: "PRIORITY",
      stateMember: [
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        },
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        },
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        },
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        },
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        },
        {
          avatar: '',
          name: 'Aldin Batara',
          divisi: "Divisi Health, SAFETY & ENVIRONMENT"
        }
      ]
    }
  },
  methods:{
    resize() {
      let element = this.$refs["textarea"];
      element.style.height = "18px";
      element.style.height = element.scrollHeight + "px";
    },

    colorRandom(index){
      return Math.floor(index * Math.random() * 16777215).toString(16)
    },

    hexToRgbA(hex) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
      }
      throw new Error('Bad Hex');
    },

    getInitials(string) {
      let names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
        initials += names[1].substring(0, 1).toUpperCase();
      }
      let text = initials.toUpperCase();
      return text;
    },

    hitApiDelete() {
      alert("hit api delete Pekerjaan")
    },
    getStatusValue(value) {
      this.statusValue = value;
    },
    getPriorityValue(value) {
      this.priorityValue = value;
    },

// Get Detail
    async getTaskDetail() {
      try {
        let data = {
          token: this.token,
          id: this.idTask,
          project_id: this.idProject,
          task_group_header_id: this.idStatus
        }
        const response = await ApiService.getDetailTask(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("Data Detail per Task = ", toData)
          if (toData !== undefined) {
            this.stateDetailTask = toData;
            this.dataDetails = {
              project_id: toData.project.id,
              project_name: toData.project.project_name,
              task_id: toData.id,
              title: toData.title,
              description: toData.description,
              status_id: toData.board.id,
              status_name: toData.board.task_group_name,
              status_color: toData.board.color,
              priority_id: toData.priority.id,
              priority_name: toData.priority.name,
              end_date: toData.end_datetime,
              start_date: toData.start_datetime,
              update_date: toData.updated_at
            }
            console.log("detail task = ", this.dataDetails)
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Get Status
    async getTaskStatus() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          token: this.token,
          project_id: id === "" ? dataCookie : id
        }
        const response = await ApiService.getProjectStatus(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("project status = ", this.stateStatuses)
          if (toData !== undefined) {
            this.stateStatuses = toData;
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Get Priority
    async getTaskPriority() {
      try {
        let data = {
          token: this.token,
        }
        const response = await ApiService.getPriority(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("project priority = ", toData)
          if (toData !== undefined) {
            this.statePriorities = toData;
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Get Project On Task
    async getTaskProject(page) {
      try {
        let data = {
          page: page,
          name: this.inputTaskName,
          token: this.token
        }
        const response = await ApiService.searchProject(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("project list = ",toData)
          if (toData !== undefined) {
            this.stateProjects = toData;
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Get Assignee
    async getAssignees() {
      try {
        let data = {
          token: this.token,
          task_id: this.idTask,
        }
        const response = await ApiService.getAssignee(data)
        if (response !== undefined) {
          let toData = response.data.data.task_assignees;
          console.log("project assignee = ", toData)
          if (toData !== undefined) {
            toData = toData.map(function(assignee, assigneeIndex){
              if (assignee) {
                assignee.bgColor = this.colorRandom(assigneeIndex);
              }
              return assignee;
            });

            console.log('toData', toData)
            this.stateAssignees = toData
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Get Comment
    async getTaskComment() {
      try {
        const response = await ApiService.getComment(this.token, this.idTask)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("comment ya = ", toData)
          if (toData !== undefined) {
            toData = toData.map(function(comment, commentIndex){
              if (comment) {
                comment.bgColor = this.colorRandom(commentIndex);
              }
              return comment;
            });
            console.log('toData', toData)
            this.stateComments = toData
            this.dataComments = {
              idComment: toData.id,
            }
          }
        }
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Update Title Task
    async updateTitle() {
      let data = {
        task_id: this.idTask,
        context: this.title,
        content: this.dataDetails.title
      }
      try {
        const response = await ApiService.updateTitleTask( data, this.token)
        console.log(response)
        ToastSuccess("Judul Pekerjaan Berhasil Diubah")
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Update Desc Task
    async updateDesc() {
      let data = {
        task_id: this.idTask,
        context: this.desc,
        content: this.dataDetails.description
      }
      try {
        const response = await ApiService.updateDescriptionTask( data, this.token)
        console.log(response)
        ToastSuccess("Deskripsi Pekerjaan Berhasil Diubah")
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// update status
    async updateStatusTask(statusId) {
      let data = {
        task_id: this.idTask,
        context: this.status,
        content: statusId
      }
      try {
        const response = await ApiService.updateStatusTask(data, this.token)
        console.log(response)
        ToastSuccess("Status Pekerjaan Berhasil Diperbarui")
        this.getTaskDetail()
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// update priority
    async updatePriorityTask(priorityId) {
      let data = {
        task_id: this.idTask,
        context: this.priority,
        content: priorityId
      }
      try {
        const response = await ApiService.updatePriorityTask(data, this.token)
        console.log(response)
        ToastSuccess("Prioritas Pekerjaan Berhasil Diperbarui")
        this.getTaskDetail()
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// update end date
    async updateEndTime() {
      let data = {
        task_id: this.idTask,
        context: this.end,
        content: moment(this.inputDateEnd).format("YYYY-MM-DD hh:mm"),
        is_set_time: this.is_set_time
      }
      try {
        const response = await ApiService.updateEndDate(data, this.token)
        console.log(response)
        ToastSuccess("Batas Waktu Pekerjaan Berhasil Diubah")
        this.getTaskDetail()
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// update start date
    async updateStartTime() {
      let data = {
        task_id: this.idTask,
        context: this.start,
        content: moment(this.inputDateStart).format("YYYY-MM-DD hh:mm"),
        is_set_time: this.is_set_time
      }
      try {
        const response = await ApiService.updateStartDate(data, this.token)
        console.log(response)
        ToastSuccess("Waktu Mulai Pekerjaan Berhasil Diubah")
        this.getTaskDetail()
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

// Add Comment
    async addComment() {
      const data = {
        token: this.token,
        task_id: this.idTask,
        comment: this.inputComment,
      }
      try {
        this.isLoadingComment = true
        const response = await ApiService.addComment(data)
        console.log(response)
        ToastSuccess("Berhasil Menambahkan Komentar Baru")
        this.getTaskComment()
      }
      catch (error) {
        this.isLoadingComment = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    async editComment() {
      const data = {
        token: this.token,
        id: this.idComment,
        comment: this.inputComment,
      }
      try {
        this.isLoadingComment = true
        const response = await ApiService.editComment(data)
        console.log(response)
        ToastSuccess("Berhasil Merubah Komentar")
        this.getTaskComment()
      }
      catch (error) {
        this.isLoadingComment = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

  },
  computed: {
  },
  mounted() {
    this.getTaskDetail()
    this.getAssignees()
    this.getTaskComment()
    this.getTaskStatus()
    this.getTaskPriority()
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
#hideborder {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  font-size: 30px;
  color: #000000;
  font-weight: bolder;
}
#hideborder:focus {
  background-color: rgb(255, 255, 255, 0.1);
}
#hideborder-date {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  color: black;
  font-size: 16px;
  width: 20px;
}
#hideborder-date:focus {
  background-color: rgb(255, 255, 255, 0.1);
}
#hideborderTextArea, #komentar {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  resize: none !important;
}
#hideborderTextArea:focus, #komentar:focus {
  border: 1px solid rgb(170, 170, 170);
  resize: none !important;
}
.scroll {
  max-height: 700px;
  overflow-y: auto;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 5px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #bdbdbd;
}
</style>
