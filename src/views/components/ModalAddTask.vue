<template>
  <div class="modal" :id="`modal-add-task${index}`">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- modal header -->
        <div class="modal-header">
          <h5 class="modal-title">Buat Pekerjaan</h5>
          <i type="button" data-bs-dismiss="modal" aria-label="Close" class="bi bi-x-lg"></i>
        </div>
        <!-- modal body -->
        <div class="modal-body">
          <form>
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label>
                    KPI / Project
                    <span style="color:#D60808;">*</span>
                  </label>
                  <select
                    class="form-select"
                    placeholder="Pilih Tipe Project"
                    aria-label="Default select example"
                    v-model="selectedProject"
                  >
                    <option
                      id="style-option"
                      v-for="(stateProject, index) in stateProjects"
                      :key="index"
                      :value="stateProject.id"
                    >{{stateProject.project_name}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Judul Pekerjaan</label>
              <input
                type="text"
                class="form-control"
                placeholder="Judul Pekerjaan"
                id="judul-task"
                v-model="inputTaskName"
              />
            </div>

            <div class="mb-3">
              <label>Deskripsi Pekerjaan</label>
              <textarea
                class="form-control"
                placeholder="Tulis Deskripsi Pekerjaan"
                id="deskripsi-task"
                style="height: 100px;"
                v-model="inputDesTask"
              ></textarea>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="floatingTextarea2">Status</label>
                  <select
                    class="form-select"
                    placeholder="Pilih Status Pekerjaan"
                    aria-label="Default select example"
                    v-model="selectedProjectStatus"
                  >
                    <option
                      id="style-option"
                      v-for="(stateStatus, index) in stateStatuses"
                      :key="index"
                      :value="stateStatus.id"
                    >{{stateStatus.task_group_name}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="floatingTextarea2">Prioritas</label>
                  <select
                    class="form-select"
                    placeholder="Pilih Prioritas Pekerjaan"
                    aria-label="Default select example"
                    v-model="selectedProjectPriority"
                  >
                    <option
                      id="style-option"
                      v-for="(statePriority, index) in statePriorities"
                      :key="index"
                      :value="statePriority.id"
                    >{{statePriority.name}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label for="floatingTextarea2">Penerima Tugas</label>
                  <!-- <select2-multiple-control
                    class="form-select"
                    v-model="selectedProject"
                    :options="myOptions"
                    @change="myChangeEvent($event)"
                    @select="mySelectEvent($event)"
                  />-->
                  <select
                    class="form-select"
                    placeholder="Pilih Penerima Tugas"
                    aria-label="Default select example"
                    v-model="selectedProjectAssignee"
                  >
                    <option
                      id="style-option"
                      v-for="(stateAssignee, index) in stateAssignees"
                      :key="index"
                      :value="stateAssignee.id"
                    >{{stateAssignee.full_name}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <label class="form-label">Tanggal Mulai</label>
                <Datepicker v-model="tanggalMulai"></Datepicker>
              </div>
              <div class="col-lg-6">
                <label class="form-label">Tanggal Selesai</label>
                <Datepicker v-model="tanggalSelesai"></Datepicker>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-lg-6">
                <div class="mb-3" data-upload-id="myFirstImage">
                  <label for="exampleInputEmail1" class="form-label">Lampiran</label>
                  <br />
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    style="border: 1px dashed; border-color: green;"
                  >
                    <a>
                      <span style="font-size: x-large;">+</span>
                      <br />Lampirkan File
                      <br />Maksimal 10Mb
                    </a>
                  </button>
                  <!--                  <FileUploader-->
                  <!--                    ref="fileUploader"-->
                  <!--                    :multiple="true"-->
                  <!--                    :config="config"-->
                  <!--                    @fileUploadEmitter="fileUploadHandler($event)"-->
                  <!--                    @filesEmitter="handleFiles($event)"-->
                  <!--                  />-->
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Batal</button>
          <button @click="addTask" type="button" data-bs-dismiss="modal" class="btn btn-primary">Buat Pekerjaan</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/services/ApiService";
import {ToastError,ToastSuccess} from "@/composables/toast";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss';
import moment from 'moment';
// import FileUploader from 'vue-file-upload-library';
// import Select2MultipleControl from 'v-select2-multiple-component';

export default {
  name: 'modal-add-task',
  components: {
    Datepicker,
    // Select2MultipleControl
  },
  props: {
    index: {
      type: Number
    },
    propsTask: {
      type: String,
    },
  },
  data() {
    return {
      moment: moment,
      token: '',
      isLoadingAddTask: false,
      // Add
      tanggalMulai: "",
      tanggalSelesai: "",
      inputTaskName: "",
      stateProjects: [],
      selectedProject: "",
      inputDesTask: "",
      stateStatuses: [],
      selectedProjectStatus: "",
      statePriorities: [],
      selectedProjectPriority: "",
      stateAssignees: [],
      selectedProjectAssignee: null,
      is_set_time: 1,

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
    }
  },
  methods: {
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
          console.log("project status = ", toData)
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

    // Get Task Member
    async getTaskMember() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))

      try {
        let data = {
          token: this.token,
          project_id: id === "" ? dataCookie : id,
          name: this.inputTaskName
        }
        // console.log("ini token", this.token)
        const response = await ApiService.searchTask(data)
        if (response !== undefined) {
          let toData = response.data.data;
          // console.log("assignee = ",toData)
          if (toData !== undefined) {
            this.stateAssignees = toData;
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

    // Add Task
    async addTask()  {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))

      try {
        let data = {
          title: this.inputTaskName,
          project_id: id === "" ? dataCookie : id,
          description: this.inputDesTask,
          task_group_header_id: this.selectedProjectStatus,
          priority_id: this.selectedProjectPriority,
          start_datetime: moment(this.tanggalMulai).format("YYYY-MM-DD hh:mm"),
          is_set_start_datetime: 1,
          end_datetime: moment(this.tanggalSelesai).format("YYYY-MM-DD hh:mm"),
          is_set_end_datetime: 1,
          assign: [this.selectedProjectAssignee]
        }
        const response = await ApiService.addTask(this.token, data)
        console.log(response)
        ToastSuccess("1 Pekerjaan Berhasil Ditambahkan")
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
        ToastError(err)
        }
      }
    },

    myChangeEvent(val){
      console.log(val);
    },
    mySelectEvent({id, text}){
      console.log({id, text})
    }
  },
  mounted() {
    this.getTaskStatus()
    this.getTaskProject()
    this.getTaskPriority()
    this.getTaskMember()
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
