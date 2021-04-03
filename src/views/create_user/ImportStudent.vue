<template>
  <div id="import-student">
    <div class="grid wide">
      <div class="row">
        <div class="col c-12">
          <div class="file-import">
            <label>File Import:</label>
            <input type="file" id="file-import" @change="importFile($event)" />
            <button class="btn btn-primary" @click="createUser($event)">
              Thêm
            </button>
          </div>
          <div class="progress-import">
            <div
              class="pbar"
              :style="{
                width: progressRatio + '%',
                backgroundColor:
                  progressRatio === 100
                    ? 'var(--color-success)'
                    : 'var(--color-primary)'
              }"
            >
              <span class="ptext">{{ progressRatio }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-list-import">
      <div class="header">
        <div class="left">
          <span class="status-details success" :class="{ 'line-through': !statusFilter.success }" @click="statusFilter.success = !statusFilter.success">Thành công</span>
          <span class="status-details fail" :class="{ 'line-through': !statusFilter.fail }" @click="statusFilter.fail = !statusFilter.fail">Thất bại, dữ liệu không hợp lệ</span>
          <span class="status-details duplicate" :class="{ 'line-through': !statusFilter.duplicate }" @click="statusFilter.duplicate = !statusFilter.duplicate">Đã tồn tại</span>
          <span class="status-details required">Cột bắt buộc phải có dữ liệu</span>
        </div>
        <div class="right">
          <label for="export-file-name">Tên file: </label>
          <input type="text" id="export-file-name" />
          <button class="btn btn-success" @click="exportFile($event)">
            Export Excel
          </button>
        </div>
      </div>
      <table id="table-user">
        <tr>
          <th>STT</th>
          <th class="mssv required">MSSV</th>
          <th class="password">Mật khẩu</th>
          <th class="first_name required">Họ và tên lót</th>
          <th class="last_name required">Tên</th>
          <th class="phone_number">Số điện thoại</th>
          <th class="address required">Địa chỉ</th>
          <th class="email">Email</th>
          <th class="sex required">Giới tính</th>
          <th class="birthday required">Ngày sinh</th>
          <th class="password_random" v-if="tableHeader['password_random']">
            Pass Rand
          </th>
        </tr>
        <tr
          v-for="(value, index) in filterDataTable()"
          :key="index"
          :class="{
            fail: value['status'] === 0,
            success: value['status'] === 1,
            duplicate: value['status'] === 2
          }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ value[tableHeader["mssv"][0]] || "" }}</td>
          <td>{{ value[tableHeader["password"][0]] || "" }}</td>
          <td>{{ value[tableHeader["first_name"][0]] || "" }}</td>
          <td>{{ value[tableHeader["last_name"][0]] || "" }}</td>
          <td>{{ value[tableHeader["phone_number"][0]] || "" }}</td>
          <td>{{ value[tableHeader["address"][0]] || "" }}</td>
          <td>{{ value[tableHeader["email"][0]] || "" }}</td>
          <td>{{ value[tableHeader["sex"][0]] || "" }}</td>
          <td>{{ value[tableHeader["birthday"][0]] || "" }}</td>
          <td v-if="tableHeader['password_random']">
            {{ value["password_random"] || "" }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import apiStudent from "@/api/student.js";
export default {
  data() {
    return {
      progressRatio: 0,
      tableHeader: {},
      dataTable: [],
      statusFilter: {
        success: true,
        fail: true,
        duplicate: true
      }
    };
  },
  methods: {
    filterDataTable() {
      if (this.dataTable[0] && this.dataTable[0].status == undefined) {
        return this.dataTable;
      }
      return this.dataTable.filter(x => {
        if (this.statusFilter.fail && x.status === 0) {
          return true;
        } else if (this.statusFilter.success && x.status === 1) {
          return true;
        } else if (this.statusFilter.duplicate && x.status === 2) {
          return true;
        }
        return false;
      });
    },
    exportFile() {
      let fileName = document.getElementById("export-file-name");
      if (fileName.value === "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập tên file export",
          type: 1,
          time: 3000
        });
      } else if (!document.querySelector("#table-user tr:nth-child(2)")) {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Không có dữ liệu",
          type: 1,
          time: 3000
        });
      } else {
        doit(fileName.value);
      }
    },
    importFile(evt) {
      this.progressRatio = 0;
      this.$set(this, "tableHeader", {
        mssv: [null, true, "mssv"],
        password: [null, false, "password", "mật khẩu"],
        first_name: [null, true, "first_name", "firstname", "họ và tên lót"],
        last_name: [null, true, "last_name", "lastname", "tên"],
        phone_number: [
          null,
          false,
          "phone_number",
          "phonenumber",
          "sdt",
          "sđt",
          "số điện thoại",
          "điện thoại"
        ],
        address: [null, true, "address", "addr", "địa chỉ"],
        email: [null, false, "email", "địa chỉ email"],
        sex: [null, true, "sex", "gt", "giới tính"],
        birthday: [null, true, "birthday", "ngày sinh"]
      });
      let file;
      let files = evt.target.files;

      if (!files || files.length === 0) return;

      file = files[0];

      let reader = new FileReader();
      reader.onload = e => {
        // pre-process data
        let binary = "";
        let bytes = new Uint8Array(e.target.result);
        let length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        /* read workbook */
        let wb = XLSX.read(binary, {
          type: "binary",
          cellDates: true,
          dateNF: "yyyy-mm-dd"
        });

        /* grab first sheet */
        let wsname = wb.SheetNames[0];
        let ws = wb.Sheets[wsname];

        /* Data json */
        let json = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: false,
          dateNF: "yyyy-mm-dd"
        });
        // var json = XLSX.utils.sheet_to_json(ws);
        let jsonHeader = json.shift();

        for (let key in this.tableHeader) {
          jsonHeader.forEach((value, index) => {
            this.tableHeader[key].forEach(tblValue => {
              if (value.toLowerCase() === (tblValue + "").toLowerCase()) {
                this.tableHeader[key][0] = index;
              }
            });
          });
        }

        let flag_check = false;
        for (let key in this.tableHeader) {
          if (
            this.tableHeader[key][0] === null &&
            this.tableHeader[key][1] === true
          ) {
            document
              .querySelector("table tr th." + key)
              .classList.add("danger");
            flag_check = true;
          } else {
            document
              .querySelector("table tr th." + key)
              .classList.remove("danger");
          }
        }
        if (flag_check === true) {
          this.$customjs.showToast({
            title: "Thiếu dữ liệu",
            message: "Vui lòng check đủ các cột dữ liệu",
            type: 1,
            time: 4000
          });
          this.$set(this, "dataTable", {});
        } else {
          this.$set(this, "dataTable", json);
        }
      };

      reader.readAsArrayBuffer(file);
    },
    async createUser(event) {
      if (!document.getElementById("file-import").value) {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa chọn file, không có dữ liệu!!",
          type: 1,
          time: 3000
        });
      } else {
        this.$customjs.clickBtnAnimation(event);
        let total = this.dataTable.length;
        let currentTotal = 0;
        let token_user = localStorage.getItem("token_user");
        await apiStudent
          .createListStudent(token_user, this.tableHeader, this.dataTable)
          .then(res => {
            this.$set(this, "dataTable", res.data.dataTable);
            if (res.data.password_random) {
              this.$set(this.tableHeader, "password_random", [true, false]);
            }
            this.dataTable.forEach(value => {
              if (value["status"] === true) {
                currentTotal++;
              }
              this.progressRatio = ((currentTotal / total) * 100).toFixed(2);
            });
          })
          .catch(() => {
            this.$customjs.showToast({
              title: "Có lỗi",
              message: "Không thể gửi yêu cầu đến máy chủ",
              type: 1,
              time: 3000
            });
          });
      }
    }
  },
  created() {
    this.$router.options.nprogress.done();
  }
};

