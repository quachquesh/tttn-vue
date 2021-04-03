<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12">
        <form @submit.prevent="createUser()" class="form-body">
          <div class="form-group">
            <input
              type="text"
              required
              @input="inputCheck($event)"
              v-model="dataStudent.mssv"
            />
            <label>
              MSSV
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="password"
              @input="inputCheck($event)"
              v-model="dataStudent.password"
            />
            <label>
              Mật khẩu
            </label>
          </div>
          <div class="form-group">
            <input
              type="text"
              required
              @input="inputCheck($event)"
              v-model="dataStudent.first_name"
            />
            <label>
              Họ và tên lót
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="text"
              required
              @input="inputCheck($event)"
              v-model="dataStudent.last_name"
            />
            <label>
              Tên
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="text"
              @input="inputCheck($event)"
              v-model="dataStudent.phone_number"
            />
            <label>
              Số điện thoại
            </label>
          </div>
          <div class="form-group">
            <input
              type="text"
              required
              @input="inputCheck($event)"
              v-model="dataStudent.address"
            />
            <label>
              Địa chỉ
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="email"
              @input="inputCheck($event)"
              v-model="dataStudent.email"
            />
            <label>
              Email
            </label>
          </div>
          <div class="group-row" style="margin-top: 20px">
            <label class="title">
              Giới tính
              <span class="required">*</span>
            </label>
            <el-radio-group
              v-model="dataStudent.sex"
              size="medium"
              style="user-select: none;"
            >
              <el-radio-button label="0">Nam</el-radio-button>
              <el-radio-button label="1">Nữ</el-radio-button>
            </el-radio-group>
          </div>
          <div class="group-row block">
            <label class="title">
              Ngày sinh
              <span class="required">*</span>
            </label>
            <!-- <input type="date" required v-model="dataStudent.birthday"/> -->
            <el-date-picker
              v-model="dataStudent.birthday"
              type="date"
              placeholder="Chọn ngày sinh"
            >
            </el-date-picker>
          </div>
          <div class="form-btn-group">
            <button
              class="btn btn-success"
              @click="$customjs.clickBtnAnimation($event)"
            >
              Thêm sinh viên
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiStudent from "@/api/student.js";
export default {
  data() {
    return {
      dataStudent: {
        mssv: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        email: "",
        sex: 0,
        birthday: ""
      }
    };
  },
  methods: {
    inputCheck(event) {
      if (event.target.value != "") {
        event.target.classList.add("valid");
      } else {
        event.target.classList.remove("valid");
      }
    },
    async createUser() {
      if (this.dataStudent.address === "") {
        this.$delete(this.dataStudent, "address");
      }
      if (this.dataStudent.email === "") {
        this.$delete(this.dataStudent, "email");
      }
      if (this.dataStudent.phone_number === "") {
        this.$delete(this.dataStudent, "phone_number");
      }
      if (this.dataStudent.password === "") {
        this.$delete(this.dataStudent, "password");
      }
      apiStudent
        .register(localStorage.getItem("token_user"), this.dataStudent)
        .then(res => {
          if (res.data.status) {
            let timeDelay = 3000;
            if (res.data.data.password_random) {
              navigator.clipboard.writeText(res.data.data.password_random);
              res.data.message += ", mật khẩu ngẫu nhiên đã lưu clipboard";
              timeDelay = 4000;
            }
            this.$customjs.showToast({
              title: "Thành công",
              message: res.data.message,
              time: timeDelay
            });
            this.$set(this, "dataStudent", { sex: 0 });
            document.querySelectorAll("input.valid").forEach(ele => {
              ele.classList.remove("valid");
            });
          } else {
            this.$customjs.showToast({
              title: "Thất bại",
              message: res.data.message,
              type: 1,
              time: 3000
            });
          }
        })
        .catch(err => {
          if (
            err.response.status == 422 &&
            err.response.data.errors.phone_number
          ) {
            this.$customjs.showToast({
              title: "Thông tin sai",
              message: "Số điện thoại phải 10 số",
              type: 1,
              time: 3000
            });
          } else {
            this.$customjs.showToast({
              title: "Lỗi kết nối",
              message: "Không thể gửi yêu cầu đến máy chủ",
              type: 1,
              time: 3000
            });
          }
        });
    }
  },
  created() {
    if (this.$store.state.USER.dataUser.role === "admin") {
      this.$router.options.nprogress.done();
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
