<template>
  <div id="app">
    <navbar />
    <div id="app-body">
      <nprogress-container></nprogress-container>
      <transition :name="transitionName" mode="out-in" appear>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import Navbar from "@/components/template/navbar.vue";
import apiStudent from "@/api/student.js";
import apiLecturer from "@/api/lecturer.js";
export default {
  data() {
    return {
      transitionName: "fade"
    };
  },
  components: {
    NprogressContainer,
    Navbar
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.transitionName = to.meta.transition || "fade";
        document.title = to.meta.title || "Trang Chủ";
      }
    }
  },
  async created() {
    let token_user = localStorage.getItem("token_user");
    if (token_user) {
      await apiLecturer
        .userDetails(token_user)
        .then(res => {
          this.$store.commit("setStateLogin", true);
          this.$store.commit("setDataUser", res.data);
          if (this.$route.name === "Login") {
            this.$router.push("/");
          }
        })
        .catch(err => {
          if (err.response.data.message === "Unauthenticated.") {
            apiStudent
              .userDetails(token_user)
              .then(res => {
                this.$store.commit("setStateLogin", true);
                this.$store.commit("setDataUser", res.data);
                if (this.$route.name === "Login") {
                  this.$router.push("/");
                }
              })
              .catch(() => {
                this.$store.commit("setStateLogin", false);
                this.$router.push("/dang-nhap");
              });
          }
        });
    } else {
      await this.$router.push("/dang-nhap");
    }
    // this.$store.dispatch("checkLogin", localStorage.getItem("token_user"))
  }
  // mounted() {
  //   console.log('abasd');
  //   custom.clickBtnAnimation();
  // },
};
</script>

<style lang="scss">
#app-body {
  padding: 30px;
  box-sizing: border-box;
  position: relative;
  margin-top: var(--height-navbar);
}

#toast-box {
  position: fixed;
  right: 8px;
  top: calc(var(--height-navbar) + 5px);
  z-index: 1503;
}

.display-grid-card {
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  grid-row-gap: 35px;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 100%;
  width: 100%;
}

@media (max-width: 1113px) {
  .display-grid-card {
    grid-template-columns: 50% 50%;
  }
}

@media (max-width: 739px) {
  .display-grid-card {
    grid-template-columns: 100%;
  }
}
</style>
