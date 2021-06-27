<template>
  <div id="home">
    <transition name="slide-left" mode="out-in" appear>
      <router-view
        v-if="
          this.$store.state.USER.dataUser.role == 'gv' ||
            this.$store.state.USER.dataUser.role == 'admin' ||
            this.$route.name == 'TicketManager'
        "
      />
      <router-view name="ListClassSubject" v-else></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit("setStateSubject", true);
  },
  destroyed() {
    this.$store.commit("setStateSubject", false);
  }
};
</script>

<style></style>
