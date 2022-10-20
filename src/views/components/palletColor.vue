<template>
  <ul class="dropdown-menu" aria-labelledby="palletWarna" role="menu" style="width: 35%;">
    <div class="mt-2">
      <span style="font-size: 18px;" class="text-dark fw-bold ms-3">Warna KPI / Project</span>
    </div>
    <div class="p-3">
      <div class="row w-100">
        <div class="col-lg-2 col-md-4 col-sm-6" v-for="(selectColors, index) in selectColor" :key="index">
          <div
            @click="getColorValue(selectColors)"
            class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
            :style="{backgroundColor: selectColors}"
          >
            <img
              v-if="colorValue === selectColors"
              class="position-absolute centered w-90"
              src="../../assets/img/icons/check-lingkaran.png"
              alt="icon checklist"
            />
          </div>
        </div>
      </div>
      <div class="row w-100">
        <div class="col-lg-2 col-md-4 col-sm-6" v-for="(selectColorOpacity1s, index) in selectColorOpacity1" :key="index">
          <div
            @click="getColorValue(selectColorOpacity1s)"
            class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
            :style="{backgroundColor: selectColorOpacity1s}"
          >
            <img
              v-if="colorValue === selectColorOpacity1s"
              class="position-absolute centered w-90"
              src="../../assets/img/icons/check-lingkaran.png"
              alt="icon checklist"
            />
          </div>
        </div>
      </div>
      <div class="row w-100">
        <div class="col-lg-2 col-md-4 col-sm-6" v-for="(selectColorOpacity2s, index) in selectColorOpacity2" :key="index">
          <div
            @click="getColorValue(selectColorOpacity2s)"
            class="p-4 d-inline-block rounded-circle me-2 roundedCustom position-relative"
            :style="{backgroundColor: selectColorOpacity2s}"
          >
            <img
              v-if="colorValue === selectColorOpacity2s"
              class="position-absolute centered w-90"
              src="../../assets/img/icons/check-lingkaran.png"
              alt="icon checklist"
            />
          </div>
        </div>
      </div>
    </div>
  </ul>
</template>
<script>
export default {
  name: 'paletColor',
  data(){
    return {
        colorValue: "",
        selectColor: [
          "#00A2B9",
          "#36B37E",
          "#F3AF00",
          "#DE350B",
          "#7039CB",
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
        ],
    }
  },
  methods: {
    getColorValue(value) {
      this.colorValue = value;
      this.$emit('clicked', value)
    },
  }
}
</script>
<style scoped>
.centered {
  top: 0;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
}
.roundedCustom {
  transition: box-shadow 0.3s;
  cursor: pointer;
}
.roundedCustom:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>
