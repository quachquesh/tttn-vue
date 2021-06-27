<template>
  <div id="app">
    <loading :loading="loading" />
    <navbar />
    <div
      id="app-body"
      :class="{
        'navbar-extra-show':
          $store.state.NAVBAR.isSubject || $store.state.NAVBAR.isClassSubject
      }"
    >
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
body {
  background-color: #f3f3f3;
}
#app-body {
  padding: 30px;
  box-sizing: border-box;
  position: relative;
  margin-top: var(--height-navbar);
  position: relative;
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

.list-card {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 1113px) {
  #app-body {
    &.navbar-extra-show {
      margin-top: calc(var(--height-navbar) * 2 - 8px);
    }
  }
  .display-grid-card {
    grid-template-columns: 50% 50%;
  }
}

@media (max-width: 739px) {
  #app-body {
    padding: 30px 10px;
  }
  .display-grid-card {
    grid-template-columns: 100%;
  }
  .list-card {
    justify-content: center;
  }
}
</style>
