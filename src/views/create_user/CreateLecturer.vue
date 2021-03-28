<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12">
        <form @submit.prevent="createUser()" class="form-body">
          <div class="form-group">
            <input
              type="email"
              required
              @input="inputCheck($event)"
              v-model="dataLecturer.email"
            />
            <label>
              Email
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="password"
              required
              @input="inputCheck($event)"
              v-model="dataLecturer.password"
            />
            <label>
              Mật khẩu
              <span class="required">*</span>
            </label>
          </div>
          <div class="form-group">
            <input
              type="text"
              required
              @input="inputCheck($event)"
              v-model="dataLecturer.first_name"
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
              v-model="dataLecturer.last_name"
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
              v-model="dataLecturer.phone_number"
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
              v-model="dataLecturer.address"
            />
            <label>
              Địa chỉ
              <span class="required">*</span>
            </label>
          </div>
          <div class="group-row" style="margin-top: 20px">
            <label class="title">
              Giới tính
              <span class="required">*</span>
            </label>
            <el-radio-group
              v-model="dataLecturer.sex"
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
              v-model="dataLecturer.birthday"
              type="date"
              placeholder="Chọn ngày sinh"
            >
            </el-date-picker>
          </div>
          <div class="group-row">
            <label class="title">
              Quyền:
              <span class="required">*</span>
            </label>
            <el-select v-model="dataLecturer.role" placeholder="Select">
              <el-option
                v-for="item in [
                  { label: 'Giảng viên', value: 'gv' },
                  { label: 'Quản trị viên', value: 'admin' }
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="form-btn-group">
            <button
              class="btn btn-success"
              @click="$customjs.clickBtnAnimation($event)"
            >
              Thêm giảng viên
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiLecturer from "@/api/lecturer.js";
export default {
  data() {
    return {
      dataLecturer: {
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        sex: 0,
        birthday: "",
        role: "gv"
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
      if (this.dataLecturer.phone_number === "") {
        this.$delete(this.dataLecturer, "phone_number");
      }
      apiLecturer
        .register(localStorage.getItem("token_user"), this.dataLecturer)
        .then(res => {
          if (res.data.status) {
            this.$customjs.showToast({
              title: "Thành công",
              message: res.data.message,
              time: 3000
            });
            this.$set(this, "dataLecturer", { sex: 0, role: "gv" });
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
    this.$router.options.nprogress.done();
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
