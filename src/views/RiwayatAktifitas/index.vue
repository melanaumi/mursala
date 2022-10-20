<template>
  <div class="py-2 container-fluid">
    <div style="margin-top:5px;" v-if="isLoadingDataNotif" class="d-flex justify-content-center">
      <Loading />
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="d-flex justify-content-between mx-3 me-3">
          <div>
            <h4 class="mb-4">Riwayat Aktivitas</h4>
          </div>
        </div>
        <div>
          <div class="mb-2 mx-3 me-3 scroll">
            <a
              class="mb-2 dropdown-item border-radius-md"
              href="javascript:;"
              v-for="(dataRiwayat, index) in stateRiwayat"
              :key="index"
              @click="toProjectDetail(dataRiwayat)"
            >
              <p>
                {{
                moment(dataRiwayat.created_at).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? 'Hari Ini' :
                (moment(dataRiwayat.created_at).format('YYYY-MM-DD') == moment().add(-1, 'days').format('YYYY-MM-DD') ? 'Kemarin' : moment(dataRiwayat.created_at).locale('id').format('DD MMMM YYYY'))
                }}
              </p>
              <div class="py-1 d-flex">
                <div class>
                  <a
                    href="javascript:;"
                    class="border-0 avatar avatar-sm rounded-circle me-3"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    :style="{'backgroundColor': '#'+colorRandomSingle, 'fontWeight': 'bold'}"
                  >{{ getInitials(dataRiwayat.creator_full_name) }}</a>
                </div>
                <!-- kondisi 1 (tampilan blank default) -->
                <div
                  v-if="
                      dataRiwayat.activity_code === 'project.add'
                      || dataRiwayat.activity_code === 'project.update'
                      || dataRiwayat.activity_code === 'project.delete'
                      || dataRiwayat.activity_code === 'project.invite.accept'
                      || dataRiwayat.activity_code === 'project.leave'
                      || dataRiwayat.activity_code === 'project.invite.kick'
                      || dataRiwayat.activity_code === 'task.add'
                      || dataRiwayat.activity_code === 'task.update.desc'
                      "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span
                       v-if="dataRiwayat.activity_code !== 'task.add'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.project_title }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'task.add' || dataRiwayat.activity_code === 'task.update.desc'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.task_title }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'task.add'"
                    >&nbsp;{{ dataRiwayat.event2 }}</span>
                    <span
                       v-if="dataRiwayat.activity_code === 'task.add'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >&nbsp;{{ dataRiwayat.project_title }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                </div>

                <!-- kondisi 2 (tampilan arrow edit task) -->
                <div
                  v-if="dataRiwayat.activity_code === 'task.update.title'
                        || dataRiwayat.activity_code === 'task.update.status'
                        || dataRiwayat.activity_code === 'task.update.project'
                        || dataRiwayat.activity_code === 'task.update.priority'
                        || dataRiwayat.activity_code === 'task.update.start'
                        || dataRiwayat.activity_code === 'task.update.end'
                        || dataRiwayat.activity_code === 'project.update.title'
                        || dataRiwayat.activity_code === 'project.update.type'
                        || dataRiwayat.activity_code === 'project.update.color'
                        "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span
                      v-if="dataRiwayat.activity_code === 'project.update.title'
                        || dataRiwayat.activity_code === 'project.update.type'
                        || dataRiwayat.activity_code === 'project.update.color'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.project_title }}</span>
                    <span
                      v-else
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.task_title }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                  <div
                    v-if="dataRiwayat.activity_code === 'project.update.color'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                      :style="{'backgroundColor': dataRiwayat.before}"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                        :style="{'backgroundColor': dataRiwayat.after}"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                  <div
                    v-if="dataRiwayat.activity_code !== 'task.add' || dataRiwayat.activity_code !== 'task.update.desc'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                </div>

                <!-- kondisi 3 status -->
                <div
                  v-if="
                  dataRiwayat.activity_code === 'status.update.mobile'
                  || dataRiwayat.activity_code === 'status.delete'
                  || dataRiwayat.activity_code === 'status.add'
                  || dataRiwayat.activity_code === 'status.update.color'
                  || dataRiwayat.activity_code === 'status.update.title'
                  || dataRiwayat.activity_code === 'task.attachment.add'
                  || dataRiwayat.activity_code === 'task.attachment.delete'
                  || dataRiwayat.activity_code === 'task.comment.add'
                  "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span>{{ dataRiwayat.event2 }}</span>
                    <span v-if="dataRiwayat.activity_code === 'status.add'">{{ dataRiwayat.event3 }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'task.attachment.add' 
                      || dataRiwayat.activity_code === 'task.attachment.delete' 
                      || dataRiwayat.activity_code === 'task.comment.add'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >&nbsp;{{ dataRiwayat.task_title }}</span>
                    <span
                      v-else
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.project_title }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                  <!-- comment -->
                  <div
                    v-if="dataRiwayat.activity_code === 'task.comment.add'"
                    class="mb-2 card border-radius-sm mt-2"
                    style="background-color: #ffff;"
                  >
                    <p
                      style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                    >{{ dataRiwayat.comment.comment }}</p>
                  </div>
                  <div
                    v-if="dataRiwayat.activity_code === 'task.comment.add' && dataRiwayat.comment.attachment !== null"
                    class="mb-2 card border-radius-sm mt-2"
                    style="background-color: #ffff;"
                  >
                    <p
                      style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                    >{{ dataRiwayat.comment.attachment }}</p>
                  </div>
                  <!-- arrow -->
                  <div
                    v-if="dataRiwayat.activity_code === 'status.update.title'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                  <!-- color -->
                  <div
                    v-if="dataRiwayat.activity_code === 'status.update.color'"
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                      :style="{'backgroundColor': dataRiwayat.before}"
                    >
                      {{ dataRiwayat.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                        :style="{'backgroundColor': dataRiwayat.after}"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataRiwayat.after }}
                      </span>
                    </p>
                  </div>
                </div>
                <!-- kondisi 4 (tampilan blank default) -->
                <div
                  v-if="
                      dataRiwayat.activity_code === 'project.invite.kick'
                      || dataRiwayat.activity_code === 'task.assign'
                      || dataRiwayat.activity_code === 'task.assign.leave'
                      || dataRiwayat.activity_code === 'project.update.mobile'
                      "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span
                      v-if="dataRiwayat.activity_code === 'project.invite.kick' || dataRiwayat.activity_code === 'task.assign' || dataRiwayat.activity_code === 'task.assign.leave'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.targeted_full_name }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'project.update.mobile'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.targeted_full_name }}</span>
                    <span>&nbsp;{{ dataRiwayat.event2 }}</span>
                    <span
                      v-if="dataRiwayat.activity_code === 'task.assign' || dataRiwayat.activity_code === 'task.assign.leave'"
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >&nbsp;{{ dataRiwayat.task_title }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                </div>

                <!-- kondisi 5 (task delete and update mobile) -->
                <div
                  v-if="
                      dataRiwayat.activity_code === 'task.delete'
                      || dataRiwayat.activity_code === 'task.update.mobile'
                      "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataRiwayat.creator_full_name}}</span>
                    {{ dataRiwayat.event1 }}
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >&nbsp;{{ dataRiwayat.task_title }}</span>
                    <span>&nbsp;{{ dataRiwayat.event2 }}</span>
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataRiwayat.project_title }}</span>
                    <span v-if="dataRiwayat.activity_code === 'project.update.mobile'">&nbsp;{{ dataRiwayat.event3 }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ moment(dataRiwayat.created_at).format('HH:mm') }} WIB
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
        <!-- button load all data notifikasi -->
        <div
          style="margin-top:5px;"
          v-if="isLoadingDataNotifPagination"
          class="d-flex justify-content-center"
        >
          <Loading />
        </div>
        <div v-else class="d-flex justify-content-center mt-3">
          <button
            @click="this.getRiwayatActivity(this.page +=1, 'pagination')"
            type="button"
            class="btn btn-outline-primary"
          >Lihat Lebih banyak</button>
        </div>
      </div>

      <!-- modal -->
      <div class="modal" id="modal-del-task">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <!-- modal header -->
            <div class="modal-header-delete justify-content-end mt-4">
              <i
                style="margin-top: -20px;"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                class="bi bi-x-lg"
              ></i>
            </div>
            <!-- modal body -->
            <div class="modal-body text-center">
              <img src="../../assets/img/icons/delpro.png" />
              <h3 class="mt-3">Oops, Pekerjaan Ini Telah Dihapus.</h3>
              <p>Kamu tidak dapat melihat detail pekerjaan yang telah dihapus.</p>
            </div>
            <div class="modal-footer-delete justify-content-center">
              <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Oke</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" id="modal-del-kpi">
        <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
            <!-- modal header -->
            <div class="modal-header-delete justify-content-end mt-4">
              <i
                style="margin-top: -20px;"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                class="bi bi-x-lg"
              ></i>
            </div>
            <!-- modal body -->
            <div class="modal-body text-center">
              <img src="../../assets/img/icons/delpro.png" />
              <h3 class="mt-3">Oops, KPI / Project Ini Telah Dihapus.</h3>
              <p>Kamu tidak dapat melihat detail KPI / Project yang telah dihapus.</p>
            </div>
            <div class="modal-footer-delete justify-content-center">
              <button type="button" class="btn btn-primary w-35" data-bs-dismiss="modal">Oke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js" src="./RiwayatAktivitas_script.js" />

<style scoped>
.scroll {
  max-height: fit-content;
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