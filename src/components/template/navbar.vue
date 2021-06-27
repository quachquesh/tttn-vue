<!--suppress HtmlUnknownTarget -->
<template>
  <div id="navbar">
    <nav class="navbar">
      <!-- LEFT -->
      <router-link to="/" custom v-slot="{ navigate }">
        <div class="nav-icon" @click="navigate">
          <img src="/assets/img/Logo_STU_2.png" alt="logo" />
        </div>
      </router-link>
      <!-- MID -->
      <ul
        class="nav-middle l-flex l-auto m-0 c-0"
        v-if="$store.state.NAVBAR.isClassSubject"
      >
        <router-link
          :to="{
            name: 'ClassSubject',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Bảng tin</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Question',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Thảo luận</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Exercise',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Bài tập</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Members',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Thành viên</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Group',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Nhóm</span>
            </li>
          </a>
        </router-link>
      </ul>
      <ul
        class="nav-middle l-flex l-auto m-0 c-0"
        v-if="$store.state.NAVBAR.isSubject"
      >
        <router-link
          :to="{ name: 'Home' }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Trang chủ</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'TicketManager' }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Quản lý yêu cầu</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'SubjectManager' }"
          custom
          v-slot="{ navigate, href, isActive }"
          v-if="$store.getters.getUserRole"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Quản lý môn học</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'ClassSubjectManager' }"
          custom
          v-slot="{ navigate, href, isActive }"
          v-if="$store.getters.getUserRole"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Quản lý lớp môn học</span>
            </li>
          </a>
        </router-link>
      </ul>
      <!-- RIGHT -->
      <ul
        class="nav-menu"
        :class="{ active: isActiveNavbarMobile }"
        v-if="this.$store.state.USER.isLogin"
      >
        <li class="menu-item menu-btn-close">
          <!-- Đăng nhập mới hiện -->
          <span class="material-icons" @click="isActiveNavbarMobile = false"
            >close</span
          >
        </li>
        <li
          class="menu-item"
          :class="{ active: isActiveAddClass }"
          @click="isActiveAddClass = !isActiveAddClass"
          @clickout="isActiveAddClass = false"
        >
          <!-- Đăng nhập mới hiện -->
          <span class="menu-btn">
            <span class="material-icons">add</span>
            <span class="btn-content">Tạo mới</span>
          </span>
          <transition
            name="height"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            appear
          >
            <ul class="menu-list active" v-show="isActiveAddClass">
              <li class="list-item">Tham gia lớp học</li>
              <li
                class="list-item"
                @click="
                  formCreateSubject = true;
                  formCreateClass = false;
                "
                v-if="$store.state.USER.dataUser.role == 'admin'"
              >
                Tạo môn học
              </li>
              <li
                class="list-item"
                @click="openFormCreateClass()"
                v-if="$store.state.USER.dataUser.role"
              >
                Tạo lớp học
              </li>
              <router-link
                :to="{ name: 'CreateStudent' }"
                custom
                v-slot="{ navigate, href }"
              >
                <a :href="href" @click="navigate">
                  <li
                    class="list-item"
                    v-if="$store.state.USER.dataUser.role == 'admin'"
                  >
                    Quản lý tài khoản
                  </li>
                </a>
              </router-link>
            </ul>
          </transition>
        </li>
        <li
          class="menu-item"
          :class="{ active: isActiveNotify }"
          @click="isActiveNotify = !isActiveNotify"
          @clickout="isActiveNotify = false"
        >
          <!-- Đăng nhập mới hiện -->
          <!-- switch notifications_active khi có thông báo -->
          <span class="menu-btn">
            <span class="material-icons">notifications</span>
            <span class="btn-content">Thông báo</span>
          </span>
          <transition
            name="height"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            appear
          >
            <ul class="menu-list active" v-show="isActiveNotify">
              <li class="list-item">Chức năng đang xây dựng</li>
            </ul>
          </transition>
        </li>
        <!--        <li class="menu-item">-->
        <!--          &lt;!&ndash; Đăng nhập mới hiện &ndash;&gt;-->
        <!--          &lt;!&ndash; switch user_active khi có thông báo &ndash;&gt;-->
        <!--          <span-->
        <!--            class="material-icons"-->
        <!--            @click="isActiveUser = !isActiveUser"-->
        <!--            @clickout="isActiveUser = false"-->
        <!--            >account_circle</span-->
        <!--          >-->
        <!--          <ul-->
        <!--            class="menu-list"-->
        <!--            :class="{ active: isActiveUser }"-->
        <!--            @click="isActiveUser = false"-->
        <!--          >-->
        <!--            <li class="list-item">Thông tin tài khoản</li>-->
        <!--            <li class="list-item" @click="logout()">Đăng xuất</li>-->
        <!--          </ul>-->
        <!--        </li>-->
        <li
          class="menu-item"
          :class="{ active: isActiveUser }"
          @click="isActiveUser = !isActiveUser"
          @clickout="isActiveUser = false"
        >
          <span class="menu-user-info">
            <span
              class="menu-content"
              style="margin: 0 0 3px; font-size: 16px;"
            >
              {{
                $store.state.USER.dataUser.first_name +
                  " " +
                  $store.state.USER.dataUser.last_name
              }}
            </span>
            <span style="font-size: 12px; color: #555555;">
              {{
                $store.state.USER.dataUser.role == "gv"
                  ? "Giảng viên"
                  : $store.state.USER.dataUser.role == "admin"
                  ? "Quản trị viên"
                  : "Sinh viên"
              }}
            </span>
          </span>
          <transition
            name="height"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            appear
          >
            <ul class="menu-list active" v-show="isActiveUser">
              <li class="list-item">Thông tin tài khoản</li>
              <li class="list-item" @click="logout()">Đăng xuất</li>
            </ul>
          </transition>
        </li>
        <!-- <li class="menu-item btn btn-primary btn-login">
          <span class="menu-content">Đăng nhập</span>
        </li> -->
      </ul>

      <div class="overlay" @click="isActiveNavbarMobile = false"></div>
      <div
        class="btn-menu-mobile material-icons"
        @click="isActiveNavbarMobile = true"
      >
        menu
      </div>
    </nav>

    <nav
      class="navbar-extra"
      :class="{ 'navbar-extra-m': $store.getters.getUserRole }"
      v-if="$store.state.NAVBAR.isClassSubject || $store.state.NAVBAR.isSubject"
    >
      <ul
        class="nav-middle l-0 c-flex"
        v-if="$store.state.NAVBAR.isClassSubject"
      >
        <router-link
          :to="{
            name: 'ClassSubject',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Bảng tin</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Question',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Thảo luận</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Exercise',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Bài tập</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Members',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Thành viên</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{
            name: 'Group',
            params: { roomId: this.$route.params.roomId }
          }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Nhóm</span>
            </li>
          </a>
        </router-link>
      </ul>
      <ul class="nav-middle l-0 c-flex" v-if="$store.state.NAVBAR.isSubject">
        <router-link
          :to="{ name: 'Home' }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Trang chủ</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'TicketManager' }"
          custom
          v-slot="{ navigate, href, isExactActive }"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isExactActive && 'active'">
              <span class="middle-item__content">Quản lý yêu cầu</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'SubjectManager' }"
          custom
          v-slot="{ navigate, href, isActive }"
          v-if="$store.getters.getUserRole"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Quản lý môn học</span>
            </li>
          </a>
        </router-link>
        <router-link
          :to="{ name: 'ClassSubjectManager' }"
          custom
          v-slot="{ navigate, href, isActive }"
          v-if="$store.getters.getUserRole"
        >
          <a :href="href" @click="navigate">
            <li class="middle-item" :class="isActive && 'active'">
              <span class="middle-item__content">Quản lý lớp môn học</span>
            </li>
          </a>
        </router-link>
      </ul>
    </nav>
    <!--Form Subject New-->
    <transition name="fade">
      <div class="form-box" v-if="formCreateSubject && !formCreateClass">
        <div class="overlay" @click="formCreateSubject = false"></div>
        <form
          @submit.prevent="createSubject()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Tạo môn học mới</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataSubject.name }"
                v-model="dataSubject.name"
              />
              <label>
                Tên
                <span class="required">*</span>
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataSubject.description }"
                v-model="dataSubject.description"
              />
              <label>
                Mô tả
              </label>
            </div>
            <div class="group-row block">
              <label class="title">
                Chủ đề:
                <span class="required">*</span>
              </label>
              <el-select v-model="dataSubject.img" placeholder="Select">
                <el-option
                  v-for="(theme, index) in dataTheme"
                  :key="index"
                  :label="theme.name"
                  :value="theme.link"
                >
                </el-option>
              </el-select>
            </div>
            <div class="group-row block">
              <label class="title">
                Học kỳ:
                <span class="required">*</span>
              </label>
              <el-select v-model="dataSubject.semester" placeholder="Select">
                <el-option label="Học kỳ 1" value="1"></el-option>
                <el-option label="Học kỳ 2" value="2"></el-option>
                <el-option label="Học kỳ 3" value="3"></el-option>
              </el-select>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formCreateSubject = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Tạo môn học
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
    <!--Form Class New-->
    <transition name="fade">
      <div class="form-box" v-if="formCreateClass && !formCreateSubject">
        <div class="overlay" @click="formCreateClass = false"></div>
        <form
          @submit.prevent="createClass()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Tạo lớp học mới</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataClass.name }"
                v-model="dataClass.name"
              />
              <label>
                Tên
                <span class="required">*</span>
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataClass.description }"
                v-model="dataClass.description"
              />
              <label>
                Mô tả
              </label>
            </div>
            <div class="group-row block">
              <label class="title">
                Chủ đề:
                <span class="required">*</span>
              </label>
              <el-select v-model="dataClass.img" placeholder="Chọn chủ đề">
                <el-option
                  v-for="(theme, index) in dataTheme"
                  :key="index"
                  :label="theme.name"
                  :value="theme.link"
                >
                </el-option>
              </el-select>
            </div>
            <div class="group-row block">
              <label class="title">
                Môn học:
                <span class="required">*</span>
              </label>
              <el-select
                v-model="dataClass.subject_id"
                filterable
                placeholder="Chọn lớp học"
              >
                <el-option
                  v-for="(subject, index) in dataSubjectAll"
                  :key="index"
                  :label="subject.name"
                  :value="subject.id"
                >
                  <span style="float: left; margin-right: 10px;">{{
                    subject.name
                  }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    subject.description
                  }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="group-row block">
              <label class="title">
                Học kỳ:
              </label>
              <el-input
                placeholder=""
                :value="dataClass.semester"
                :disabled="true"
                style="width: auto; display: inline-block;"
              >
              </el-input>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formCreateClass = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Tạo lớp học
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      isActiveAddClass: false,
      isActiveNotify: false,
      isActiveUser: false,
      isActiveNavbarMobile: false,
      formCreateSubject: false,
      formCreateClass: false,
      dataSubjectAll: [],
      dataSubject: {
        name: "",
        description: "",
        img: "/assets/img/code.jpg",
        semester: "1"
      },
      dataClass: {
        name: "",
        description: "",
        img: "/assets/img/code.jpg",
        subject_id: "",
        semester: "Học kỳ 1"
      },
      dataTheme: [
        {
          name: "Code",
          link: "/assets/img/code.jpg"
        },
        {
          name: "Graduation",
          link: "/assets/img/graduation.jpg"
        },
        {
          name: "Learn Language",
          link: "/assets/img/learnlanguage.jpg"
        },
        {
          name: "Writing",
          link: "/assets/img/Writing.jpg"
        }
      ]
    };
  },
  methods: {
    createSubject() {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$store
          .dispatch("apiCreateSubject", [token, this.dataSubject])
          .then(res => {
            if (res.data.status) {
              this.$message.success(res.data.message);
              this.$set(this.dataSubject, "name", "");
              this.$set(this.dataSubject, "description", "");
              if (this.dataSubjectAll.length > 0) {
                this.dataSubjectAll.push(res.data.data);
              }
              res.data.data["number_of_class"] = 0;
              this.$store.commit("addDataAllSubject", res.data.data);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            if (err.response.status == 422 && err.response.data.errors.name) {
              this.$message.error("Chưa nhập tên môn học");
            } else {
              this.$message.error("Không thể gửi yêu cầu đến máy chủ");
            }
          });
      }
    },
    openFormCreateClass() {
      if (this.dataSubjectAll.length < 1) {
        this.$store
          .dispatch("apiGetSubjects", localStorage.getItem("token_user"))
          .then(res => {
            this.$set(this, "dataSubjectAll", res.data);
          })
          .catch(() => {
            this.$message.error("Lấy thông tin môn học thất bại");
          });
      }
      this.formCreateClass = true;
      this.formCreateSubject = false;
    },
    createClass() {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$store
          .dispatch("apiCreateClassSubject", [token, this.dataClass])
          .then(res => {
            if (res.data.status) {
              this.$message.success(res.data.message);
              if (
                this.$store.getters.getSubjectCurrentId ==
                this.dataClass.subject_id
              ) {
                this.dataSubjectAll.forEach(subject => {
                  if (subject.id == res.data.data.subject_id) {
                    this.$set(res.data.data, "subject_name", subject.name);
                    this.$set(
                      res.data.data,
                      "subject_description",
                      subject.description
                    );
                    this.$store.commit("addClassSubject", res.data.data);
                    return true;
                  }
                });
              } else if (this.$store.getters.getSubjectCurrentId == null) {
                this.dataSubjectAll.forEach(subject => {
                  if (subject.id == this.dataClass.subject_id) {
                    this.$store.commit("addNewSubject", subject);
                    return true;
                  }
                });
              }
              // reset value
              this.$set(this.dataClass, "name", "");
              this.$set(this.dataClass, "description", "");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            if (err.response.status == 422 && err.response.data.errors.name) {
              this.$message.error("Chưa nhập tên lớp");
            } else if (
              err.response.status == 422 &&
              err.response.data.errors.subject_id
            ) {
              this.$message.error("Chưa chọn môn học");
            } else {
              this.$message.error("Không thể gửi yêu cầu đến máy chủ");
            }
          });
      }
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(res => {
          if (res.status) {
            this.isActiveUser = false;
            window.location.href = window.location.origin + "/dang-nhap";
          }
        })
        .catch(() => {
          this.$message.error("Lỗi kết nối");
        });
    },
    enter(element) {
      const curHeight = getComputedStyle(element).height;
      element.style.width = getComputedStyle(element).width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = curHeight;

      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    }
  },
  created() {
    let timeNow = new Date();
    let month = timeNow.getMonth() + 1;
    if (month > 8 && month < 2) {
      this.dataClass.semester = "Học kỳ 1";
    } else if (month > 1 && month < 7) {
      this.dataClass.semester = "Học kỳ 2";
    } else {
      this.dataClass.semester = "Học kỳ 3";
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
#navbar {
  z-index: 1503;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .navbar {
    position: relative;
    z-index: 1;
    height: var(--height-navbar);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 3px rgba(#1f1f1f, 0.2);

    .nav-icon {
      cursor: pointer;
      height: 100%;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
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
      -webkit-tap-highlight-color: transparent;
      a {
        text-decoration: none;
        color: #707070;
        height: 100%;
      }
      .middle-item {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 25px;
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
      & ~ .overlay {
        opacity: 0;
        visibility: hidden;
        transition: ease 0.5s;
        display: none;
      }
      .menu-item {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 3px;
        height: 100%;
        position: relative;
        -webkit-tap-highlight-color: transparent;
        transition: linear 0.3s;
        &.menu-btn-close {
          display: none;
        }
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

        .menu-btn {
          display: flex;
          align-items: center;
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
          .btn-content {
            display: none;
          }
        }

        .menu-user-info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-end;
          padding: 20px 0;
        }

        .menu-content {
          font-size: 22px;
          font-family: var(--font-kanit);
          margin: 0 5px;
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
          padding: 10px 0;
          border-radius: 5px;
          box-shadow: 0 3px 4px rgba(#000, 0.3);
          opacity: 0;
          visibility: hidden;
          transform: translateY(100%);
          transition: linear 0.25s;
          height: 0;
          &.active {
            //transform: translateY(95%);
            opacity: 1;
            visibility: unset;
          }

          a {
            text-decoration: none;
            color: #000;
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

    .btn-menu-mobile {
      display: none;
    }
  }
  .navbar-extra {
    height: calc(var(--height-navbar) - 10px);
    background-color: #fff;
    display: none;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 3px rgba(#1f1f1f, 0.2);
    width: 100%;
    overflow-x: auto;
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .nav-icon {
      cursor: pointer;
      height: 100%;
      user-select: none;
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
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      -webkit-tap-highlight-color: transparent;
      a {
        text-decoration: none;
        color: #707070;
        height: 100%;
      }
      .middle-item {
        height: 100%;
        width: max-content;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 25px;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        user-select: none;
        transition: linear 0.3s;
        //&::before {
        //  content: "";
        //  position: absolute;
        //  left: 0;
        //  bottom: 0;
        //  width: 100%;
        //  height: 4px;
        //  border-radius: 20px 20px 0 0;
        //  background-color: var(--color-primary);
        //  opacity: 0;
        //  transition: opacity linear 0.3s;
        //}
        &.active {
          //&::before {
          //  opacity: 1;
          //}
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
        transition: linear 0.3s;
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
          margin: 0 5px;
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
          padding: 10px 0;
          border-radius: 5px;
          box-shadow: 0 3px 4px rgba(#000, 0.3);
          opacity: 0;
          visibility: hidden;
          transform: translateY(100%);
          transition: linear 0.25s;
          &.active {
            //transform: translateY(90%);
            opacity: 1;
            visibility: unset;
          }

          a {
            text-decoration: none;
            color: #000;
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
.form-box {
  z-index: 1500;
  position: fixed;
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    background-color: rgba(#000, 0.2);
    -webkit-tap-highlight-color: transparent;
  }
  form {
    min-width: 400px;
    max-width: 90%;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%);
    .form-block {
      box-shadow: 7px 7px 14px rgba(#000, 0.2), -3px -3px 7px rgba(#ddd, 1);
    }
    .group-row {
      margin-top: 18px;
      .title {
        font-weight: 500;
        font-size: 16px;
        margin-right: 16px;
        .required {
          color: red;
        }
      }
    }
  }
}

@media (max-width: 1113px) {
  #navbar {
    .navbar {
      box-shadow: unset;
    }
    .navbar-extra {
      display: flex;
    }
  }
}

@media (max-width: 739px) {
  #navbar {
    .navbar {
      .nav-icon {
        img {
          padding: 16px 0;
        }
      }
      .nav-menu {
        //display: none;
        position: fixed;
        top: 0;
        right: 0;
        background: #ffffff;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        z-index: 1000;
        height: 100vh;
        box-shadow: -2px 0 3px rgba(#1f1f1f, 0.2);
        transform: translateX(110%);
        transition: ease 0.5s;
        & ~ .overlay {
          display: unset;
          background: rgba(#000, 0.2);
          position: fixed;
          width: 100vh;
          height: 100vh;
          left: 0;
          top: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.5s ease;
        }
        &.active {
          transform: translateX(0%);
          & ~ .overlay {
            opacity: 1;
            visibility: unset;
          }
        }
        .menu-item {
          height: unset;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
          padding: 10px 10px;
          width: 320px;
          transition: linear 0.3s;
          &:hover {
            .menu-btn {
              span {
                color: var(--color-primary);
                transition: linear 0.2s;
              }
            }
            .menu-user-info {
              .menu-content {
                color: var(--color-primary);
                transition: linear 0.2s;
              }
            }
          }
          &.active {
            .menu-btn {
              span {
                color: var(--color-primary);
                font-weight: 500;
                transition: linear 0.2s;
              }
            }
            .menu-user-info {
              .menu-content {
                color: var(--color-primary);
                font-weight: 500;
                transition: linear 0.2s;
              }
            }
          }
          &.menu-btn-close {
            display: flex;
            align-items: flex-end;
            margin: 6px 6px 0 0;
            cursor: unset;
            .material-icons {
              cursor: pointer;
              &:hover {
                color: red;
                transition: linear 0.2s;
              }
            }
          }
          .menu-btn {
            .material-icons {
              padding: 0;
              margin-right: 6px;
              &:hover {
                background-color: unset;
                border-radius: 0;
              }
            }
            .btn-content {
              display: unset;
            }
          }
          .menu-user-info {
            padding: 0 12px;
          }
          .menu-list {
            position: unset;
            background: transparent;
            box-shadow: unset;
            transform: unset;
            overflow: hidden;
            padding: 6px 0 0 16px;
            &.active {
              transform: unset;
            }
          }
        }
      }
      .btn-menu-mobile {
        display: unset;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: linear 0.2s;
        &:hover {
          color: var(--color-primary);
        }
      }
    }
    .navbar-extra-m {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
