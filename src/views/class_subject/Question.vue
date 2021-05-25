<template>
  <div class="grid wide">
    <div class="row" style="background-color: red; color: #fff;">
      <div class="col c-12">
        Thảo luận ...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: {
      required: true
    }
  },
  created() {
    document.title = "Thảo luận lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style></style>
