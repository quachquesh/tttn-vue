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
      height="50vh"
      :pagination-props="{ pageSizes: [5, 10, 30, 50, 100] }"
    >
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
            :loading="false"
            >Sửa
          </el-button>
          <el-button
            @click.native.prevent="lockStudent(scope.$index, scope.row)"
            type="danger"
            size="small"
            v-if="scope.row.isActive"
            >Khóa
          </el-button>
          <el-button
            @click.native.prevent="unlockStudent(scope.$index, scope.row)"
            type="success"
            size="small"
            v-if="!scope.row.isActive"
            >Mở khóa
          </el-button>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

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
          width: "200"
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
      filterActive: "-1"
    };
  },
  methods: {
    openFormEdit(row, column) {
      console.log("open form", row, column);
    },
    async lockStudent(event, row, column) {
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
    async unlockStudent(event, row, column) {
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
        if (row.sex === 0) {
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
</style>
