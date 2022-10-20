<template>
  <div class="py-2 container-fluid">
    <div class="row mb-5">
      <h4 class="mb-4">Dashboard</h4>
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-7">
            <list-task-card
              :isLoadingMyTask="isLoadingMyTask"
              :terlambat="terlambat"
              :mendekati_deadline="mendekati_deadline"
              :semua_kerjaan="semua_kerjaan"
            />
            <div class="row mt-4">
              <div class="col-lg-12 mb-lg">
                <!-- line chart -->
                <div class="card z-index-2">
                  <div class="card">
                    <div class="pb-0 card-header mb-0 d-flex justify-content-between">
                      <h5>Riwayat Aktivitas</h5>
                      <span
                        @click="toDetailRiwayatActivity()"
                        style="cursor:pointer;"
                        class="text-primary"
                      >Lihat Semua</span>
                    </div>
                    <div
                      style="margin-top:5px;"
                      v-if="isLoadingRiwayat"
                      class="d-flex justify-content-center"
                    >
                      <Loading />
                    </div>
                    <div v-else class="p-4 card-body scroll">
                      <a
                        class="mb-2 dropdown-item border-radius-md"
                        href="javascript:;"
                        v-for="(dataRiwayat, index) in stateRiwayat"
                        :key="index"
                        @click="toProjectDetail(dataRiwayat)"
                      >
                        <div class="py-1 d-flex">
                          <div class>
                            <a
                              href="javascript:;"
                              class="border-0 avatar avatar-sm rounded-circle me-3"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              :style="{'backgroundColor': '#'+colorRandom(), 'fontWeight': 'bold'}"
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
                            <h6 class="mb-1 text-sm font-weight-normal"
                            >
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
                              <!-- <span
                                class="text-secondary"
                              >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span> -->
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
                              <!-- <span
                                class="text-secondary"
                              >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span> -->
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
                              <span
                                v-if="dataRiwayat.activity_code === 'status.add'"
                              >{{ dataRiwayat.event3 }}</span>
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
                              <!-- <span
                                class="text-secondary"
                              >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span> -->
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
                              <!-- <span
                                class="text-secondary"
                              >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span> -->
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
                              <span
                                v-if="dataRiwayat.activity_code === 'project.update.mobile'"
                              >&nbsp;{{ dataRiwayat.event3 }}</span>
                              <!-- <span
                                class="text-secondary"
                              >&nbsp;&nbsp;{{ moment(dataRiwayat.created_at).locale('id').fromNow() }}</span> -->
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
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <h6 class="mb-1 text-black-50">Kalender</h6>
                <div v-if="dateSchedule === ''" class="col-lg-9">
                  <p style="font-size: 18px; font-weight: bold; color: #4d5154;">
                    {{ moment().locale('id').format("dddd, DD MMMM YYYY") }} &nbsp;&nbsp;
                    <span
                      style="cursor:pointer;"
                    >
                      <input
                        type="date"
                        v-model="dateSchedule"
                        @change="getListTaskSchedule"
                        id="hideborder"
                      />
                    </span>
                  </p>
                </div>
                <div v-else class="col-lg-9">
                  <p style="font-size: 18px; font-weight: bold; color: #4d5154;">
                    {{ moment(dateSchedule).locale('id').format("dddd, DD MMMM YYYY") }} &nbsp;&nbsp;
                    <span
                      style="cursor:pointer;"
                    >
                      <input
                        type="date"
                        v-model="dateSchedule"
                        @change="getListTaskSchedule"
                        id="hideborder"
                      />
                    </span>
                  </p>
                </div>
              </div>
              <div
                style="margin-top:5px;"
                v-if="isLoadingSchedule"
                class="d-flex justify-content-center"
              >
                <Loading />
              </div>
              <div v-else class="scroll-schedule">
                <div v-for="(dataSchedule, index)  in  dataSchedules" :key="index">
                  <hr />
                  <div v-if="dataSchedule.length !== 0" class="card-body row">
                    <div class="col-lg-3">
                      <h6
                        style="font-size: 20px;"
                        :style="{'color': dataSchedule.task.length === 0 ? '#b3b6b7' : '#9dd7e0'}"
                        class="text-center"
                      >
                        {{
                        moment(dataSchedule.date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? 'Hari Ini' :
                        (moment(dataSchedule.date).format('YYYY-MM-DD') == moment().add(1, 'days').format('YYYY-MM-DD') ? 'Besok' : moment(dataSchedule.date).locale('id').format('dddd'))
                        }}
                      </h6>
                      <h6
                        class="text-center"
                        style="font-size: 45px;"
                        :style="{'color': dataSchedule.task.length === 0 ? '#787d7e' : '#00A2B9'}"
                      >{{ moment(dataSchedule.date).format("DD") }}</h6>
                    </div>
                    <div
                      class="col-lg-9"
                      data-bs-target="#modal-del-task"
                      data-bs-toggle="modal"
                      v-if="dataSchedule.task.length === 0"
                    >
                      <div
                        class="card border-radius-sm"
                        style="background-color: #dbdfe0; border-left-width: thick; border-left-color: #b3b6b7; height: 100px;"
                      >
                        <div class="mt-3 mb-1 mx-1">
                          <div class="d-flex justify-content-between mt-4 mb-2 mx-3">
                            <div>
                              <h6 style="color: #b3b6b7;">Tidak ada pekerjaan untuk hari {{ moment(dataSchedule.date).locale('id').format("dddd, DD MMMM YYYY") }}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-lg-9"
                      data-bs-target="#modal-del-task"
                      data-bs-toggle="modal"
                      v-else
                    >
                      <div
                        class="mb-3"
                        v-for="(taskSchedule, index)  in  dataSchedule.task"
                        :key="index"
                      >
                        <div
                          class="card border-radius-sm"
                          style="border-left-width: thick;"
                          :style="{'backgroundColor': hexToRgbA(taskSchedule.project.color === '' ? '#babdbe' : taskSchedule.project.color), 'border-left-color' : taskSchedule.project.color }"
                        >
                          <div class="mt-3 mb-1 mx-1">
                            <div class="d-flex justify-content-between mt-2 mx-3">
                              <div>
                                <h6>{{ taskSchedule.title }}</h6>
                                <p>{{ taskSchedule.project.project_name }}</p>
                              </div>
                              <div class="mt-2 avatar-group">
                                <a
                                  v-for="(assignee, index) in taskSchedule.assign"
                                  :key="index"
                                  href="javascript:;"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  :title="assignee.full_name"
                                  class="border-0 avatar avatar-sm rounded-circle"
                                  :style="{'backgroundColor': '#'+colorRandom(), 'fontWeight': 'bolder', 'color': 'white'}"
                                >{{ getInitials(assignee.full_name) }}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="card-body row">
                    <div class="col-lg-3">
                      <h6 style="color: #80858a;" class="text-center">
                        {{
                        dataSchedule.date[0] == moment().format('DD') ? moment(dataSchedule.date[0]).calendar('days') :
                        dataSchedule.date[1] == moment().format('DD') ? moment(dataSchedule.date[1]).add(1, 'days').calendar() :
                        moment(dataSchedule.date).format('dddd')
                        }}
                      </h6>
                      <h6
                        class="text-center"
                        style="font-size: 25px; color: #676b6e;"
                      >{{ moment(dataSchedule.date).format("DD") }}</h6>
                    </div>
                    <div class="col-lg-9">
                      <div
                        class="card border-radius-sm"
                        style="background-color: #babdbe; border-left-width: thick; border-left-color: #4d5154;"
                      >
                        <div class="mt-3 mb-1 mx-1">
                          <div class="d-flex justify-content-between mt-2 mb-2 mx-3">
                            <div>
                              <h6>Tidak Ada Pekerjaan</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <img src="@/assets/img/icons/delpro.png" />
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
                <img src="@/assets/img/icons/delpro.png" />
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
  </div>
</template>


<script lang="js" src="./Dashboard_script.js"></script>

<style scoped>
#hideborder {
  border-top-style: hidden;
  border-right-style: hidden;
  border-left-style: hidden;
  border-bottom-style: hidden;
  background-color: transparent;
  color: black;
  font-size: 16px;
  width: 20px;
}
#hideborder:focus {
  background-color: rgb(255, 255, 255, 0.1);
}
.scroll {
  max-height: 700px;
  overflow-y: auto;
}
.scroll-schedule {
  max-height: 970px;
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

