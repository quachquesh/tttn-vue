<template>
  <div id="home">
    <router-view
      v-if="
        this.$store.state.USER.dataUser.role == 'gv' ||
          this.$store.state.USER.dataUser.role == 'admin'
      "
    />
    <router-view name="ListClassRoom" v-else></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