function doit(fileName) {
  let elt = document.getElementById("table-user");
  let wb = XLSX.utils.table_to_book(elt, { sheet: "List Student" });
  return XLSX.writeFile(wb, fileName + ".xlsx");
}
</script>

<style lang="scss" scoped>
.file-import {
  display: flex;
  align-items: center;
  label {
    font-weight: 500;
    margin-right: 15px;
  }
  input {
    padding: 8px 16px;
    border: 1px solid #bbbbbb;
    outline: none;
    margin-right: 20px;
  }
  button {
    padding: 6px 18px 4px;
    font-size: 14px;
    border-radius: 0;
    margin-right: 10px;
  }
}
.progress-import {
  margin-top: 12px;
  // position: relative;
  width: 100%;
  height: 18px;
  border-radius: 30px;
  background-color: #ddd;
  overflow: hidden;
  pointer-events: none;
  .pbar {
    background-color: var(--color-success);
    width: 0;
    height: 100%;
    position: relative;
    transition: linear 0.3s;
    .ptext {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      transition: linear 0.3s;
    }
  }
}
.table-list-import {
  margin-top: 18px;
  padding: 0 48px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left,
    .right {
      display: flex;
      align-items: center;
    }
    .left {
      .status-details {
        display: flex;
        align-items: center;
        margin-right: 24px;
        cursor: pointer;
        &.line-through {
          text-decoration-line: line-through;
        }
        &.success {
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            background: var(--color-success);
            margin-right: 5px;
          }
        }
        &.fail {
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            background: var(--color-danger);
            margin-right: 5px;
          }
        }

        &.required {
          cursor: unset;
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            background: var(--color-primary);
            margin-right: 5px;
          }
        }
        &.duplicate {
          &::before {
            content: "";
            width: 14px;
            height: 14px;
            background: var(--color-purple);
            margin-right: 5px;
          }
        }
        &.line-through {
          text-decoration-line: line-through;
        }
      }
    }
    .right {
      label {
        font-weight: 500;
        margin-right: 15px;
      }
      input {
        padding: 6px 14px;
        border: 1px solid rgba(124, 124, 124, 0.74);
        outline: none;
        margin-right: 20px;
      }
      button {
        padding: 6px 18px 4px;
        font-size: 14px;
        border-radius: 0;
        margin-right: 10px;
      }
    }
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 12px;
    tr {
      th.danger {
        color: red;
      }
      th.required {
        color: var(--color-primary);
      }

      th,
      td {
        border: 1px solid #dddddd;
        font-size: 14px;
        padding: 8px;
      }
      th {
        text-align: center;
        font-weight: 600;
        user-select: none;
      }
      td {
        text-align: left;
      }
      &:nth-child(even) {
        background-color: #dddddd;
      }
      &.success {
        td {
          color: var(--color-success);
          font-weight: 500;
        }
      }
      &.fail {
        td {
          color: var(--color-danger);
        }
      }
      &.duplicate {
        td {
          color: var(--color-purple);
        }
      }
    }
  }
}
</style>