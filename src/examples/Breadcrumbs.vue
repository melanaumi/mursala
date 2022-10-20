<template>
  <nav
    aria-label="breadcrumb"
    v-if="project.condition && this.$route.path === '/project/project-board'"
  >
    <ol
      class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb scoped"
      :class="`${this.$store.state.isRTL ? '' : ' me-sm-6'} ${this.$store.state.isNavFixed ? 'text-dark' : 'text-white' } ${this.$store.state.sideonoff ? 'onToggle' : 'offToggle mx-12' }`"
    >
      <li
        class="text-sm breadcrumb-item"
        :class="'text-dark'"
        aria-current="page"
        style="cursor: pointer;"
        @click="toProjectList"
      >{{ 'KPI/Project' }}</li>
      <li
        class="text-sm breadcrumb-item"
        :class="'text-secondary'"
        aria-current="page"
        style="cursor: pointer;"
      >{{ project.project_name }}</li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: "breadcrumbs",
  props: {
    currentPage: {
      required: true
    },
    textWhite: {
      type: String
    }
  },
  data() {
    return {
      project: {
        condition: false,
        project_name: ''
      },
    }
  },
  methods: {
    toProjectList() {
      this.$router.push({name: 'KPI/Project'})
      this.$cookies.remove('favorite');
      this.$cookies.remove('project_id');
      this.$cookies.remove('project_name');
      // this.$cookies.remove('project_type');
    }
  },
  created() {
    let data = JSON.parse(JSON.stringify(this.$cookies.get('project_name')));
    if (data !== null) {
    this.project = {
        condition: data.condition,
        project_name: data.project_name
      }
    }
  },
  mounted() {
    this.emitter.on("event-data", value => {
      this.project = {
        condition: value.condition,
        project_name: value.project_name
      }
    });
  }
};
</script>
<style scoped>
.offToggle {
  /*margin-left: 205px;*/
}
.onToggle {
  margin-left: 100px;
  margin-right: 100px;
}
</style>"
