<template>
  <div class="py-2 container-fluid">
    <div style="margin-top:5px;" v-if="isLoadingDataNotif" class="d-flex justify-content-center">
      <Loading />
    </div>
    <div v-else class="row">
      <div class="col-lg-12">
        <div class="d-flex justify-content-between mx-3 me-3">
          <div>
            <h4 class="mb-4">Notifikasi</h4>
          </div>
          <div
            style="margin-top:5px;"
            v-if="isLoadingReadAll"
          >
            <Loading />
          </div>
          <div v-else style="cursor: pointer;" @click="readAllNotification">
            <span style="font-size: 13px; color: #00A2B9;" class="fw-bold ms-3">
              <img src="../../assets/img/icons/bi_check-all.png" alt srcset /> Tandai Semua Telah Dibaca
            </span>
          </div>
        </div>
        <div>
          <div class="mb-2 mx-3 me-3 scroll">
            <a
              class="mb-2 dropdown-item border-radius-md"
              href="javascript:;"
              v-for="(dataNotifications, index) in dataAllNotif"
              :key="index"
              @click="dataNotifications.menu === 'project.invitation' ? null : readSingleNotification(dataNotifications)"
            >
              <p>
                {{
                moment(dataNotifications.tanggal).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? 'Hari Ini' :
                (moment(dataNotifications.tanggal).format('YYYY-MM-DD') == moment().add(-1, 'days').format('YYYY-MM-DD') ? 'Kemarin' : moment(dataNotifications.tanggal).locale('id').format('DD MMMM YYYY'))
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
                  >{{ getInitials(dataNotifications.title_1) }}</a>
                </div>
                <!-- kondisi 1 (tampilan blank default) -->
                <div
                  v-if="
                      dataNotifications.menu === 'project.create'
                      || dataNotifications.menu === 'project.edit.mobile'
                      || dataNotifications.menu === 'project.delete'
                      || dataNotifications.menu === 'project.kick'
                      || dataNotifications.menu === 'project.leave'
                      || dataNotifications.menu === 'status.edit.mobile'
                      || dataNotifications.menu === 'status.delete'
                      || dataNotifications.menu === 'task.edit.mobile'
                      || dataNotifications.menu === 'task.delete'
                      || dataNotifications.menu === 'task.attachment'
                      || dataNotifications.menu === 'task.assign'
                      || dataNotifications.menu === 'task.kick'
                      || dataNotifications.menu === 'task.move'
                      "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                    {{ dataNotifications.title_2 }}
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataNotifications.object_code }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataNotifications.tanggal).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ dataNotifications.jam }} WIB
                  </p>
                </div>

                <!-- kondisi 2 (tampilan arrow edit) -->
                <div
                  v-if="dataNotifications.menu === 'project.edit.title'
                        || dataNotifications.menu === 'task.edit.status'
                        || dataNotifications.menu === 'task.edit.project'
                        || dataNotifications.menu === 'task.edit.start'
                        || dataNotifications.menu === 'task.edit.end'
                        "
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                    {{ dataNotifications.title_2 }}
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataNotifications.object_code }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataNotifications.tanggal).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ dataNotifications.jam }} WIB
                  </p>
                  <div
                    class="mt-2 border-radius-sm d-inline-flex"
                    style="border: 0.3px solid gainsboro;"
                  >
                    <p
                      class="text-sm text-secondary mb-2 mt-2"
                      style="margin-left: 10px; margin-right: 10px;"
                    >
                      {{ dataNotifications.before }} &nbsp;
                      <span
                        class="text-dark"
                        style="font-weight: bolder;"
                      >
                        <i class="fas fa-arrow-right" />
                        &nbsp; {{ dataNotifications.after }}
                      </span>
                    </p>
                  </div>
                </div>

                <!-- kondisi 3 (tampilan invitation) -->
                <div
                  v-if="dataNotifications.menu === 'project.invitation'"
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                    {{ dataNotifications.title_2 }}
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataNotifications.object_code }}</span>
                    <span
                      v-if="dataNotifications.is_action === 0"
                    >&nbsp;{{ dataNotifications.title_3 }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataNotifications.tanggal).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ dataNotifications.jam }} WIB
                  </p>
                  <div v-if="dataNotifications.is_action === 1" class="mb-2 mt-2 d-inline-flex">
                    <button
                      @click="rejectInvitation(dataNotifications.object_id, dataNotifications.id)"
                      class="btn btn-outline-primary m-1"
                      style="width: 140px;"
                    >Tolak</button>
                    <button
                      @click="accInvitation(dataNotifications, dataNotifications.object_id, dataNotifications.id)"
                      class="btn btn-primary m-1"
                      style="width: 140px;"
                    >Terima</button>
                  </div>
                </div>

                <!-- kondisi 4 task comment -->
                <div
                  v-if="dataNotifications.menu === 'task.comment'"
                  class="d-flex flex-column justify-content-center"
                >
                  <h6 class="mb-1 text-sm font-weight-normal">
                    <span class="font-weight-bold">{{dataNotifications.title_1}}</span>
                    {{ dataNotifications.title_2 }}
                    <span
                      class="font-weight-bold"
                      style="color: #00A2B9;"
                    >{{ dataNotifications.object_code }}</span>
                    <span
                      class="text-secondary"
                    >&nbsp;&nbsp;{{ moment(dataNotifications.tanggal).locale('id').fromNow() }}</span>
                  </h6>
                  <p class="mb-0 text-xs text-secondary">
                    <i class="fa fa-clock me-1"></i>
                    {{ dataNotifications.jam }} WIB
                  </p>
                  <div class="mb-2 card border-radius-sm mt-2" style="background-color: #ffff;">
                    <p
                      style="margin-right: 10px; margin-left: 10px; margin-top: 10px; color: black;"
                    >{{ dataNotifications.title_3 }}</p>
                  </div>
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
            @click="this.getNotification(this.page +=1, 'pagination')"
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

<script lang="js" src="./AllNotif_script.js" />

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