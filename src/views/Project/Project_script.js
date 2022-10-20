import Card from "@/views/components/CardBaseProject.vue";
import ApiService from '../../services/ApiService';
import Loading from '../components/Loading.vue';
import { mapActions } from "vuex";
import { ToastError, ToastInfo, ToastSuccess } from "../../composables/toast";
import { Field, Form } from 'vee-validate';
import { defineEmits } from 'vue';

const emit = defineEmits('closeCreateProject');

const closeCreateProject = () => {
  emit('closeCreateProject');
};

export default {
  name: "project",
  components: {
    Card,
    Loading,
    Field,
    Form,
  },
  data() {
    return {
      loadingAll: false,
      loadingAllPagination: false,
      loadingFav: false,
      token: '',
      countPage: 1,
      moreColor: false,
      stateFavorit: [],
      stateSemuaProject: [],
      isModalShow: true,

      // Create Project
      stateTypesProjects: [],
      selectedTypesProject: "",
      selectTypesProject: null,
      inputNameProject: "",
      inputDesProject: "",
      colorValue: "",
      selectColor: [
        "#00A2B9",
        "#36B37E",
        "#F3AF00",
        "#DE350B",
        "#7039CB",
        "#DDDDDD"
      ],
      selectColorOpacity1: [
        "#66C7D5",
        "#86D1B2",
        "#F8CF66",
        "#EB866D",
        "#A988E0"
      ],
      selectColorOpacity2: [
        "#B3E4EA",
        "#C3E9D9",
        "#FCE8B3",
        "#F6C3B6",
        "#D5C4F0"
      ]
    };
  },
  methods: {
    isRequired(value) {
      return value ? true : 'This field is required';
    },
    ////////////////////////////////////////////// STATE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    ...mapActions([ // spread operator so that other methods can still be added.
      'updateTypeProjectAction'
    ]),
    ////////////////////////////////////////////// FUNCTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    getColorValue(value) {
      this.colorValue = value;
    },

    removeObjectWithId(arr, id) {
      const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
      arr.splice(objWithIdIndex, 1);
      return arr;
    },

    removeObjectWithIdFromAll(arr, id) {
      const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
      arr.splice(objWithIdIndex, 1);
      return arr;
    },

    onClickChildAll(value, remove) {
      //add to favorit state
      if (remove === "removeFromAllProject") {
        this.removeObjectWithIdFromAll(this.stateFavorit, value.id)
        let foundIndex = this.stateSemuaProject.findIndex(x => x.id == value.id);
        if (foundIndex !== undefined) {
          this.stateSemuaProject[foundIndex].is_favorite = 0;
        }
      } else {
        let data = {
          color: value.color,
          is_favorite: 1,
          id: value.id,
          project_name: value.project_name,
          project_type_id: value.project_type_id,
          project_type_color: value.type_color,
          project_type_name: value.type_name
        }
        this.stateFavorit.unshift(data)
        // find state semua Project untuk mengganti property is_favorite menjadi 1
        let foundIndex = this.stateSemuaProject.findIndex(x => x.id == value.id);
        if (foundIndex !== undefined) {
          this.stateSemuaProject[foundIndex].is_favorite = 1;
        }
      }
    },

    onClickChildFav(value) {
      // remove project favorit
      this.removeObjectWithId(this.stateFavorit, value.id)
      // find stateSemua Project untuk mengganti property is_favorite menjadi 0
      let foundIndex = this.stateSemuaProject.findIndex(x => x.id == value.id);
      console.log("find index = ", foundIndex)
      if (foundIndex !== undefined) {
        this.stateSemuaProject[foundIndex].is_favorite = 0;
      }
    },

    ///////////////////////////////////////////////// HIT API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // get All project
    async getAllProject(page, loading) {
      try {
        let data = {
          page: page,
          token: this.token
        }
        loading === "loadingFirst" ? this.loadingAll = true : this.loadingAllPagination = true
        const response = await ApiService.getProjects(data)
        loading === "loadingFirst" ? this.loadingAll = false : this.loadingAllPagination = false
        if (response !== undefined) {
          let toData = response.data.data.data;
          console.log("all project = ", toData)
          if (toData !== undefined) {
            if (data.page === 1) {
              this.stateSemuaProject = toData;
            } else {
              let respNextPages = toData;
              if (respNextPages.length === 0) {
                ToastInfo("Semua data KPI / Project sudah ditampilkan")
              } else {
                this.stateSemuaProject = this.stateSemuaProject.concat(respNextPages)
              }
            }
          }
        }
      } catch (error) {
        loading === "loadingFirst" ? this.loadingAll = false : this.loadingAllPagination = false
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // Get Project Favorit
    async getProjectFavorit() {
      try {
        let data = {
          token: this.token
        }
        this.loadingFav = true;
        const response = await ApiService.getFavoriteProject(data)
        this.loadingFav = false;
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("favorit = ", toData)
          if (toData !== undefined) {
            this.stateFavorit = toData;
          }
        }
      } catch (error) {
        this.loadingFav = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // Get Project Types
    async getTypesProject(page) {
      try {
        let data = {
          page: page,
          token: this.token
        }
        const response = await ApiService.getProjectTypes(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("project types = ", toData)
          if (toData !== undefined) {
            this.stateTypesProjects = toData;
            this.updateTypeProjectAction(toData)
            this.$cookies.set('project_type', JSON.stringify(toData));
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

    // Add Project
    async addProject() {
      const data = {
        token: this.token,
        project_name: this.inputNameProject,
        description: this.inputDesProject,
        project_type_id: this.selectedTypesProject,
        color: this.colorValue,
      }
      try {
        this.loadingAll = true
        const response = await ApiService.addProjects(data)
        console.log(response)
        this.isModalShow = false
        // this.$refs.modalAddProject.close()
        ToastSuccess("KPI / Project " + data.project_name + " Berhasil Dibuat")
        this.getAllProject(this.countPage, "loadingFirst")
      }
      catch (error) {
        this.loadingAll = false
        closeCreateProject();
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },

    // Clear Add Project
    clearAddProject() {
      this.$refs.modalAddProject.close()
      this.inputNameProject = ''
      this.inputDesProject = ''
      this.selectTypesProject = null
      this.selectedTypesProject = ''
      this.colorValue = null
    },

    showModal() {
      this.isModalShow = true;
    },

    closeModal() {
      this.isModalShow = false;
    }
  },
  /////////////////////////////////////////////////// HOOK \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  mounted() {
    this.getAllProject(this.countPage, "loadingFirst")
    this.getProjectFavorit()
    this.getTypesProject()
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
};
