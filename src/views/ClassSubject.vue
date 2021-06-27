<template>
  <div>
    <transition name="slide-left" mode="out-in" appear>
      <router-view v-if="loading == false"></router-view>
    </transition>
  </div>
</template>
<script>
import apiClassSubject from "@/api/classSubject";

export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  },
  async created() {
    if (
      Object.keys(this.$store.getters.getClassDetails) == 0 ||
      this.$store.getters.getClassDetails.id != this.roomId
    ) {
      await apiClassSubject
        .getAllInfo(localStorage.getItem("token_user"), this.roomId)
        .then(res => {
          this.$store.commit("setClassNotifies", res.data.notifies);
          this.$store.commit("setClassSubjectDetails", res.data.classSubject);
          this.$store.commit("setSubjectDetails", res.data.subject);
          this.$store.commit("setClassMember", res.data.classMembers);
          this.$store.commit("setClassLecturer", res.data.classLecturer);
          this.loading = false;
        })
        .catch(() => this.$message.error("Không thể gửi yêu cầu đến máy chủ"));
    } else {
      this.loading = false;
    }

    this.$store.commit("setStateClassSubject", true); // store navbar
  },
  destroyed() {
    this.$store.commit("setStateClassSubject", false); // store navbar
  }
  // watch: {
  //   $route: {
  //     immediate: true,
  //     handler(to) {
  //       this.transitionName = to.meta.transition || "fade";
  //     }
  //   }
  // }
};
</script>

<style lang="scss">
.title-navbar {
  list-style: none;
  display: flex;
  align-items: center;
  .title-navbar__item {
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      .material-icons {
        margin-right: 10px;
      }
    }
  }
}
</style>
