<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div id="subject" class="display-grid-card">
    <loading z-index="1500" :loading="loading" />
    <div
      v-for="subject in this.$store.state.SUBJECT.subjects"
      :key="subject.id"
      @click="clickSubject(subject.id)"
    >
      <card-subject :dataSubject="subject" />
    </div>
  </div>
</template>

<script>
import CardSubject from "@/components/template/card_subject.vue";
import Loading from "@/components/template/loading";

export default {
  data: function() {
    return {
      loading: true
    };
  },
  methods: {
    clickSubject(id) {
      this.$router.push({ name: "ListClassRoom", params: { subjectId: id } });
    }
  },
  components: {
    Loading,
    CardSubject
  },
  async beforeCreate() {
    document.title = "Danh sách môn học";
    this.$router.options.nprogress.set(0.7);
    await this.$store
      .dispatch("apiGetSubjectByUserId", localStorage.getItem("token_user"))
      .then(res => {
        this.$store.commit("setDataSubject", res.data);
      })
      .catch(() => {
        this.$message.error("Không thể gửi yêu cầu đến máy chủ");
      });
    this.$store.commit("setSubjectId", null);
    this.$router.options.nprogress.done();
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
