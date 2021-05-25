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
    <div class="row" style="background-color: red; color: #fff;">
      <div class="col c-12">
        Chắc năng đang xây dựng
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
    document.title = "Bài tập lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style></style>
