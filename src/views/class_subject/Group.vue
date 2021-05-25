<template>
  <div id="group-class-subject">
    <div class="grid wide">
      <div class="row">
        <div class="col c-12">
          <div class="form-box">
            <div class="form-navbar">
              <ul class="list-menu">
                <router-link
                  :to="{ name: 'Group' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Nhóm
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'ListGroups' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Danh sách nhóm
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'GroupMembers' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Thành viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'Approves' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Phê duyệt
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'Settings' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Cài đặt
                  </li>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="group-body" style="margin-top: 30px">
      <router-view />
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
  created() {
    document.title = "Nhóm lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.form-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  .list-menu {
    list-style: none;
    display: flex;
    align-items: center;
    .item {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      user-select: none;
      transition: linear 0.2s;
      border-bottom: 1px solid var(--color-primary);
      &.active {
        color: #000;
        background-color: rgba(#1266f1, 0.3);
        &:hover {
          background-color: rgba(#1266f1, 0.3);
        }
      }
      &:hover {
        background-color: rgba(#1266f1, 0.1);
      }
      &:active {
        background-color: rgba(#1266f1, 0.2);
      }
    }
  }
}

.create-user-body {
  margin-top: 32px;
}
</style>
