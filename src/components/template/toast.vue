<template>
  <transition name="fade" mode="out-in" appear>
    <div
      class="toast-notify-box"
      :class="{
        success: data.type == 0,
        danger: data.type == 1,
        waring: data.type == 2,
        info: data.type == 3
      }"
      @click="destroyToast()"
    >
      <div class="left">
        <div class="icon">
          <span class="material-icons" v-if="data.type == 0">check</span>
          <span class="material-icons" v-else-if="data.type == 1"
            >dangerous</span
          >
          <span class="material-icons" v-else-if="data.type == 2">warning</span>
          <span class="material-icons" v-else>info</span>
        </div>
      </div>
      <div class="right">
        <div class="toast-title">{{ data.title }}</div>
        <div class="toast-content">{{ data.message }}</div>
      </div>
      <div class="time"></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    destroyToast() {
      this.$el.classList.add("fadeOut");
      this.$el.addEventListener("animationend", () => {
        this.$el.remove();
      });
    }
  },
  mounted() {
    this.$el.querySelector(".time").style.animationDuration =
      (this.data.time / 1000 || 2) + "s";
  }
};
</script>

<style lang="scss" scoped>
.toast-notify-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  margin: 10px 0px;
  cursor: pointer;
  padding: 8px 0px;
  box-shadow: 0px 0px 2px rgba(#000, 0.4), 0px 0px 5px rgba(#000, 0.3);
  transition: linear 0.3s;
  color: #ffffff;
  &:hover {
    box-shadow: 0px 0px 3px rgba(#000, 0.5), 0px 0px 10px rgba(#000, 0.5);
  }
  &.fadeOut {
    animation: toastFadeOut linear 0.3s;
  }
  &.success {
    background-color: rgba(#00b74a, 0.7);
  }
  &.danger {
    background-color: rgba(#f72a2a, 0.8);
  }
  &.waring {
    background-color: rgba(#ebc700, 0.7);
  }
  &.info {
    background-color: rgba(#39c0ed, 0.7);
  }
  .time {
    content: "";
    width: 0%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    background-color: var(--color-orange);
    transform: translateY(100%);
    animation: aniTimeout linear 2s;
  }
  @keyframes aniTimeout {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
  .left {
    .icon {
      padding: 0px 10px;
      // padding: 5px 0px;
    }
  }
  .right {
    flex: 1;
    .toast-title {
      font-weight: 500;
      font-size: 14px;
    }
    .toast-content {
      font-weight: 400;
      font-size: 13px;
      margin-top: 3px;
    }
  }
}

@keyframes toastFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>
