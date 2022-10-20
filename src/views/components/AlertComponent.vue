<template>
  <div v-show="isVisible" class="alert alert-warning alert-dismissible fade show position-absolute w-50 fixed-top" role="alert">
    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
    <button
      @click="isVisible = false"
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>
<script>
export default {
  name: "AlertComponent",
  data(){
    return {
      isVisible: true
    }
  }
}
</script>
<style scoped>
</style>