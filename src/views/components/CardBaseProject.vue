<template>
  <div class="mb-4 card roundedCustom" v-on:mouseover="mouseIn" v-on:mouseleave="mouseOut">
    <div class="p-1 py-2 card-body position-relative" @click="urlParams()">
      <div class="d-flex align-items-center">
        <!-- inisial name Project -->
        <div>
          <div
            style="width:55px; height: 55px;"
            class="rounded-2 ms-2 d-flex justtify-content-center"
            :style="{'backgroundColor': hexToRgbA(color === null ? '#080808' : color)}"
          >
            <div style="width:55px;">
              <p
                :style="{'color': color === null ? 'black' : color}"
                class="fs-4 p-2 text-center fw-bold"
              >{{getInitials(value)}}</p>
            </div>
          </div>
        </div>
        <div class="w-70">
          <!-- title -->
          <h6 style="text-transform: capitalize;" class="font-weight-bolder ms-3">{{ value }}</h6>
          <!-- Tipe Project -->
          <div
            :class="detail === 'KPI' ? 'bg-kpi roundedCustomTipe ms-3 d-inline-block py-1 px-2'
            : detail === 'Tupoksi' ? 'bg-tupoksi roundedCustomTipe ms-3 d-inline-block py-1 px-2' 
            : 'bg-lainnya roundedCustomTipe ms-3 d-inline-block py-1 px-2'"
          >
            <p class="m-0 text-center fw-bold">{{detail}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- star favorite -->
    <div
      style="cursor: pointer;"
      v-if="fav === 1"
      class="position-absolute right"
      @click="removeToFav(type)"
    >
      <img src="@/assets/img/icons/star3.png" />
    </div>
    <div
      style="cursor: pointer;"
      v-if="fav === 0 && this.mouse === true"
      class="position-absolute right"
      @click="addToFav"
    >
      <img :src="defaultHover" v-on:mouseover="mouseInStar" v-on:mouseleave="mouseOutStar" />
    </div>
  </div>
</template>

<script>
import ApiService from '../../services/ApiService';
import { mapActions } from "vuex";
import { ToastError, ToastSuccess } from "../../composables/toast";

export default {
  name: "cardBaseProject",
  props: {
    type:  {
      type: String,
      required: true
    },
    dataAll: {
      type: Array,
      required: true
    },
    dataFavorite: {
      type: Array,
      required: true
    },
    project_id: {
      type: Number,
      required: true
    },
    detail: {
      type: String,
      required: true,
    },
    value:{
      type: String,
    },
    color: {
      type: String,
    },
    fav: {
      type: Number
    }
  },
  data() {
    return {
      mouse: false,
      breadcumbs: {
        condition: true,
        project_name: this.value
      },
      token: '',
      defaultHover: require(`@/assets/img/icons/star1.png`),
    };
  },
  methods: {
    ////////////////////////////////////////////// STATE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     ...mapActions([ // spread operator so that other methods can still be added.
      'updateProjectIdAction',
      'updateFavoriteAction'
    ]),
    ///////////////////////////////////////////// FUNCTION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    urlParams() {
      if (this.project_id !== null || this.project_id  !== undefined) {
        this.$router.push({ name: "Project Board" });
        // update state
        this.updateProjectIdAction(this.project_id)
        this.updateFavoriteAction(this.fav)
        // save id to cookie
        this.$cookies.set('project_id',this.project_id);
        this.$cookies.set('favorite',this.fav);
        this.$cookies.set("project_name", this.breadcumbs);
        this.emitter.emit("event-data", this.breadcumbs);
      }
    },

    mouseIn() {
      this.mouse = true;
    },

    mouseOut() {
      this.mouse = false;
    },

    mouseInStar() {
      this.defaultHover = require(`@/assets/img/icons/star2.png`);
    },

    mouseOutStar() {
      this.defaultHover = require(`@/assets/img/icons/star1.png`);
    },
    // function convert hexa to rgba
    hexToRgbA(hex){
      var c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          c= hex.substring(1).split('');
          if(c.length== 3){
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c= '0x'+c.join('');
          return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
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
    ///////////////////////////////////////////// INTEGRASI API \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // add fav
    async addToFav() {
      if (this.dataAll !== null) {
        if (this.dataFavorite.length === 9) {
          ToastError("Anda tidak bisa memiliki project favorit lebih dari 9")
          return
        }
          let dataTarget = JSON.parse(JSON.stringify(this.dataAll))
          console.log("data target add = ",dataTarget)
          try {
            let data = {
              project_id: this.project_id,
              token: this.token
            }
          const response = await ApiService.addFavorite(data)
          let findData = dataTarget.find(f => f.id === this.project_id)
          if (findData === undefined) {
            alert("Id KPI / Project tidak ditemukan")
          } else {
            this.$emit('clicked', findData)
          }
          ToastSuccess(response.data.message)
        } catch (error) {
          let err = error.response.data.message;
          if (err === null || err === undefined) {
            ToastError(error.message)
          } else if (err === '') {
            ToastError('Tambah Favorit: Server error')
          } else {
            ToastError(err)
          }
        }
      }
    },
    // remove fav
    async removeToFav(type) {
      if (this.dataAll !== null) {
          let dataTarget = JSON.parse(JSON.stringify(this.dataAll))
          console.log("data target remove = ",dataTarget)
          try {
            let data = {
              project_id: this.project_id,
              token: this.token
          }
          const response = await ApiService.deleteFavorite(data)
          let findData = dataTarget.find(f => f.id === this.project_id)
          let findDataAll = dataTarget.find(f => f.id === this.project_id)
          if (findData !== undefined && type === 'roomFav') {
            this.$emit('clicked', findData, null)
          } else if (findDataAll !== undefined && type === 'roomAllProject') {
            this.$emit('clicked', findDataAll, "removeFromAllProject")
          }
          ToastSuccess(response.data.message)
        } catch (error) {
          let err = error.response.data.message;
          if (err === null || err === undefined) {
            ToastError(error.message)
          } else if (err === '') {
            ToastError('Hapus Favorit: Server error')
          } else {
            ToastError(err)
          }
        }
      }
    }
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
  mounted() {
    // console.log("cek data fav = ",this.dataAll)
  }
};
</script>

<style scoped>
.bg-lainnya {
  color: #666666;
  background-color: #efefef;
}
.bg-tupoksi {
  color: #36b37e;
  background-color: #eafbef;
}
.bg-kpi {
  color: #5c00b9;
  background-color: #efe6f8;
}
.roundedCustomTipe {
  border-radius: 8px;
}
.roundedCustom {
  transition: box-shadow 0.3s;
  border-radius: 8px;
  cursor: pointer;
}
.roundedCustom:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
}
.right {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
/* element style*/
p {
  font-size: 12px;
}
</style>
