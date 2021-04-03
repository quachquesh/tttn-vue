<template>
  <div id="student-management">
    <div class="header">
      <div class="left">
        <span class="label">Tìm kiếm: </span>
        <div>
          <el-input
            placeholder="Nhập từ khóa tìm kiếm"
            v-model="search"
            clearable
          />
        </div>
      </div>
      <div class="right">
        <el-radio-group v-model="filterActive" size="medium">
          <el-radio-button label="0">Lọc tài khoản khóa</el-radio-button>
          <el-radio-button label="1">Lọc tài khóa không khóa</el-radio-button>
          <el-radio-button label="-1">Bỏ lọc</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <data-tables
      :data="dataTable()"
      :table-props="tableProps"
      style="width: 100%"
    >
      <!--      :pagination-props="{ pageSizes: [5, 10, 30, 50, 100] }"-->
      <el-table-column
        fixed
        prop="mssv"
        label="MSSV"
        width="120"
      ></el-table-column>

      <el-table-column
        v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label"
        :width="title.width"
        :min-width="title.minWidth"
        sortable="custom"
        :formatter="formatter"
      >
      </el-table-column>

      <el-table-column fixed="right" label="" width="170">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="openFormEdit(scope.$index, scope.row)"
            type="primary"
            size="small"
            >Sửa
          </el-button>
          <el-button
            @click.native.prevent="lockStudent(scope.$index, scope.row)"
            type="danger"
            size="small"
            v-if="scope.row.isActive == 1"
            >Khóa
          </el-button>
          <el-button
            @click.native.prevent="unlockStudent(scope.$index, scope.row)"
            type="success"
            size="small"
            v-else
            >Mở khóa
          </el-button>
        </template>
      </el-table-column>
    </data-tables>
    <el-dialog
      title="Sửa thông tin sinh viên"
      :visible.sync="formEditVisible"
      :center="true"
    >
      <form
        @submit.prevent="editUser()"
        class="form-body"
        id="form-edit"
        :lock-scroll="false"
      >
        <div class="form-group">
          <input
            type="text"
            disabled
            :class="{ valid: dataEdit.mssv }"
            v-model="dataEdit.mssv"
          />
          <label>
            MSSV
            <span class="required">*</span>
          </label>
        </div>
        <div class="form-group">
          <input
            type="password"
            :class="{ valid: dataEdit.password }"
            v-model="dataEdit.password"
          />
          <label>
            Mật khẩu mới
          </label>
        </div>
        <div class="form-group">
          <input
            type="text"
            required
            :class="{ valid: dataEdit.first_name }"
            v-model="dataEdit.first_name"
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
            :class="{ valid: dataEdit.last_name }"
            v-model="dataEdit.last_name"
          />
          <label>
            Tên
            <span class="required">*</span>
          </label>
        </div>
        <div class="form-group">
          <input
            type="text"
            :class="{ valid: dataEdit.phone_number }"
            v-model="dataEdit.phone_number"
          />
          <label>
            Số điện thoại
          </label>
        </div>
        <div class="form-group">
          <input
            type="text"
            required
            :class="{ valid: dataEdit.address }"
            v-model="dataEdit.address"
          />
          <label>
            Địa chỉ
            <span class="required">*</span>
          </label>
        </div>
        <div class="form-group">
          <input
            type="email"
            :class="{ valid: dataEdit.email }"
            v-model="dataEdit.email"
          />
          <label>
            Email
          </label>
        </div>
        <div class="group-row" style="margin-top: 20px">
          <label class="title">
            Giới tính:
            <span class="required">*</span>
          </label>
          <el-radio-group
            v-model="dataEdit.sex"
            size="medium"
            style="user-select: none;"
          >
            <el-radio-button label="0">Nam</el-radio-button>
            <el-radio-button label="1">Nữ</el-radio-button>
          </el-radio-group>
        </div>
        <div class="group-row block">
          <label class="title">
            Ngày sinh:
            <span class="required">*</span>
          </label>
          <el-date-picker
            v-model="dataEdit.birthday"
            type="date"
            placeholder="Chọn ngày sinh"
          >
          </el-date-picker>
        </div>
        <div class="form-btn-group">
          <button
            class="btn btn-danger"
            @click.prevent="formEditVisible = false"
          >
            Hủy
          </button>
          <button
            class="btn btn-success"
            style="margin-left: 15px"
            @click="$customjs.clickBtnAnimation($event)"
          >
            Sửa sinh viên
          </button>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<!--suppress JSUnresolvedFunction -->
