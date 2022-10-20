import axios from 'axios';
import Swal from 'sweetalert2';

let env = process.env.NODE_ENV
let origin = window.location.hostname
console.log("node env = ", env)
console.log("domain = ", origin)

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
});

const apiAuth = axios.create({
  baseURL: process.env.VUE_APP_SSO_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
});

const swalFire = () => {
  console.log("jalan direct token expired")
  window.location.href = '/signup?token_expired=true';
};

const swalFireErrorSso = () => {
  Swal.fire({
    text: 'SSO: Server Error !',
    icon: 'error',
    confirmButtonText: 'Oke',
  })
};

export default {
  // Login SSO - Logout SSO - Get User
  SSOLogin({ code, sessionState }) {
    return apiAuth.get(`/v1/sso/login?code=${code}&session_state=${sessionState}&appsource=webesa`)
      .catch((error) => {
        swalFireErrorSso();
        throw error;
      });
  },

  SSOLogout(token) {
    return apiAuth.get(`/v1/sso/logout?sso_id_token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  getUser(token) {
    return apiAuth.get('v1/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // End of Login SSO - Logout SSO - Get User

  // Project List
  getProjects({
    page,
    token,
  }) {
    return apiClient.get(`/v1/web/taskmanagement/projects/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getFavoriteProject({ token }) {
    return apiClient.get(`/v1/web/taskmanagement/project-favorites/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  isFavoriteProject({ token, task_id }) {
    return apiClient.get(`/v1/web/taskmanagement/project-favorites/is-favorite?task_id=${task_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addFavorite({
    project_id,
    token
  }) {
    return apiClient.post(`/v1/web/taskmanagement/project-favorites/?project_id=${project_id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteFavorite({
    project_id,
    token,
  }) {
    return apiClient.delete(`/v1/web/taskmanagement/project-favorites/?project_id=${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data;',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  leaveProject({
    project_id,
    token,
  }) {
    return apiClient.delete(`/v1/web/taskmanagement/project-members/leave?project_id=${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data;',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  kickUser({
    project_id,
    user_id,
    token,
  }) {
    return apiClient.delete(`/v1/web/taskmanagement/project-members/kick?project_id=${project_id}&user_id=${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data;',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteProject(token, data) {
    return apiClient.delete(`/v1/web/taskmanagement/projects/`, {
      data: {
        id: data.id,
        project_name: data.project_name
      },
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getProjectTypes({
    page = 1,
    token,
  }) {
    return apiClient.get(`/v1/web/taskmanagement/project-types?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addProjects(data) {
    return apiClient.post('/v1/web/taskmanagement/projects/', data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  // update project
  updateTitle(id, data, token) {
    return apiClient.put(`/v1/web/taskmanagement/projects?project_id=${id}&context=title`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateDescription(id, data, token) {
    return apiClient.put(`/v1/web/taskmanagement/projects?project_id=${id}&context=desc`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateColor(id, data, token) {
    return apiClient.put(`/v1/web/taskmanagement/projects?project_id=${id}&context=color`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateType(id, data, token) {
    return apiClient.put(`/v1/web/taskmanagement/projects?project_id=${id}&context=type`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  getSearchProject(data) {
    return apiClient.get(`/v1/web/taskmanagement/projects/search?name=${data.name}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getSearchTask(data) {
    return apiClient.get(`/v1/web/taskmanagement/tasks/search?name=${data.name}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getSearchTaskInProjectBoard(data) {
    return apiClient.get(`/v1/web/taskmanagement/tasks/project-search?project_id=${data.project_id}&name=${data.search}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  // End of Project List

  // Project Board
  updateProject({ token, data, id, context = '' }) {
    return apiClient.patch(`/v1/web/taskmanagement/projects/${id}?context=${context}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getDetailProject({ token, project_id }) {
    return apiClient.get(`/v1/web/taskmanagement/projects/detail/${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401 && error.response.data === 'Unauthorized') {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getProjectsDropdown({ token }) {
    return apiClient.get(`/v1/web/taskmanagement/projects/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getMember({ token, project_id }) {
    return apiClient.get(`/v1/web/taskmanagement/project-members?project_id=${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  searchMember(data) {
    return apiClient.get(`/v1/web/taskmanagement/project-members/search?project_id=${data.project_id}&name=${data.name}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  inviteMember(token, data) {
    return apiClient.post(`/v1/web/taskmanagement/project-members/invite`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addStatus(data) {
    return apiClient.post(`/v1/web/taskmanagement/boards/`, data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  editStatus(data) {
    return apiClient.put(`/v1/web/taskmanagement/boards/${data.board_id}`, data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteStatus(token, title = '', project_id, board_id) {
    return apiClient.delete(`/v1/web/taskmanagement/boards/?title=${title}&project_id=${project_id}&board_id=${board_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  // End of Project Board

  // dashboard
  listTask({
    token
  }) {
    return apiClient.get(`/v1/web/taskmanagement/tasks/my-task`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  listTaskSchedule({
    token,
    date = null
  }) {
    return apiClient.get(`/v1/web/taskmanagement/tasks/my-schedule?date=${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // End of dashboard

  // Task List
  getProjectStatus({ token, project_id }) {
    return apiClient.get(`/v1/web/taskmanagement/boards?project_id=${project_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getPriority({ token }) {
    return apiClient.get(`/v1/web/taskmanagement/task-priorities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  searchProject({ token, name = '', page }) {
    return apiClient.get(`/v1/web/taskmanagement/projects/search?name=${name}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  searchTask(data) {
    return apiClient.get(`/v1/web/taskmanagement/project-members/member?project_id=${data.project_id}&name=${data.name}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getDetailTask({ token, id, project_id, task_group_header_id }) {
    return apiClient.get(`/v1/web/taskmanagement/tasks/detail?id=${id}&project_id=${project_id}&task_group_header_id=${task_group_header_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getAttachment({ token, id }) {
    return apiClient.get(`/v1/web/taskmanagement/attachments/task/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addAttachment({ token }) {
    return apiClient.post(`/v1/web/taskmanagement/attachments/task`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteAttachment({ token, refrence_id, id }) {
    return apiClient.delete(`/v1/web/taskmanagement/attachments/task/${refrence_id}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addTask(token, data) {
    return apiClient.post(`/v1/web/taskmanagement/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteTask({ token, id, task_group_header_id }) {
    return apiClient.delete(`/v1/web/taskmanagement/tasks?id=${id}&task_group_header_id=${task_group_header_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // End of Task List

  // Attachment
  getInformationFile({ token, id, reference_id }) {
    return apiClient.get(`/v1/web/taskmanagement/attachments/information/?id=${id}&reference_id=${reference_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addAttachmentProject({ token }) {
    return apiClient.post(`/v1/app/taskmanagement/attachment/project`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addAttachmentTask({ token }) {
    return apiClient.post(`/v1/web/taskmanagement/attachment/task`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // End of Attachment

  // Get Comment
  getComment( token, id ) {
    return apiClient.get(`/v1/web/taskmanagement/tasks-comment/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  getDetailComment({ token, id }) {
    return apiClient.get(`/v1/web/taskmanagement/task-comment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addComment( data ) {
    return apiClient.post(`/v1/web/taskmanagement/tasks-comment`, data, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  editComment({ token }) {
    return apiClient.put(`/v1/web/taskmanagement/tasks-comment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteComment({ token, id }) {
    return apiClient.delete(`/v1/web/taskmanagement/tasks-comment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // End of Get Comment

  // Detail Edit Task
  getAssignee(data) {
    return apiClient.get(`/v1/web/taskmanagement/task-assigne/?task_id=${data.task_id}`, {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  addAssignee({ token }) {
    return apiClient.post(`/v1/web/taskmanagement/task-assigne/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  editAssignee({ token }) {
    return apiClient.put(`/v1/web/taskmanagement/task-assigne/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  deleteAssignee({ token, project_id, task_id, user_id }) {
    return apiClient.post(`/v1/web/taskmanagement/task-assigne/?project_id=${project_id}&task_id=${task_id}&user_id=${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  // End of Detail Edit Task

  // Riwayat aktivitas
  riwayatActivity({ token, page }) {
    return apiClient.get(`/v1/web/taskmanagement/activities?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // end Riwayat aktivitas

  // Notifikasi
  notification({ token, page }) {
    return apiClient.get(`/v1/web/taskmanagement/notifications?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  accInvitation({ token, project_id, notif_id }) {
    return apiClient.put(`/v1/web/taskmanagement/project-members/invite/accept?project_id=${project_id}&notif_id=${notif_id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  rejectInvitation({ token, project_id, notif_id }) {
    return apiClient.delete(`/v1/web/taskmanagement/project-members/invite/reject?project_id=${project_id}&notif_id=${notif_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  updateReadNotifSingle({ token, notif_id }) {
    return apiClient.post(`/v1/web/taskmanagement/notifications/read?notif_id=${notif_id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  updateReadNotifAll(token) {
    return apiClient.post(`/v1/web/taskmanagement/notifications/read-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // end notifikasi

  // move horizontal dan vertikal
  moveTaskHorizontal({ token, index_old, index_new, id_before, id_after, id_task }) {
    return apiClient.put(`/v1/web/taskmanagement/tasks/move/horizontal?index_old=${index_old}&index_new=${index_new}&id_before=${id_before}&id_after=${id_after}&id_task=${id_task}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  moveTaskVertikal({ token, index_old, index_new, id_board, id_task }) {
    return apiClient.put(`/v1/web/taskmanagement/tasks/move/vertical?index_old=${index_old}&index_new=${index_new}&id_board=${id_board}&id_task=${id_task}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },

  moveStatusHorizontal({ token, index_old, index_new, id_board, id_project }) {
    return apiClient.put(`/v1/web/taskmanagement/boards/move/horizontal?index_old=${index_old}&index_new=${index_new}&id_board=${id_board}&id_project=${id_project}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle Error
          throw error;
        }
      });
  },
  // end

  // Update Task
  updateTitleTask(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateDescriptionTask(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateStatusTask(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updatePriorityTask(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateEndDate(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },

  updateStartDate(data, token) {
    return apiClient.put(`/v1/web/taskmanagement/tasks`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        if (error.response.status === 401) {
          swalFire();
        } else {
          // Handle error however you want
          throw error;
        }
      });
  },
};
