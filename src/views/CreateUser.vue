<template>
  <div id="create-user">
    <div class="grid wide">
      <div class="row">
        <div class="col c-12">
          <div class="form-box">
            <div class="form-navbar">
              <ul class="list-menu">
                <router-link
                  :to="{ name: 'CreateStudent' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Thêm sinh viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'ImportStudent' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Import sinh viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'StudentManagement' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Quản lý sinh viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'CreateLecturer' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Thêm giảng viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'ImportLecturer' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Import giảng viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'LecturerManagement' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Quản lý giảng viên
                  </li>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="create-user-body">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.form-navbar {
  border-bottom: 1px solid var(--color-primary);
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
