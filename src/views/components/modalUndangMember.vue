<template>
  <div>
    <div class="modal" id="myModalUndangMember">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div style="height: 100%" class="modal-content">
          <!-- modal header -->
          <div class="modal-header-delete">
            <h5
              style="color:black;"
              class="modal-title mt-2"
              id="exampleModalToggleLabel"
            >Undang Member</h5>
            <i type="button" data-bs-dismiss="modal" aria-label="Close" class="bi bi-x-lg"></i>
          </div>
          <div class="modal-header-delete">
            <div class="w-100 d-flex justify-content-between align-items-center align-self-center">
              <div class="search rounded-pill">
                <i class="fa fa-search"></i>
                <div>
                  <multiselect
                    v-model="initValue"
                    :options="listUser"
                    :custom-label="nameWithLang"
                    :multiple="true"
                    :searchable="true"
                    :close-on-select="false"
                    :show-labels="false"
                    :option-height="90"
                    @search-change="asyncFind"
                    placeholder="Cari Member"
                    label="full_name"
                    track-by="id"
                    class="tags"
                  >
                    <template v-slot:noOptions>
                      <div class="d-flex justify-content-center">
                        <span>Temukan user</span>
                      </div>
                    </template>
                    <template v-slot:noResult>
                      <div class="d-flex justify-content-center">
                        <span>User tidak ditemukan.</span>
                      </div>
                    </template>
                    <template v-slot:option="props">
                      <div class="option__desc" style="text-transform: capitalize !important;">
                        <span class="option__title">{{ replaceText(props.option.full_name) }}</span>
                        <br />
                        <br />
                        <span
                          class="option__small mt-2 text-secondary"
                        >{{ props.option.organization === null ? 'Tidak memiliki divisi' : replaceText(props.option.organization.long_name) }}</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>
              <div>
                <argon-button
                  v-if="id_user_invitation.length === 0"
                  color="secondary"
                  size="md"
                  disabled
                >Undang</argon-button>
                <argon-button v-else color="primary" size="md" @click="UndangMember">Undang</argon-button>
              </div>
            </div>
          </div>
          <!-- modal body -->
          <div class="modal-body">
            <div
              style="margin-top:5px;"
              v-if="isLoadingGetMember"
              class="d-flex justify-content-center"
            >
              <loading />
            </div>
            <div v-else>
              <ul
                class="list-group list-group-flush"
                v-for="(stateMembers, index) in stateMember"
                :key="index"
              >
                <li class="list-group position-relative">
                  <div
                    class="d-flex align-items-center w-70"
                    :class="stateMembers.pivot.status === 0 ? 'w-70' : 'w-90' "
                  >
                    <p
                      :style="{'backgroundColor': '#'+colorRandom(), 'font-weight': 'bold', 'font-size': '20px'}"
                      class="rounded-circle text-white border-0 avatar avatar-md mt-3 ms-2"
                    >{{ getInitials(stateMembers.full_name) }}</p>
                    <div>
                      <p
                        style="color: black; text-transform: capitalize;"
                        class="m-0 ms-3 fw-bold"
                      >{{stateMembers.full_name}}</p>
                      <div>
                        <p
                          style="font-size: 15px; text-transform: capitalize;"
                          class="m-0 ms-3"
                        >{{stateMembers.organization === null ? 'Tidak mempunyai organisasi' : stateMembers.organization.long_name}}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="stateMembers.pivot.status === 0"
                    style="cursor: auto;"
                    class="bg-primary px-2 rounded-pill position-absolute right-pending"
                  >
                    <span style="font-size: 13px; color: #ffff;">Pending</span>
                  </div>
                  <div
                    class="position-absolute right"
                    :data-bs-target="`#myModalDeleteMember${index}`"
                    data-bs-toggle="modal"
                    open-modal="delete-member"
                  >
                    <i class="bi bi-x-lg"></i>
                  </div>
                  <hr class="divider" />
                  <modalDeleteMember
                    id="delete-member"
                    :id_member="stateMembers.pivot.user_id"
                    :id_project="id_project"
                    :index="index"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ArgonButton from "@/components/ArgonButton.vue";
import ApiService from "@/services/ApiService";
import { ToastError, ToastSuccess } from "../../composables/toast";
import ModalDeleteMember from "./modalDeleteMember.vue";
import moment from 'moment';
import Loading from './Loading.vue'
import Multiselect from 'vue-multiselect'

