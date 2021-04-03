<template>
  <div>
    <loading z-index="1500" :loading="loading" />
    <div class="grid wide">
      <div class="row">
        <div class="col c-12">
          <transition name="fade" mode="out-in" appear>
            <router-view
              :classSubject="classSubject"
              :subject="subject"
            ></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiClassSubject from "@/api/classSubject";
import Loading from "@/components/template/loading";

export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      loading: true,
      classSubject: {},
      subject: {}
    };
  },
  components: {
    Loading
  },
  async created() {
    await apiClassSubject
      .getAllInfo(localStorage.getItem("token_user"), this.roomId)
      .then(res => {
        this.$store.commit("setClassSubjectDetails", res.data.classSubject);
        this.$store.commit("setSubjectDetails", res.data.subject);
        this.$store.commit("setClassMember", res.data.classMembers);
        this.$store.commit("setClassLecturer", res.data.classLecturer);
        this.$set(
          this,
          "classSubject",
          this.$store.state.CLASSSUBJECTDETAILS.classSubject
        );
        this.$set(
          this,
          "subject",
          this.$store.state.CLASSSUBJECTDETAILS.subject
        );
        this.loading = false;
      })
      .catch(() => this.$message.error("Không thể gửi yêu cầu đến máy chủ"));
    this.$store.commit("setStateClassRoom", true); // store navbar
  },
  destroyed() {
    this.$store.commit("setStateClassRoom", false); // store navbar
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
