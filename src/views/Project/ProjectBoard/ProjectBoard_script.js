import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonRadio from "../../../components/ArgonRadio";
import modalLogoutProject from "@/views/components/modalLogoutProject.vue";
import modalDeleteProject from "@/views/components/modalDeleteProject.vue";
import ModalDeleteStatus from "@/views/components/ModalDeleteStatus.vue";
import modalUndangMember from "@/views/components/modalUndangMember.vue";
import palletColor from "../../components/palletColor.vue";
import { mapMutations } from "vuex";
import RiwayatAktivitasSide from "../../../examples/RiwayatAktivitasComp.vue"
import ArgonCheckbox from "../../../components/ArgonCheckbox";
import TaskCard from "../../components/TaskCard.vue";
import ModalAddTask from "../../components/ModalAddTask.vue";
import ModalEditStatus from "../../components/ModalEditStatus.vue";
import ModalDetailTask from "../../components/ModalDetailTask.vue";
import draggable from "vuedraggable";
import ApiService from "@/services/ApiService";
import { ToastSuccess, ToastError, ToastInfo } from "../../../composables/toast";
import Loading from '../../components/Loading.vue';
import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'
import { directive as VueInputAutowidth } from "vue-input-autowidth";
import moment from 'moment';

const body = document.getElementsByTagName("body")[0];

