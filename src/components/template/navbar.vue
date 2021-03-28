<template>
  <div id="navbar">
    <nav class="navbar">
      <router-link to="/" custom v-slot="{ navigate }">
        <div class="nav-icon" @click="navigate">
          <img src="/assets/img/Logo_STU_2.png" alt="logo" />
        </div>
      </router-link>

      <ul class="nav-middle" v-if="this.$store.state.NAVBAR.isClassRoom">
        <router-link
          :to="{
            name: 'ClassRoom',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, isExactActive }"
        >
          <li
            class="middle-item"
            @click="navigate"
            :class="isExactActive && 'active'"
          >
            <span class="middle-item__content">Bảng tin</span>
          </li>
        </router-link>
        <router-link
          :to="{
            name: 'Exercise',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <li
            class="middle-item"
            @click="navigate"
            :class="isActive && 'active'"
          >
            <span class="middle-item__content">Bài tập</span>
          </li>
        </router-link>
        <router-link
          :to="{
            name: 'Members',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <li
            class="middle-item"
            @click="navigate"
            :class="isActive && 'active'"
          >
            <span class="middle-item__content">Thành viên</span>
          </li>
        </router-link>
        <router-link
          :to="{
            name: 'Groups',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, isActive }"
        >
          <li
            class="middle-item"
            @click="navigate"
            :class="isActive && 'active'"
          >
            <span class="middle-item__content">Nhóm</span>
          </li>
        </router-link>
      </ul>

      <ul class="nav-menu" v-if="this.$store.state.USER.isLogin">
        <li class="menu-item">
          <!-- Đăng nhập mới hiện -->
          <span
            class="material-icons"
            @click="
              isActiveAddClass = !isActiveAddClass;
              isActiveNotify = false;
              isActiveUser = false;
            "
            >add</span
          >
          <ul class="menu-list" :class="{ active: isActiveAddClass }">
            <li class="list-item">Tham gia lớp học</li>
            <li class="list-item">Tạo lớp học</li>
            <li class="list-item">Tạo môn học</li>
            <li
              class="list-item"
              v-if="$store.state.USER.dataUser.role == 'admin'"
              @click="$router.push({ name: 'CreateStudent' })"
            >
              Tạo tài khoản
            </li>
          </ul>
        </li>
        <li class="menu-item">
          <!-- Đăng nhập mới hiện -->
          <!-- switch notifications_active khi có thông báo -->
          <span
            class="material-icons"
            @click="
              isActiveNotify = !isActiveNotify;
              isActiveAddClass = false;
              isActiveUser = false;
            "
            >notifications</span
          >
          <ul class="menu-list" :class="{ active: isActiveNotify }">
            <li class="list-item">Chức năng đang xây dựng</li>
          </ul>
        </li>
        <li class="menu-item">
          <!-- Đăng nhập mới hiện -->
          <!-- switch user_active khi có thông báo -->
          <span
            class="material-icons"
            @click="
              isActiveUser = !isActiveUser;
              isActiveAddClass = false;
              isActiveNotify = false;
            "
            >account_circle</span
          >
          <ul class="menu-list" :class="{ active: isActiveUser }">
            <li class="list-item">Thông tin tài khoản</li>
            <li class="list-item" @click="logout()">Đăng xuất</li>
          </ul>
        </li>
        <!-- <li class="menu-item btn btn-primary btn-login">
          <span class="menu-content">Đăng nhập</span>
        </li> -->
      </ul>
    </nav>
  </div>
</template>

