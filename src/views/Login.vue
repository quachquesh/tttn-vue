<template>
  <div id="login">
    <transition name="slide-down" mode="out-in" appear>
      <div class="login-box">
        <!-- GV -->
        <div class="form-gv-box">
          <form
            class="form-box"
            @submit.prevent="loginGV($event)"
            :key="'form-GV'"
          >
            <div class="form-block">
              <h3 class="form-title">Giảng viên</h3>
              <div class="form-group">
                <input
                  type="email"
                  v-model="formGV.email"
                  @input="eventInput($event)"
                />
                <label>Email</label>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="formGV.password"
                  @input="eventInput($event)"
                />
                <label>Mật khẩu</label>
              </div>
              <div class="form-group mb-15">
                <span class="error-msg">{{ formGV.msgError }}</span>
              </div>
              <div class="btn-group">
                <button
                  @click="$customjs.clickBtnAnimation($event)"
                  class="btn btn-success"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- Sinh viên -->
        <div class="form-sv-box">
          <form
            class="form-box SV"
            @submit.prevent="loginSV()"
            :key="'form-SV'"
          >
            <div class="form-block">
              <h3 class="form-title">Sinh viên</h3>
              <div class="form-group">
                <input
                  type="text"
                  v-model="formSV.mssv"
                  @input="eventInput($event)"
                />
                <label>MSSV</label>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="formSV.password"
                  @input="eventInput($event)"
                />
                <label>Mật khẩu</label>
              </div>
              <div class="form-group mb-15">
                <span class="error-msg">{{ formSV.msgError }}</span>
              </div>
              <div class="btn-group">
                <button
                  @click="$customjs.clickBtnAnimation($event)"
                  class="btn btn-primary"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import apiStudent from "@/api/student.js";
import apiLecturer from "@/api/lecturer.js";
export default {
  data: function() {
    return {
      formGV: {
        email: "",
        password: "",
        msgError: ""
      },
      formSV: {
        mssv: "",
        password: "",
        msgError: ""
      }
    };
  },
  methods: {
    async loginGV() {
      await apiLecturer
        .login(this.formGV.email, this.formGV.password)
        .then(res => {
          if (res.data.status) {
            localStorage.setItem("token_user", res.data.data.token);
            this.$store.commit("setDataUser", res.data.data);
            this.$store.commit("setStateLogin", true);
            this.$router.push("/");
          } else {
            this.formGV.msgError = res.data.message;
          }
        })
        .catch(err => {
          if (!err.response) this.formGV.msgError = "Lỗi kết nối đến máy chủ";
        });
    },
    async loginSV() {
      await apiStudent
        .login(this.formSV.mssv, this.formSV.password)
        .then(res => {
          if (res.data.status) {
            localStorage.setItem("token_user", res.data.data.token);
            this.$store.commit("setDataUser", res.data.data);
            this.$store.commit("setStateLogin", true);
            this.$router.push("/");
          } else {
            this.formSV.msgError = res.data.message;
          }
        })
        .catch(err => {
          if (!err.response) this.formSV.msgError = "Lỗi kết nối đến máy chủ";
        });
    },
    eventInput(event) {
      this.formSV.msgError = "";
      this.formGV.msgError = "";
      if (event.target.value != "") {
        event.target.parentElement.classList.add("active");
      } else {
        event.target.parentElement.classList.remove("active");
      }
    }
  },
  created() {
    if (this.$store.getters.getIsLogin) this.$router.push("/");
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.login-box {
  display: flex;
  justify-content: space-around;
  padding: 0 10% 0;
  flex-wrap: wrap;
  .form-gv-box,
  .form-sv-box {
    padding: 50px 50px;
  }
}
.form-box {
  display: flex;
  width: 100%;
  justify-content: center;
  .form-block {
    // max-width: 400px;
  }
}

.btn-group {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;

  .btn-primary,
  .btn-success {
    font-weight: 600;
  }

  .btn-link {
    font-size: 16px;
    text-transform: unset;
  }
}

//@media (min-width: 740px) {
//}

@media (max-width: 739px) {
  #login {
    margin: 0 20px;
    .form-box {
      width: 100%;
      .form-block {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 30px;

        .form-group {
          width: 100%;
          &.active {
            label {
              font-size: 12px;
            }
          }

          input {
            width: 100%;
            font-size: 16px;

            &:focus ~ label {
              font-size: 12px;
            }
          }
          label {
            font-size: 16px;
          }
        }
        .btn-group {
          display: flex;
          flex-direction: column-reverse;

          .btn {
            margin-bottom: 10px;

            &:first-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
