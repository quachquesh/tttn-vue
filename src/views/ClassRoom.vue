<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12">
        <transition name="fade" mode="out-in" appear>
          <router-view></router-view>
        </transition>
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
  data() {
    return {
      // transitionName: "fade"
    };
  },
  created() {
    document.title = `Lớp ${this.roomId}`;
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
