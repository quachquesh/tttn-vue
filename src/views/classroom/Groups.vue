<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12">
        <ul class="title-navbar">
          <li class="title-navbar__item">
            <div class="btn btn-transparent active">
              <span class="material-icons">library_books</span>
              Bài tập
            </div>
          </li>
          <li class="title-navbar__item">
            <div class="btn btn-transparent">
              <span class="material-icons">question_answer</span>
              Thảo luận
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col c-12">
        Groups
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
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("Created", this.name);
    document.title = `Lớp ${this.$route.params.roomId} - Nhóm - ${this.test}`;
    this.$router.options.nprogress.done();
  }
};
</script>

<style></style>
