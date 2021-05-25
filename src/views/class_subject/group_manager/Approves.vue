<template>
  <div class="group-approves row">
    <div class="col c-10 c-o-1">
      <div class="header">
        <div class="left">
          <span class="label">Tìm kiếm: </span>
          <div>
            <el-input
              placeholder="Nhập từ khóa tìm kiếm"
              v-model="keySearch"
              clearable
            />
          </div>
        </div>
        <div class="right"></div>
      </div>
      <data-tables
        :data="dataTable()"
        :table-props="tableProps"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="mssv"
          label="MSSV"
          width="120"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="student_name"
          label="Tên SV"
          width="auto"
          min-width="210"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="Loại"
          width="auto"
          min-width="200"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            formatType(scope.row.type)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="Lý do"
          width="auto"
          min-width="200"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          width="auto"
          min-width="200"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          label="Thời gian"
          width="150"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="" width="190">
          <!--        gv: xoa, sua, add member-->
          <!--        sv: tham gia/ hủy-->
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="openFormEdit(scope.$index, scope.row)"
              type="primary"
              size="small"
              >Duyệt
            </el-button>
            <el-button
              @click.native.prevent="
                openFormCreateClass(scope.$index, scope.row)
              "
              type="success"
              size="small"
              >Hủy
            </el-button>
          </template>
        </el-table-column>
      </data-tables>
      <div style="margin-top: 20px; display: flex; justify-content: flex-end">
        <el-button type="primary">Duyệt đã chọn</el-button>
        <el-button type="danger">Hủy đã chọn</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keySearch: "",
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
      fakeData: [
        {
          id: 0,
          type: 0,
          mssv: "DH51704395",
          student_name: "Nguyễn Quốc Trung",
          content: `bla bla bla bla`,
          description: "Nhóm 1 -> nhóm 3",
          created_at: "2021-5-4"
        },
        {
          id: 1,
          type: 1,
          mssv: "DH51704395",
          student_name: "Nguyễn Quốc Trung",
          content: `bla bla bla bla`,
          description: "Nhóm 1 -> nhóm 3",
          created_at: "2021-5-4"
        },
        {
          id: 2,
          type: 2,
          mssv: "DH51704395",
          student_name: "Nguyễn Quốc Trung",
          content: `bla bla bla bla`,
          description: "Nhóm 1 -> nhóm 3",
          created_at: "2021-5-4"
        }
      ],
      multipleSelection: []
    };
  },
  methods: {
    dataTable() {
      return this.fakeData;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return `${day}-${month}-${year}`;
    },
    formatType(type) {
      switch (type) {
        case 0:
          return "Chuyển nhóm";
        case 1:
          return "Kick thành viên";
        case 2:
          return "bla bla";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.table-link {
  color: #3327f1;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .right,
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
    justify-content: flex-end;
  }
}
</style>
