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
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          label="MSSV"
          width="120"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.author.mssv }}</template>
        </el-table-column>
        <el-table-column
          label="Tên SV"
          width="auto"
          min-width="210"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            scope.row.author.first_name + " " + scope.row.author.last_name
          }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Loại"
          width="auto"
          min-width="200"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            formatType(scope.row.ticket_type)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="Lý do"
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
              @click.native.prevent="updateTicket(scope.row, 1)"
              type="primary"
              size="small"
              >Duyệt
            </el-button>
            <el-button
              @click.native.prevent="updateTicket(scope.row, 2)"
              type="danger"
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
import apiGroup from "@/api/group";
export default {
  props: {
    roomId: {
      required: true
    },
    isJoinGroup: {
      required: true
    },
    myGroup: {
      required: true
    }
  },
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
      dataApproves: [],
      multipleSelection: []
    };
  },
  methods: {
    dataTable() {
      return this.dataApproves;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatTime(time) {
      let date = new Date(time);
      let minutes = date.getMinutes();
      let hours = date.getHours();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return `${hours}:${minutes} ${day}-${month}-${year}`;
    },
    formatType(type) {
      switch (type) {
        case 0:
          return "Xin vào nhóm";
        case 1:
          return "Xin chuyển nhóm";
        case 2:
          return "Kick khỏi nhóm";
      }
    },
    updateTicket(ticket, status) {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiGroup
          .updateTicket(token, this.roomId, ticket.id, { status: status })
          .then(res => {
            if (res.data.status) {
              this.$customjs.showToast({
                title: "Xử lý yêu cầu",
                message: res.data.message
              });
              this.dataApproves.forEach((item, index) => {
                if (item.id == ticket.id) {
                  this.$delete(this.dataApproves, index);
                  return true;
                }
              });
            } else {
              this.$customjs.showToast({
                title: "Xử lý yêu cầu",
                message: res.data.message,
                type: 1
              });
            }
          })
          .catch(() => {
            this.$message.error("Lỗi kết nối");
          });
      }
    },
    updateTicketSelects() {}
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      await apiGroup.getTickets(token, this.roomId).then(res => {
        this.dataApproves = res.data;
      });
    }
    this.$router.options.nprogress.done();
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
