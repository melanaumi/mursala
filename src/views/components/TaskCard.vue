<template>
  <div
    class="d-flex flex-column list-group-item border-0 p-4 mb-3 mt-2 border-radius-sm bg-white"
    :data-bs-target="`#modal-detail-task${task.id}`"
    data-bs-toggle="modal"
    style="cursor: pointer;"
    :id="task.id"
  >
    <h6 class="text-sm text-black-100">{{task.title}}</h6>
    <p
      class="mb-4 text-sm"
      :style="{'color': moment(task.end_datetime).isAfter() ? '#04daf8' : '#ff0000'}"
    >{{ moment(task.end_datetime).locale('id').format("dddd, DD MMMM YYYY hh:mm:ss") }}</p>
    <div>
      <div class="d-flex justify-content-between">
        <div class="d-flex justify-content-between">
          <div class="avatar-group">
            <a
              v-for="(assignee, index) in stateAssignees"
              :key="index"
              href="javascript:;"
              class="border-0 avatar avatar-sm rounded-circle"
              data-bs-placement="bottom"
              data-bs-target="#myModalUndangMember"
              data-bs-toggle="modal"
              :style="{'backgroundColor': '#'+colorRandom(), 'fontWeight': 'bolder', 'color': 'white'}"
            >{{getInitials(assignee.full_name)}}</a>
          </div>
            <span v-if="task.priority_id === 1" class="mx-2 mt-2">
              <img
                src="@/assets/img/icons/arr-task.png"
                style="width: 11px;" />
            </span>
            <span v-else-if="task.priority_id === 2" class="mx-2 mt-2">
              <img
                src="@/assets/img/icons/tinggi.png"
                style="width: 18px;" />
            </span>
            <span v-else-if="task.priority_id === 3" class="mx-2 mt-2">
              <img
                src="@/assets/img/icons/majesticons_minus-line.png"
                style="width: 18px;" />
            </span>
            <span v-else class="mx-2 mt-2">
              <img
                src="@/assets/img/icons/Navigation.png"
                style="width: 18px;" />
            </span>
        </div>

        <div class="d-flex justify-content-between mt-2">
          <a>
            <img src="@/assets/img/icons/lam-task.png" style="width: 10px;" /> {{ task.attachments.length }}
          </a>
          <a class="mx-2">
            <img src="@/assets/img/icons/mes-task.png" style="width: 10px;" /> {{ task.comments.length }}
          </a>
        </div>
      </div>
    </div>
    <ModalDetailTask :index="index" :task="task" />
  </div>
</template>
<script>
import ModalDetailTask from "@/views/components/ModalDetailTask";
import moment from 'moment';
import ApiService from "@/services/ApiService";
import {ToastError} from "@/composables/toast";

export default {
  components: {
    ModalDetailTask
  },
  props: {
    dragLoading: {
      type: Boolean
    },
    index: {
      type: Number
    },
    task: {
      type: Object
    },
    propsAssignee: {
      type: Object
    }
  },
  data()  {
    return {
      token: '',
      moment: moment,
      idTask: this.task.id,
      stateAssignees: []
    }
  },
  methods: {
    colorRandom() {
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

    // Get Assignee
    async getAssignees()  {
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
  },
  mounted() {
    console.log("ini task = ",this.task)
    console.log("ini assignee =",this.propsAssignee)
    this.getAssignees()
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
</script>