<script>
import apiStudent from "@/api/student.js";
export default {
  data() {
    return {
      dataTables: [],
      titles: [
        {
          prop: "first_name",
          label: "Họ và tên lót",
          width: "250"
        },
        {
          prop: "last_name",
          label: "Tên",
          width: "150"
        },
        {
          prop: "sex",
          label: "Giới tính",
          width: "100"
        },
        {
          prop: "address",
          label: "Địa chỉ",
          width: "auto",
          minWidth: "500"
        },
        {
          prop: "email",
          label: "Email",
          width: "270"
        },
        {
          prop: "phone_number",
          label: "Điện thoại",
          width: "130"
        }
      ],
      tableProps: {
        border: true,
        stripe: true,
        fit: true,
        "highlight-current-row": true,
        resizable: true,
        defaultSort: {
          prop: "flow_no",
          order: "descending"
        }
      },
      search: "",
      filterActive: "-1",
      dataEdit: {
        mssv: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        email: "",
        sex: 0,
        birthday: ""
      },
      formEditVisible: false
    };
  },
  methods: {
    async editUser() {
      await apiStudent
        .editUser(
          localStorage.getItem("token_user"),
          this.dataEdit.id,
          this.dataEdit
        )
        .then(res => {
          if (res.data.status) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.dataTables.forEach((value, index) => {
              if (value.id === res.data.data.id) {
                this.$set(this.dataTables, index, res.data.data);
                return true;
              }
            });
            this.formEditVisible = false;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(() => {
          this.$message.error("Không thể gửi yêu cầu đến máy chủ");
        });
    },
    openFormEdit(row, column) {
      this.formEditVisible = true;
      for (const columnKey in column) {
        this.$set(this.dataEdit, columnKey, column[columnKey]);
      }
      this.dataEdit.password = "";
    },
    async lockStudent(row, column) {
      await apiStudent
        .lockAccount(localStorage.getItem("token_user"), column.id)
        .then(res => {
          if (res.data.status) {
            column.isActive = 0;
            this.$customjs.showToast({
              title: "Thành công",
              message: res.data.message
            });
          } else {
            this.$customjs.showToast({
              title: "Thất bại",
              message: res.data.message,
              type: 1
            });
          }
        })
        .catch(() => {
          this.$customjs.showToast({
            title: "Lỗi kết nối",
            message: "Không thể gửi yêu cầu đến máy chủ",
            type: 1
          });
        });
    },
    async unlockStudent(row, column) {
      await apiStudent
        .unlockAccount(localStorage.getItem("token_user"), column.id)
        .then(res => {
          if (res.data.status) {
            column.isActive = 1;
            this.$customjs.showToast({
              title: "Thành công",
              message: res.data.message
            });
          } else {
            this.$customjs.showToast({
              title: "Thất bại",
              message: res.data.message,
              type: 1
            });
          }
        })
        .catch(() => {
          this.$customjs.showToast({
            title: "Lỗi kết nối",
            message: "Không thể gửi yêu cầu đến máy chủ",
            type: 1
          });
        });
    },
    formatter(row, column) {
      if (column.property === "sex") {
        if (row.sex == 0) {
          return "Nam";
        } else {
          return "Nữ";
        }
      }
      return row[column.property];
    },
    dataTable() {
      let dataFilter = [];
      // Nếu không lọc tài khoản khóa/không khóa
      if (this.filterActive == -1) {
        dataFilter = this.dataTables;
      } else {
        // Nếu lọc tài khoản khóa/không khóa
        dataFilter = this.dataTables.filter(data => {
          return data.isActive == this.filterActive;
        });
      }

      // Nếu không từ khóa search
      if (!this.search) return dataFilter;
      // Nếu có từ khóa search
      return dataFilter.filter(data => {
        for (let key in data) {
          if (
            (data[key] + "").toLowerCase().indexOf(this.search.toLowerCase()) !=
            -1
          ) {
            return true;
          }
        }
        return false;
      });
    }
  },
  // async beforeCreate() {
  //   if (this.$store.state.USER.dataUser.role === "admin") {
  //     this.$router.options.nprogress.set(0.7);
  //     await apiStudent
  //       .getAllStudent(localStorage.getItem("token_user"))
  //       .then(res => {
  //         this.$set(this, "dataTables", res.data);
  //       });
  //     this.$router.options.nprogress.done();
  //   } else {
  //     // Trường hợp load lại trang
  //     this.$store.dispatch("checkLogin").then(res => {
  //       this.$router.options.nprogress.set(0.7);
  //       if (res.role === "admin") {
  //         apiStudent
  //           .getAllStudent(localStorage.getItem("token_user"))
  //           .then(res => {
  //             this.$set(this, "dataTables", res.data);
  //           });
  //       } else {
  //         this.$router.push("/");
  //       }
  //       this.$router.options.nprogress.done();
  //     });
  //   }
  // }
  async beforeCreate() {
    this.$router.options.nprogress.set(0.7);
    await apiStudent
      .getAllStudent(localStorage.getItem("token_user"))
      .then(res => {
        this.$set(this, "dataTables", res.data);
      });
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
#student-management {
  padding: 0 48px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
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
</style>
