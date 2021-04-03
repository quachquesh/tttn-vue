<template>
  <div id="lecturer-management">
    Quản lý giảng viên
  </div>
</template>

<script>
export default {
  created() {
    if (this.$store.state.USER.dataUser.role === "admin") {
      this.$router.options.nprogress.done();
    }
  }
};
</script>

<style></style>