export default {
  name: "modal-delete",
  components: {
    ArgonButton,
    'modalDeleteMember' : ModalDeleteMember,
    'loading' : Loading,
    Multiselect
  },
  data() {
    return {
      moment: moment,
      isLoadingGetMember: false,
      isLoadingGetUser: false,
      token: '',
      stateMember: [],
      id_project: "",
      search_user: '',
      myValue: '',
      listUser: [],
      initValue: [],
      id_user_invitation: []
    }
  },
  computed: {
    initModelSearchMember: {
      get() {
        return this.search_user
      },
      set(value) {
        this.search_user = value
        this.getUserListAll()
      }
    },
    filteredSearchMember() {
      var self = this;
      let arr = [];
      let listUsers = this.listUser.filter((searchMember) => {
        let data = searchMember.full_name.toLowerCase().indexOf(self.search_user.toLowerCase()) >= 0 ||
          searchMember.full_name.toLowerCase().indexOf(self.search_user.toLowerCase()) >= 0;
           if (data == true) {
          arr.push(data)
        }
        return data;
      });
      return listUsers;
    }
  },
   watch: {
    initValue: function (val) {
      let data = val.map(type => type.id)
      this.id_user_invitation = data;
      // console.log(this.id_user_invitation)
    },
  },
  methods:{
     nameWithLang ({ full_name }) {
        return `${full_name}`
    },
    asyncFind(query) {
      this.getUserListAll(query)
    },
    replaceText(text) {
      if (text.length > 40) {
        let text1 = text.substring(0, 40)
        return `${text1} ...` 
      } else {
        return text
      }
    },
    ///////////////////////////////////////////////// FUNCTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    colorRandom(){
      return Math.floor(Math.random() * 16777215).toString(16)
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
    myChangeEvent(val){
      console.log(val);
    },
    mySelectEvent({id, text}){
      console.log({id, text})
    },
    ///////////////////////////////////////////////// HIT API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    async getMemberList() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          token: this.token,
          project_id: id === "" ? dataCookie : id,
        }
        this.isLoadingGetMember = true;
        const response = await ApiService.getMember(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("user member = ",toData)
          this.isLoadingGetMember = false;
          if (toData !== undefined) {
            this.id_project = toData[0].id;
            this.stateMember = toData[0].project_members;
          }
        }
      } catch (error) {
        this.isLoadingGetMember = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    async UndangMember() {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          project_id: id === "" ? dataCookie : id,
          user_ids: this.id_user_invitation
        }
        this.isLoadingGetMember = true;
        const response = await ApiService.inviteMember(this.token, data)
        this.isLoadingGetMember = false;
        ToastSuccess(response.data.message)
      } catch (error) {
        this.isLoadingGetMember = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
    async getUserListAll(search) {
      let id = this.$store.state.project_id;
      let dataCookie = JSON.parse(this.$cookies.get("project_id"))
      try {
        let data = {
          token: this.token,
          project_id: id === "" ? dataCookie : id,
          name: search
        }
        this.isLoadingGetUser = true;
        const response = await ApiService.searchMember(data)
        if (response !== undefined) {
          let toData = response.data.data;
          console.log("user = ",toData)
          this.isLoadingGetUser = false;
          if (toData !== undefined) {
            this.listUser = toData;
          }
        }
      } catch (error) {
        this.isLoadingGetUser = false;
        let err = error.response.data.message;
        if (err === null || err === undefined) {
          ToastError(error.message)
        } else {
          ToastError(err)
        }
      }
    },
  },

  mounted() {
    this.getMemberList()
    this.getUserListAll()
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
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
.right {
  right: 15px;
  top: 25px;
  cursor: pointer;
}
.right-pending {
  right: 45px;
  top: 25px;
  cursor: pointer;
}
.search {
  position: relative;
  width: 75%;
}

.search .fa-search {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 500;
}
hr.divider {
  margin: 0em;
  border-width: 2px;
}
.modal:nth-of-type(even) {
  z-index: 1062 !important;
}
.modal-backdrop.show:nth-of-type(even) {
  z-index: 1061 !important;
}
.tags ::v-deep(.multiselect__tag) {
  background: transparent;
  padding-top: 5px;
  color: black;
  border: 1px rgb(197, 197, 197) solid;
}
.tags ::v-deep(.multiselect__tags) {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 40px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
}
.tags ::v-deep(.multiselect__option--highlight) {
  background: #e7e7e7;
  outline: none;
  color: rgb(0, 0, 0);
}
.tags ::v-deep(.multiselect__tag-icon:after) {
  content: "×";
  color: #a3a3a3;
  font-size: 14px;
}

.tags
  ::v-deep(.multiselect__tag-icon:focus:after, .multiselect__tag-icon:hover:after) {
  color: rgb(0, 0, 0);
}
.tags
  ::v-deep(.multiselect, .multiselect__input, .multiselect__single) {
  font-family: inherit;
  font-size: 15px;
  margin-top: 4px;
  touch-action: manipulation
}
.tags
  ::v-deep(.multiselect__input::placeholder) {
  color: #adadad;
  font-size: 15px;
}
</style>
