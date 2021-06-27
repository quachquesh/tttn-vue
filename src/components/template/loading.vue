<template>
  <transition name="fade">
    <div class="loading" v-if="checkLoading()" :style="{ zIndex: zIndex }">
      <div
        class="loading-background"
        :style="{ opacity: opacityBackground }"
      ></div>
      <div class="loading-box">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "loading",
  props: {
    opacityBackground: {
      default: 1
    },
    loading: {
      default: true
    },
    zIndex: {
      default: 3000
    }
  },
  methods: {
    checkLoading() {
      if (this.loading == false) {
        document.querySelector("body").style.overflowY = "auto";
        document.querySelector("body").style.overflowX = "auto";
        return false;
      } else {
        return true;
      }
    }
  },
  beforeCreate() {
    document.querySelector("body").style.overflowY = "hidden";
    document.querySelector("body").style.overflowX = "hidden";
  }
};
</script>

<style scoped lang="scss">
.loading {
  position: absolute;
  top: -30px;
  left: -30px;
  bottom: -30px;
  right: -30px;
  user-select: none;
  .loading-background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #f9f9f9;
    user-select: none;
  }
  .loading-box {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    span {
      width: 15px;
      height: 15px;
      background-color: var(--color-danger);
      margin: 0 15px;
      border-radius: 50%;
      user-select: none;
      animation: loading linear 1.6s infinite;
    }
    span:nth-child(2) {
      background-color: var(--color-primary);
      animation-delay: 0.4s;
    }
    span:nth-child(3) {
      background-color: var(--color-success);
      animation-delay: 0.8s;
    }
    @keyframes loading {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(2);
      }
    }
  }
}
</style>