export default {
  name: "project-board",

  directives: { autowidth: VueInputAutowidth },

  props: {
    board_id: {
      type: Number,
      required: true,
    }
  },

  data() {
    return {
      moment: moment,
      // image
      defaultHover: require(`@/assets/img/icons/star1.png`),
      // end
      // search loading
      isLoadingSearch: false,
      dragLoading: false,
      // end
      colorRandomSingle: Math.floor(Math.random() * 16777215).toString(16),
      isLoadingDetailProject: false,
      token: '',
      dataStatus: [],
      dataProjectBoards: [],
      dataProjectMember: [],
      dataTypesProject: [],
      dataStatusProject: [],
      dataPriorityProject: [],
      dataSearchTask: [],
      data_user_login: null,
      is_favorite: 0,
      inputNameSearch: '',
      cari_pekerjaan: '',
      cari_project: '',
      dataDetails: {
        id: 0,
        author_id: 0,
        color: "",
        create_at: "",
        description: "",
        project_name: "",
        project_type_id: "",
        updated_at: "",
      },
      dataAuthor: {
        id: 0,
        fullname: "",
        organization_code: "",
        code: "",
        long_name: ""
      },
      dataTypeProject: {
        id: 0,
        name: "",
        color: "",
      },
      // Add Status
      colorValue: "",
      inputStatusName: "",
      isLoadingAddStatus: false,
      // Edit Status
      editColorValue: "",
      editStatusName: "",
      tipeProjectValue: "",
      isLoadingEditStatus: false,
      drag: false,
      dragStatus: false,
      showRiwayat: false,
      showMenu: false,
      showDes: true,
      showDesMore: true,
      moreColor: false,
      is_kreator: false,
      listProjectValue: {
        color: '',
        id: null,
        is_favorite: 0,
        project_name: ''
      },
      listProject: [],
      listTask: [],
      deskripsiValue: "",
      id_status: [],
      selectColor: [
        "#DDDDDD",
        "#00A2B9",
        "#36B37E",
        "#F3AF00",
        "#DE350B",
        "#7039CB",
      ],
      dataDrag: {
        index_old: null,
        index_new: null,
        data: null
      }
    };
  },

  components: {
    ArgonCheckbox,
    draggable,
    TaskCard,
    ModalAddTask,
    ModalEditStatus,
    ModalDetailTask,
    ModalDeleteStatus,
    Loading,
    RiwayatAktivitasSide,
    ArgonButton,
    ArgonRadio,
    modalLogoutProject,
    modalDeleteProject,
    modalUndangMember,
    palletColor,
    HorizontalScroll
    // HorizontalScroll
  },

  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },

    initModelSearchTask: {
      get() {
        return this.cari_pekerjaan
      },
      set(value) {
        this.cari_pekerjaan = value
        this.searchPekerjaan()
      }
    },

    filteredSearchTask() {
      var self = this;
      let arr = [];
      let listTasks = this.listTask.filter((searchtask) => {
        let data = searchtask.title.toLowerCase().indexOf(self.cari_pekerjaan.toLowerCase()) >= 0 ||
          searchtask.title.toLowerCase().indexOf(self.cari_pekerjaan.toLowerCase()) >= 0;
        if (data == true) {
          arr.push(data)
        }
        return data;
      });
      return listTasks;
    },

    initModelSearchProject: {
      get() {
        return this.cari_project
      },
      set(value) {
        this.cari_project = value
        this.searchProject()
      }
    },

    filteredSearchProject() {
      var self = this;
      let arr = [];
      let listProjects = this.listProject.filter((searchProject) => {
        let data = searchProject.project_name.toLowerCase().indexOf(self.cari_project.toLowerCase()) >= 0 ||
          searchProject.project_name.toLowerCase().indexOf(self.cari_project.toLowerCase()) >= 0;
        if (data == true) {
          arr.push(data)
        }
        return data;
      });
      return listProjects;
    },

  },

  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"]),

    onClickChild(value) {
      this.showRiwayat = value;
    },

    resize() {
      let element = this.$refs["textarea"];
      element.style.height = "18px";
      element.style.height = element.scrollHeight + "px";
    },

    openSideBarRiwayatAktifitas() {
      alert('open to sidebar riwayat aktivitas');
    },

    colorRandom() {
      return Math.floor(Math.random() * 16777215).toString(16)
    },

    deleteCookies() {
      this.$cookies.remove('favorite');
      this.$cookies.remove('project_id');
      this.$cookies.remove('project_name');
    },

    getColorValue(value) {
      this.colorValue = value;
    },

    getTipeProjectValue(value) {
      this.tipeProjectValue = value;
    },

    filterTugasSaya() {

    },
    filterMendekatiDateLine() {

    },
    filterTerlambat() {

    },

    getListProjectValue(value) {
      this.deleteCookies()
      this.getProjectDetail("ganti_project", value.id)
      setTimeout(() => {
        this.$cookies.set('favorite', value.is_favorite);
        this.$cookies.set('project_id', value.id);
        this.$cookies.set('project_name', value.project_name);
      }, 500)
    },

    checkMove: function (e) {
      // console.log("move = ", e)
      let dataDragOn = e.draggedContext.element;
      let indexOld = e.draggedContext.index;
      let indexAfter = e.draggedContext.futureIndex;
      // console.log("data drag = ", dataDragOn)
      // console.log("index old = ", indexOld)
      // console.log("index after = ", indexAfter)
      this.dataDrag = {
        index_old: indexOld,
        index_new: indexAfter,
        data: dataDragOn
      }
    },

    checkMoveStatus: function (e) {
      // console.log("move = ", e)
      let dataDragOn = e.draggedContext.element;
      let indexOld = e.draggedContext.index;
      let indexAfter = e.draggedContext.futureIndex;
      // console.log("data drag = ", dataDragOn)
      // console.log("index old = ", indexOld)
      // console.log("index after = ", indexAfter)
      this.updateDragStatusHorizontal(indexOld, indexAfter, dataDragOn.id, dataDragOn.project_id)
    },

    finish: function (id) {
      // index 0 new index 1 old
      if (this.id_status.length > 1) {
        this.id_status = []
      }
      this.id_status.push(id)
      // move vertikal
      setTimeout(() => {
        if (this.id_status.length === 1 || this.id_status[0] === this.id_status[1]) {
          console.log("jalan vertikal");
          this.updateDragVertical(this.dataDrag.index_old, this.dataDrag.index_new, this.id_status[0], this.dataDrag.data.id)
        }
      }, 1000)
      // move horizontal
      if (this.id_status.length === 2) {
        if (this.id_status[0] !== this.id_status[1]) {
          this.dragLoading = true
          setTimeout(() => {
            console.log("jalan horizontal");
            this.updateDragHorizontal(this.dataDrag.index_old, this.dataDrag.index_new, this.id_status[1], this.id_status[0], this.dataDrag.data.id)
          }, 500)
        }
      }
      console.log("status id = ", this.id_status)
    },

    mouseInStar() {
      this.defaultHover = require(`@/assets/img/icons/star2.png`);
    },

    mouseOutStar() {
      this.defaultHover = require(`@/assets/img/icons/star1.png`);
    },

    // function convert hexa to rgba
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

    // function get initials text
    getInitials(string) {
      let names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
        initials += names[1].substring(0, 1).toUpperCase();
      }
      let text = initials.toUpperCase();
      return text;
    },

    sortDeadline() {
      this.dataProjectBoards.sort((a, b) => a.end_datetime > b.end_datetime ? 1 : -1);
    },

    sortProjectName() {
      this.dataProjectBoards.sort((a, b) => a.end_datetime > b.end_datetime ? 1 : -1);
    },

    // Get Detail Project
    async getProjectDetail(type, id) {
      let data;
      let idState = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        if (type === 'ganti_project') {
          data = {
            token: this.token,
            project_id: id === "" ? dataCookie : id
          }
        } else {
          data = {
            token: this.token,
            project_id: idState === "" ? dataCookie : idState
          }
        }
        this.isLoadingDetailProject = true;
        const response = await ApiService.getDetailProject(data)
        let toData = response.data.data;
        console.log("Bundle Detail = ", toData)
        this.isLoadingDetailProject = false;
        if (toData !== undefined || toData !== null) {
          // init data state
          let dataBoard = toData.boards;
          let projectMembers = toData.projectmembers;
          this.dataProjectBoards = dataBoard;
          this.dataProjectMember = projectMembers;
          // check is kreator
          if (
            toData.author.id === this.data_user_login.id
            && toData.author.full_name === this.data_user_login.fullname
          ) {
            this.is_kreator = true
          }
          // init author
          this.dataAuthor = {
            id: toData.author.id,
            fullname: toData.author.full_name,
            organization_code: toData.author.organization_code,
            code: toData.author.organization.code,
            long_name: toData.author.organization.long_name
          };
          // set type project
          this.dataTypeProject = {
            id: toData.type_project.id,
            name: toData.type_project.name,
            color: toData.type_project.color,
          }
          // init data project
          this.dataDetails = {
            id: toData.id,
            author_id: toData.author_id,
            color: toData.color,
            create_at: toData.create_at,
            description: toData.description,
            project_name: toData.project_name,
            project_type_id: toData.project_type_id,
            updated_at: toData.updated_at
          }
          // call function
          this.searchPekerjaan()
          this.searchProject()
        }
      } catch (error) {
        this.isLoadingDetailProject = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
          this.$router.go(-1)
        }
      }
    },

    // search project to ganti project
    async searchProject() {
      try {
        const data = {
          name: this.cari_project,
          token: this.token
        }
        this.isLoadingSearch = true
        const response = await ApiService.getSearchProject(data)
        this.isLoadingSearch = false
        let toData = response.data.data;
        // console.log("Search Project = ", toData)
        if (toData !== undefined || toData !== null) {
          this.listProject = toData;
        }
      } catch (error) {
        this.isLoadingSearch = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // search detail
    async searchPekerjaan() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let data = {
        token: this.token,
        project_id: id === "" ? dataCookie : id,
        search: this.cari_pekerjaan
      }
      try {
        this.isLoadingSearch = true
        const response = await ApiService.getSearchTaskInProjectBoard(data)
        this.isLoadingSearch = false
        let toData = response.data.data;
        // console.log("search pekerjaan project board = ", toData)
        if (toData !== undefined || toData !== null) {
          this.listTask = toData;
        }
      } catch (error) {
        this.isLoadingSearch = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // Add Status
    async addStatus() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      const data = {
        token: this.token,
        project_id: id === "" ? dataCookie : id,
        title: this.inputStatusName.toUpperCase(),
        color: this.colorValue
      }
      try {
        this.isLoadingAddStatus = true
        const response = await ApiService.addStatus(data)
        console.log(response)
        document.body.classList.remove('modal-backdrop')
        ToastSuccess("Status Berhasil Dibuat")
        this.getProjectDetail()
      }
      catch (error) {
        this.isLoadingAddStatus = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // update project
    async updateJudulProject() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let idData = id === "" ? dataCookie : id
      let data = {
        content: this.dataDetails.project_name
      }
      try {
        const response = await ApiService.updateTitle(idData, data, this.token)
        ToastSuccess(response.data.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // update description
    async updateDescriptionProject() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let idData = id === "" ? dataCookie : id
      let data = {
        content: this.dataDetails.description
      }
      try {
        const response = await ApiService.updateDescription(idData, data, this.token)
        ToastSuccess(response.data.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // update type project
    async updateTypeProject(value) {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let idData = id === "" ? dataCookie : id
      let data = {
        content: value.id
      }
      try {
        const response = await ApiService.updateType(idData, data, this.token)
        this.dataTypeProject.name = value.name;
        ToastSuccess(response.data.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // update color
    async valueColorChild(value) {
      this.dataDetails.color = value;
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      let idData = id === "" ? dataCookie : id
      let data = {
        content: value
      }
      try {
        const response = await ApiService.updateColor(idData, data, this.token)
        ToastSuccess(response.data.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // add fav
    async addToFavorite() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          project_id: id === "" ? dataCookie : id,
          token: this.token
        }
        const response = await ApiService.addFavorite(data)
        this.is_favorite = 1;
        this.$cookies.set('favorite', 1);
        ToastSuccess(response.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // remove fav
    async removeToFavorite() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          project_id: id === "" ? dataCookie : id,
          token: this.token
        }
        const response = await ApiService.deleteFavorite(data)
        this.is_favorite = 0;
        this.$cookies.set('favorite', 0);
        ToastSuccess(response.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    async searchTask() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        const data = {
          project_id: id === "" ? dataCookie : id,
          name: this.inputNameSearch,
          token: this.token
        }
        this.loading = true;
        const response = await ApiService.searchTask(data)
        let toData = response.data.data;
        // console.log("Search Task = ", toData)
        this.loading = false;
        if (toData !== undefined || toData !== null) {
          this.dataSearchTask = toData;
        }
      } catch (error) {
        this.loading = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    // drag and drop status dan task vertikal dan horizontal
    async updateDragStatusHorizontal(index_old, index_new, id_board, id_project) {
      try {
        const data = {
          token: this.token,
          index_old: index_old + 1,
          index_new: index_new + 1,
          id_board: id_board,
          id_project: id_project
        }
        const response = await ApiService.moveStatusHorizontal(data)
        ToastSuccess(response.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    async updateDragVertical(index_old, index_new, id_board, id_task) {
      try {
        const data = {
          token: this.token,
          index_old: index_old + 1,
          index_new: index_new + 1,
          id_board: id_board,
          id_task: id_task
        }
        const response = await ApiService.moveTaskVertikal(data)
        ToastSuccess(response.data.message)
      } catch (error) {
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    async updateDragHorizontal(index_old, index_new, id_before, id_after, id_task) {
      try {
        const data = {
          token: this.token,
          index_old: index_old + 1,
          index_new: index_new + 1,
          id_before: id_before,
          id_after: id_after,
          id_task: id_task
        }
        const response = await ApiService.moveTaskHorizontal(data)
        ToastSuccess(response.data.message)
        this.dragLoading = false
      } catch (error) {
        this.dragLoading = false
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
    this.$store.state.isAbsolute = true;
    this.getProjectDetail()
    setNavPills()
    setTooltip()
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

  beforeMount() {
    // init cookies data
    let userData = JSON.parse(JSON.stringify(this.$cookies.get('user')));
    let getTypeProject = JSON.parse(JSON.stringify(this.$cookies.get('project_type')));
    this.dataTypesProject = JSON.parse(getTypeProject)
    this.data_user_login = userData;
    let getFavProject = this.$cookies.get('favorite');
    this.is_favorite = this.$store.state.favorite === null ? parseInt(getFavProject) : this.$store.state.favorite
    // end init cookies data
    this.$store.state.imageLayout = "profile-overview";
    this.$store.state.showNavbar = true;
    this.$store.state.showFooter = true;
    this.$store.state.hideConfigButton = true;
    body.classList.add("profile-overview");

    // emmit project detail
    this.emitter.on("params-project-detail", value => {
      console.log("value project navbar in project board = ", value)
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      if (value !== undefined) {
        if (dataCookie === value.id) {
          ToastInfo("Anda sudah berada di KPI / Project")
        } else {
          this.getProjectDetail("ganti_project", value.id)
        }
      } else {
        ToastError("KPI / Project tidak ditemukan")
      }
      this.emitter.off("params-project-detail", value);
    });

    // emmit project detail riwayat
    this.emitter.on("params-project-detail-for-riwayat", value => {
      console.log("value project navbar in project board = ", value)
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      if (value !== undefined) {
        if (dataCookie === value.project_id) {
          ToastInfo("Anda sudah berada di KPI / Project")
        } else {
          this.getProjectDetail("ganti_project", value.project_id)
        }
      } else {
        ToastError("KPI / Project tidak ditemukan")
      }
      this.emitter.off("params-project-detail", value);
    });

    // emmit task detail
    this.emitter.on("params-task-project-detail", value => {
      console.log("value task navbar in project board = ", value)
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      if (value !== undefined) {
        console.log("compare id = ", dataCookie + " " + value.project_id)
        if (dataCookie === value.project_id) {
          // ToastInfo("Anda sudah berada di KPI / Project")
          console.log("to modal detail task")
        } else {
          this.getProjectDetail("ganti_project", value.project_id)
        }
      } else {
        ToastError("Pekerjaan tidak ditemukan")
      }
      this.emitter.off("params-task-project-detail", value);
    });
  },

  beforeUnmount() {
    this.$cookies.remove('favorite');
    this.$cookies.remove('project_id');
    this.$cookies.remove('project_name');
    this.$store.state.isAbsolute = false;
    this.$store.state.imageLayout = "default";
    this.$store.state.showNavbar = true;
    this.$store.state.showFooter = true;
    this.$store.state.hideConfigButton = false;
    body.classList.remove("profile-overview");
  }
};
