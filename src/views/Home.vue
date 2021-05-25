<template>
  <div id="home">
    <router-view
      v-if="
        this.$store.state.USER.dataUser.role == 'gv' ||
          this.$store.state.USER.dataUser.role == 'admin'
      "
    />
    <router-view name="ListClassSubject" v-else></router-view>
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
