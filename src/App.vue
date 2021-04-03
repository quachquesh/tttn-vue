<template>
  <div id="app">
    <loading :loading="loading" />
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
import Loading from "@/components/template/loading.vue";
// import apiStudent from "@/api/student.js";
// import apiLecturer from "@/api/lecturer.js";
export default {
  data() {
    return {
      transitionName: "fade",
      loading: true
    };
  },
  components: {
    NprogressContainer,
    Navbar,
    Loading
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
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
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
