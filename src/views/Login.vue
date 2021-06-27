<template>
  <div id="login">
    <transition name="slide-down" mode="out-in" appear>
      <div class="login-box">
        <!-- GV -->
        <div class="form-gv-box">
          <form
            class="form-box"
            @submit.prevent="login($event)"
            :key="'form-GV'"
          >
            <div class="form-block">
              <h3 class="form-title">Đăng nhập</h3>
              <div class="form-group">
                <input
                  type="text"
                  v-model="dataLogin.username"
                  @input="eventInput($event)"
                />
                <label>Tên đăng nhập</label>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  v-model="dataLogin.password"
                  @input="eventInput($event)"
                />
                <label>Mật khẩu</label>
              </div>
              <div class="form-group mb-15">
                <span class="error-msg">{{ dataLogin.msgError }}</span>
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
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      dataLogin: {
        username: "",
        password: "",
        msgError: ""
      }
    };
  },
  methods: {
    login() {
      if (this.dataLogin.username == "") {
        this.dataLogin.msgError = "Vui lòng nhập tên đăng nhập";
      } else if (this.dataLogin.password == "") {
        this.dataLogin.msgError = "Vui lòng nhập mật khẩu";
      } else {
        this.$store
          .dispatch("login", {
            username: this.dataLogin.username,
            password: this.dataLogin.password
          })
          .then(res => {
            if (res.status) {
              this.$router.push("/");
            } else {
              this.dataLogin.msgError = res.message;
            }
          })
          .catch(() => {
            this.dataLogin.msgError = "Lỗi kết nối đến máy chủ";
          });
      }
    },
    eventInput(event) {
      this.dataLogin.msgError = "";
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
  justify-content: center;
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
    width: 100%;
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
  .login-box {
    .form-gv-box,
    .form-sv-box {
      padding: 50px 10px;
    }
  }
}
</style>