<script>
import apiStudent from "@/api/student.js";
import apiLecturer from "@/api/lecturer.js";
export default {
  data: function() {
    return {
      isActiveAddClass: false,
      isActiveNotify: false,
      isActiveUser: false,
      formCreateStudent: false
    };
  },
  methods: {
    async logout() {
      if (!this.$store.state.USER.dataUser.role) {
        await apiStudent
          .logout(localStorage.getItem("token_user"))
          .then(res => {
            if (res.data.status) {
              this.$store.commit("setStateLogin", false);
              this.$store.commit("setDataUser", {
                id: null,
                email: null,
                mssv: null,
                role: null,
                isActive: null,
                first_name: null,
                last_name: null,
                sex: null,
                birthday: null,
                phone_number: null,
                address: null,
                create_by: null
              });
              this.isActiveUser = false;
              localStorage.removeItem("token_user");
              this.$router.push("/dang-nhap");
            }
          })
          .catch(err => {
            if (!err.response) {
              this.$customjs.showToast({
                title: "Lỗi kết nối",
                message: "Không thể gửi yêu cầu đến máy chủ",
                type: 1,
                time: 3000
              });
            }
          });
      } else {
        await apiLecturer
          .logout(localStorage.getItem("token_user"))
          .then(res => {
            if (res.data.status) {
              this.$store.commit("setStateLogin", false);
              this.$store.commit("setDataUser", {
                id: null,
                email: null,
                mssv: null,
                role: null,
                isActive: null,
                first_name: null,
                last_name: null,
                sex: null,
                birthday: null,
                phone_number: null,
                address: null,
                create_by: null
              });
              this.isActiveUser = false;
              localStorage.removeItem("token_user");
              this.$router.push("/dang-nhap");
            }
          })
          .catch(err => {
            if (!err.response) {
              this.$customjs.showToast({
                title: "Lỗi kết nối",
                message: "Không thể gửi yêu cầu đến máy chủ",
                type: 1,
                time: 3000
              });
            }
          });
      }
    }
  }
};
</script>

<style lang="scss">
#navbar {
  z-index: 1503;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .navbar {
    height: var(--height-navbar);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    box-shadow: 0px 2px 3px rgba(#1f1f1f, 0.2);

    .nav-icon {
      cursor: pointer;
      height: 100%;
      img {
        padding: 12px 0;
        object-fit: cover;
        object-position: center;
        // width: 100%;
        height: 100%;
      }
    }

    .nav-middle {
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      .middle-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0px 25px;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        user-select: none;
        transition: linear 0.3s;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 4px;
          border-radius: 20px 20px 0 0;
          background-color: var(--color-primary);
          opacity: 0;
          transition: opacity linear 0.3s;
        }
        &.active {
          &::before {
            opacity: 1;
          }
          .middle-item__content {
            color: var(--color-primary);
          }
          &:hover {
            background-color: rgba(#1266f1, 0.1);
          }
        }
        &:hover {
          background-color: rgba(#585858, 0.1);
        }
        &:active {
          background-color: rgba(#585858, 0.3);
        }

        .middle-item__content {
          font-size: 14px;
          color: #707070;
          font-weight: 700;
        }
      }
    }

    .nav-menu {
      list-style: none;
      display: flex;
      height: 100%;
      align-items: center;
      vertical-align: center;
      .menu-item {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 3px;
        height: 100%;
        position: relative;
        &.btn-login {
          height: unset;
          border-radius: 3px;
          padding: 8px 1.1rem 7px;
          font-size: 18px;
          color: #fff;
          .menu-content {
            font-size: 20px;
          }
        }

        .material-icons {
          font-size: 32px;
          padding: 6px;
          transition: linear 0.2s;

          &:hover {
            background-color: rgba(#969696, 0.2);
            border-radius: 50%;
          }
          &:active {
            background-color: rgba(#969696, 0.4);
            border-radius: 50%;
          }
        }
        .menu-content {
          font-size: 22px;
          font-family: var(--font-kanit);
          margin: 0px 5px;
          font-weight: 400;
        }

        .menu-list {
          position: absolute;
          z-index: 1503;
          right: 0;
          bottom: 0;
          list-style: none;
          background-color: #fff;
          width: max-content;
          padding: 10px 0px;
          border-radius: 5px;
          box-shadow: 0px 3px 4px rgba(#000, 0.3);
          opacity: 0;
          visibility: hidden;
          transform: translateY(120%);
          transition: linear 0.25s;
          &.active {
            transform: translateY(90%);
            opacity: 1;
            visibility: unset;
          }

          .list-item {
            padding: 10px 35px 10px 15px;
            transition: linear 0.2s;

            &:hover {
              background-color: rgba(#969696, 0.2);
            }
            &:active {
              background-color: rgba(#969696, 0.4);
            }
          }
        }
      }
    }
  }
}
</style>
