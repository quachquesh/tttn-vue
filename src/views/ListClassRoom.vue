<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div id="class-room" class="display-grid-card">
    <loading :z-index="1500" :loading="loading" />
    <h2 v-if="$store.state.CLASSSUBJECT.classSubjects.length < 1">
      Chưa tham gia lớp học nào
    </h2>
    <div
      v-for="classSubject in $store.state.CLASSSUBJECT.classSubjects"
      :key="classSubject.id"
      @click="clickClassRoom(classSubject.id)"
      v-else
    >
      <card-subject :data-class="classSubject" />
    </div>
  </div>
</template>

<script>
import CardSubject from "@/components/template/card_subject.vue";
import Loading from "@/components/template/loading";
export default {
  props: ["subjectId"],
  data() {
    return {
      loading: true
    };
  },
  methods: {
    clickClassRoom: function(id) {
      this.$router.push({
        name: "ClassRoom",
        params: {
          roomId: id
        }
      });
    }
  },
  components: {
    Loading,
    CardSubject
  },
  async created() {
    document.title = "Danh sách lớp học";
    if (this.$store.getters.getUserRole) {
      this.$store
        .dispatch("apiGetClassSubject", [
          localStorage.getItem("token_user"),
          this.subjectId
        ])
        .then(res => {
          this.$store.commit("setDataClassSubject", res.data);
          this.$store.commit("setSubjectId", this.subjectId);
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("Không thể gửi yêu cầu đến máy chủ");
        });
    } else {
      this.$store
        .dispatch(
          "apiGetClassSubjectMember",
          localStorage.getItem("token_user")
        )
        .then(res => {
          this.$store.commit("setDataClassSubject", res.data);
          this.loading = false;
        })
        .catch(() => {
          this.$message.error("Không thể gửi yêu cầu đến máy chủ");
        });
    }
    // $store.getters.getUserRole
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
#class-room {
  position: relative;
}
</style>
