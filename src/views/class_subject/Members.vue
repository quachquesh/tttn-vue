<template>
  <div>
    <div
      class="grid wide"
      style="background-color: #ffffff; border-radius: 5px; padding: 0 16px;"
    >
      <div class="row">
        <div class="c-12 lecturer-group">
          <div class="header">
            <h2>Giảng viên</h2>
          </div>
          <ul class="list-lecturers">
            <li class="item">
              <span class="avt">
                <img src="/assets/img/hacker.png" />
              </span>
              <span class="name">{{
                $store.state.CLASSSUBJECTDETAILS.classLecturer.first_name +
                  " " +
                  $store.state.CLASSSUBJECTDETAILS.classLecturer.last_name
              }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="c-12 student-group">
          <div class="header">
            <h2>Sinh viên</h2>
            <span class="add-student">
              <span class="number-student"
                >{{ $store.state.CLASSSUBJECTDETAILS.classMembers.length }} Sinh
                viên</span
              >
              <el-tooltip
                class="item"
                effect="dark"
                content="Thêm sinh viên theo mssv"
                placement="top"
                v-if="$store.state.USER.dataUser.role"
              >
                <span class="material-icons" @click="addStudent()"
                  >person_add</span
                >
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="Thêm sinh viên theo danh sách"
                placement="top"
                v-if="$store.state.USER.dataUser.role"
              >
                <span
                  class="material-icons"
                  @click="formInviteStudentList = true"
                  style="font-size: 32px;"
                  >group_add</span
                >
              </el-tooltip>
            </span>
          </div>
          <ul class="list-students">
            <li class="item first">
              <div
                class="left"
                v-if="$store.state.USER.dataUser.role"
                style="width: unset;"
              >
                <input type="checkbox" @change="checkBoxAll" />
                <span class="select-option" @click="clickSelectBox($event)">
                  <span class="select-box">
                    <span class="content">Tác vụ</span>
                    <span class="material-icons">expand_more</span>
                  </span>
                  <ul class="list-option">
                    <li class="option" @click="confirmSendMailList">
                      Gửi email
                    </li>
                    <!--                    <li class="option">Ẩn</li>-->
                    <li class="option" @click="confirmDestroyList">Xóa</li>
                  </ul>
                </span>
              </div>
              <div class="left" v-else></div>
              <div class="right">
                <span class="select-option" @click="clickSelectBox($event)">
                  <span class="select-box">
                    <span class="content">{{ sortMemberType.label }}</span>
                    <span class="material-icons">expand_more</span>
                  </span>
                  <ul class="list-option">
                    <li class="option" @click="clickSortMember(1, 'Tên')">
                      Sắp xếp tên
                    </li>
                    <li class="option" @click="clickSortMember(2, 'Lớp')">
                      Sắp xếp lớp
                    </li>
                    <li class="option" @click="clickSortMember(0, 'Sắp xếp')">
                      Bỏ sắp xếp
                    </li>
                  </ul>
                </span>
              </div>
            </li>

            <li class="item" v-for="member in sortMembers()" :key="member.id">
              <div class="left">
                <input
                  type="checkbox"
                  @click.stop="checkBoxStudent($event, member)"
                  v-if="$store.state.USER.dataUser.role"
                />
                <span class="avt">
                  <img src="/assets/img/hacker.png" />
                </span>
                <span class="name">{{
                  member.first_name + " " + member.last_name
                }}</span>
                <span class="classroom">{{ member.classroom }}</span>
              </div>
              <div
                class="right"
                @click.stop="optionMember"
                v-if="$store.state.USER.dataUser.role"
              >
                <span class="dots">
                  <svg focusable="false" viewBox="0 0 24 24" class="NMm5M">
                    <path
                      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    ></path>
                  </svg>
                </span>
                <ul class="mini-menu">
                  <li class="item" @click="confirmSendMail(member.email)">
                    Gửi email cho học sinh
                  </li>
                  <!--                  <li class="item">-->
                  <!--                    Ẩn {{ member.first_name + " " + member.last_name }}-->
                  <!--                  </li>-->
                  <li
                    class="item"
                    @click="
                      confirmDestroy(
                        member.member_id,
                        member.first_name + ' ' + member.last_name
                      )
                    "
                  >
                    Xóa
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--  FORM THÊM HỌC VIÊN  -->
    <transition name="fade">
      <div class="form-box" v-if="formAddStudent">
        <div class="overlay" @click="formAddStudent = false"></div>
        <form
          @submit.prevent="submitAddStudent()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title-small">Thêm học viên</h3>
            <el-tooltip
              class="item"
              effect="dark"
              content="Copy liên kết mời"
              placement="right"
            >
              <div class="form-group" @click="copyLinkInvite($event)">
                <input
                  type="text"
                  class="valid copy"
                  :value="linkInvite"
                  disabled
                  style="cursor: pointer; font-size: 14px"
                  name="linkInvite"
                />
                <label>
                  Đường liên kết mời
                </label>
              </div>
            </el-tooltip>

            <el-select
              v-model="listStudentSelect"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Nhập MSSV"
              style="width: 100%"
            >
              <el-option
                v-for="student in $store.state.STUDENT.students"
                :key="student.mssv"
                :label="student.mssv"
                :value="student.mssv"
              >
                <span style="float: left; margin-right: 10px;">{{
                  student.mssv
                }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  student.first_name + " " + student.last_name
                }}</span>
              </el-option>
            </el-select>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formAddStudent = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
    <!--  FORM THÊM HỌC VIÊN IMPORT  -->
    <transition name="fade">
      <div
        class="form-box"
        id="form-invite-import"
        v-if="formInviteStudentList"
      >
        <div class="overlay" @click="formInviteStudentList = false"></div>
        <div class="form-block">
          <h3 class="form-title-small">Thêm học viên</h3>
          <div class="group-row flex">
            <label>File import</label>
            <input type="file" @change="importFile" />
            <button class="btn btn-primary" @click="addStudentImport">
              Thêm
            </button>
          </div>
          <div class="group-row flex">
            <span
              class="status-details success"
              :class="{ 'line-through': !statusFilter.success }"
              @click="statusFilter.success = !statusFilter.success"
            >
              Thành công
            </span>
            <span
              class="status-details fail"
              :class="{ 'line-through': !statusFilter.fail }"
              @click="statusFilter.fail = !statusFilter.fail"
            >
              Thất bại, không tồn tại
            </span>
            <span
              class="status-details duplicate"
              :class="{ 'line-through': !statusFilter.duplicate }"
              @click="statusFilter.duplicate = !statusFilter.duplicate"
            >
              Đã ở lớp này
            </span>
          </div>
          <div class="group-row flex table">
            <table class="table-import">
              <tr class="header">
                <th>STT</th>
                <th>MSSV</th>
              </tr>
              <tr
                v-for="(value, index) in filterDataImport()"
                :key="index"
                :class="{
                  fail: value['status'] == 0,
                  success: value['status'] == 1,
                  duplicate: value['status'] == 2
                }"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ value["mssv"] || value }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import apiClassMember from "@/api/classMember";
import XLSX from "xlsx";
export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      formAddStudent: false,
      formInviteStudentList: false,
      listStudentSelect: [],
      dataImport: [],
      statusFilter: {
        success: true,
        fail: true,
        duplicate: true
      },
      listMemberChecked: [],
      sortMemberType: {
        value: 0, // 0: Không sắp xếp, 1: Tên, 2: lớp
        type: false, // false: A-Z, true: Z-A
        label: "Sắp xếp"
      }
    };
  },
  methods: {
    clickSortMember(sortValue, sortLabel) {
      if (this.sortMemberType.value == sortValue) {
        this.sortMemberType.type = !this.sortMemberType.type;
      } else {
        this.sortMemberType.type = false;
      }
      this.sortMemberType.value = sortValue;
      this.sortMemberType.label = sortLabel;
    },
    sortMembers() {
      if (this.sortMemberType.value == 0) {
        return this.$store.state.CLASSSUBJECTDETAILS.classMembers;
      } else if (this.sortMemberType.value == 1) {
        // Sắp xếp theo Tên
        if (!this.sortMemberType.type) {
          // A-Z
          return sortMember(
            this.$store.getters.getClassMembers,
            "last_name",
            false
          );
        } else {
          // Z-A
          return sortMember(
            this.$store.getters.getClassMembers,
            "last_name",
            true
          );
        }
      } else if (this.sortMemberType.value == 2) {
        // Sắp xếp theo Lớp
        if (!this.sortMemberType.type) {
          // A-Z
          return sortMember(
            this.$store.getters.getClassMembers,
            "classroom",
            false
          );
        } else {
          // Z-A
          return sortMember(
            this.$store.getters.getClassMembers,
            "classroom",
            true
          );
        }
      }
    },
    confirmSendMail(email) {
      window.open(`https://mail.google.com/mail/u/0/?fs=1&to=${email}&tf=cm`);
    },
    confirmSendMailList() {
      if (this.listMemberChecked.length > 0) {
        let url = "https://mail.google.com/mail/u/0/?fs=1&bcc=";
        let length = this.listMemberChecked;
        this.listMemberChecked.forEach((member, index) => {
          if (index == length - 1) {
            url += member.email;
          } else {
            url += member.email + ",";
          }
        });
        url += "&tf=cm";
        window.open(url);
      }
    },
    confirmDestroy(member_id, member_name) {
      this.$confirm("Xác nhận xóa sinh viên " + member_name + "?", "Cảnh báo", {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning"
      })
        .then(() => {
          apiClassMember
            .delete(localStorage.getItem("token_user"), member_id)
            .then(res => {
              if (res.data.status) {
                this.$store.commit("deleteMemberByMemberId", member_id);
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
            .catch(() => this.$message.error("Không thể gửi yêu cầu"));
        })
        .catch(() => {});
    },
    confirmDestroyList() {
      if (this.listMemberChecked.length > 0) {
        this.$confirm("Xác nhận xóa danh sách sinh viên?", "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning"
        })
          .then(() => {
            let listDestroy = [];
            this.listMemberChecked.forEach(member => {
              listDestroy.push(member.member_id);
            });
            apiClassMember
              .deleteList(localStorage.getItem("token_user"), listDestroy)
              .then(res => {
                if (res.data.status) {
                  res.data.data.forEach(member_id => {
                    this.$store.commit("deleteMemberByMemberId", member_id);
                  });
                  this.$customjs.showToast({
                    title: "Thành công",
                    message: res.data.message
                  });
                  document.querySelector(
                    ".list-students .item input[type='checkbox']"
                  ).checked = false;
                } else {
                  this.$customjs.showToast({
                    title: "Thất bại",
                    message: res.data.message,
                    type: 1
                  });
                }
              })
              .catch(() => this.$message.error("Không thể gửi yêu cầu"));
          })
          .catch(() => {});
      }
    },
    checkBoxStudent(event, member) {
      document.querySelector(
        ".list-students .item.first input[type='checkbox']"
      ).checked = false;

      if (event.target.checked) {
        this.listMemberChecked.push(member);
      } else {
        this.listMemberChecked.forEach((memb, index) => {
          if (memb.member_id == member.member_id) {
            this.listMemberChecked.splice(index, 1);
            return true;
          }
        });
      }
    },
    checkBoxAll(event) {
      if (event.target.checked) {
        this.$set(this, "listMemberChecked", []);
        this.$store.getters.getClassMembers.forEach(member => {
          this.listMemberChecked.push(member);
        });
      } else {
        this.$set(this, "listMemberChecked", []);
      }
      document
        .querySelectorAll(".list-students .item input[type='checkbox']")
        .forEach(el => {
          el.checked = event.target.checked;
        });
    },
    optionMember(event) {
      let element = event.target;
      while (!element.classList.contains("right")) {
        element = element.parentElement;
      }
      element.classList.toggle("active");
    },
    addStudent() {
      this.formAddStudent = true;
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$store
          .dispatch("reqGetAllStudent", token)
          .then(res => {
            this.$store.commit("setDataStudent", res.data);
            // this.$message.success("load danh sách sinh viên thành công");
          })
          .catch(() => {
            this.$message.error("load danh sách sinh viên thất bại");
          });
      }
    },
    async submitAddStudent() {
      await apiClassMember
        .create(
          localStorage.getItem("token_user"),
          this.listStudentSelect,
          this.roomId
        )
        .then(res => {
          let listSuccess = res.data.filter(x => x.status == 1);
          if (listSuccess.length > 0) {
            this.$store.commit("addNewMember", listSuccess);
            this.$message.success("Thêm thành viên thành công");
          }
          this.formAddStudent = false;
        })
        .catch(() => this.$message.error("Không thể gửi yêu cầu đến máy chú"));
    },
    clickSelectBox(event) {
      let element = event.target;
      while (!element.classList.contains("select-option")) {
        element = element.parentElement;
      }
      element.querySelector(".list-option").classList.toggle("active");
    },
    copyLinkInvite() {
      let link = document.querySelector("#form-invite input[name='linkInvite']")
        .value;
      navigator.clipboard.writeText(link).then(
        () => {
          this.$customjs.showToast({
            title: "Thành công",
            message: "Copy Link mời thành công"
          });
        },
        () => {
          this.$customjs.showToast({
            title: "Lỗi",
            message: "Copy mã lớp thất bại",
            type: 1
          });
        }
      );
    },
    importFile(evt) {
      let file;
      let files = evt.target.files;

      if (!files || files.length == 0) return;

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
        let json = XLSX.utils.sheet_to_json(ws);
        let checkMSSV = false;
        let keyMSSV = "mssv";
        for (const key in json[0]) {
          if (key.toLowerCase() == keyMSSV) {
            keyMSSV = key;
            checkMSSV = true;
          }
        }

        if (!checkMSSV) {
          this.$message.error("Không có cột dữ liệu MSSV");
        } else {
          this.$set(this, "dataImport", []);
          json.forEach(value => {
            this.dataImport.push(value[keyMSSV]);
          });
        }
      };

      reader.readAsArrayBuffer(file);
    },
    async addStudentImport() {
      let data = [];
      if (!this.dataImport[0]) {
        this.$message.error("Chưa có dữ liệu");
      } else if (this.dataImport[0]["mssv"]) {
        data = this.dataImport.map(v => v["mssv"]);
      } else {
        data = this.dataImport;
      }
      await apiClassMember
        .create(localStorage.getItem("token_user"), data, this.roomId)
        .then(res => {
          this.$set(
            this,
            "dataImport",
            res.data.map(v => {
              return { mssv: v.mssv, status: v.status };
            })
          );
          let listSuccess = res.data.filter(v => v.status == 1);
          this.$store.commit("addNewMember", listSuccess);
          this.$message.success("Thêm thành viên thành công");
        })
        .catch(() => this.$message.error("Không thể gửi yêu cầu đến máy chú"));
    },
    filterDataImport() {
      if (this.dataImport[0] && this.dataImport[0].status == undefined) {
        return this.dataImport;
      }
      return this.dataImport.filter(x => {
        if (this.statusFilter.fail && x.status == 0) {
          return true;
        } else if (this.statusFilter.success && x.status == 1) {
          return true;
        } else if (this.statusFilter.duplicate && x.status == 2) {
          return true;
        }
        return false;
      });
    }
  },
  computed: {
    linkInvite() {
      // return `${window.location.origin}/c/${this.classSubject.id}?key=${this.classSubject.key}`;
      return `${window.location.origin}/c/${this.$store.getters.getSubjectDetails.id}?key=${this.$store.getters.getClassDetails.key}`;
    }
  },
  created() {
    document.title = "Thành viên lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};

function sortMember(listSort, type, sortType) {
  let listMember = [...listSort];
  for (let i = 0; i < listMember.length; i++) {
    for (let j = i + 1; j < listMember.length; j++) {
      if (!sortType) {
        // A-Z
        if (listMember[i][type] > listMember[j][type]) {
          let tmp = listMember[i];
          listMember[i] = listMember[j];
          listMember[j] = tmp;
        }
      } else {
        // Z-A
        if (listMember[i][type] < listMember[j][type]) {
          let tmp = listMember[i];
          listMember[i] = listMember[j];
          listMember[j] = tmp;
        }
      }
    }
  }
  return listMember;
}
</script>

<style lang="scss" scoped>
.material-icons {
  outline: none;
  border: none;
}
@media (min-width: 1024px) {
  .grid.wide {
    width: 800px;
  }
}
.lecturer-group {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-weight: 400;
      font-size: 30px;
      color: var(--color-primary);
    }
    border-bottom: 1px solid var(--color-primary);
    padding: 18px 30px;
  }
  .list-lecturers {
    list-style: none;
    margin-top: 6px;
    .item {
      display: flex;
      // justify-content: center;
      align-items: center;
      padding: 8px 12px;
      .avt {
        margin: 0 16px;
        img {
          height: 40px;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
        }
      }
      .name {
        color: #777;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.student-group {
  margin-top: 24px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-primary);
    padding: 12px 18px 12px 30px;
    h2 {
      font-weight: 400;
      font-size: 30px;
      color: var(--color-primary);
    }
    .add-student {
      display: flex;
      align-items: center;
      .number-student {
        font-size: 16px;
        color: var(--color-primary);
        margin-right: 10px;
      }
      .material-icons {
        font-size: 26px;
        color: var(--color-primary);
        cursor: pointer;
        user-select: none;
        margin-left: 10px;
      }
    }
  }
  .list-students {
    list-style: none;
    padding-top: 8px;
    padding-bottom: 16px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      &.first {
        .select-option {
          position: relative;
          .select-box {
            border: 1px solid #dcdcdc;
            padding: 4px 7px 4px 14px;
            //display: block;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 28px;
            cursor: pointer;
            user-select: none;
            .content {
              margin-right: 7px;
            }
          }
          .list-option {
            position: absolute;
            list-style: none;
            top: calc(100% + 3px);
            right: 0;
            padding: 8px 0;
            width: max-content;
            background-color: #fff;
            box-shadow: 0 2px 2px rgba(#000, 0.3), 0 2px 5px rgba(#000, 0.3);
            user-select: none;
            transform: translateY(30px);
            opacity: 0;
            visibility: hidden;
            transition: linear 0.3s;
            &.active {
              transform: translateY(0px);
              opacity: 1;
              visibility: unset;
              z-index: 1000;
            }
            cursor: pointer;
            .option {
              padding: 8px 32px 8px 16px;
              &:hover {
                background-color: #ececec;
              }
              &:active {
                background-color: #dcdcdc;
              }
            }
          }
        }
        .right {
          height: 100%;
          .material-icons {
            cursor: pointer;
            user-select: none;
          }
        }
      }
      .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 75%;
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .avt {
          height: 36px;
          margin-left: 28px;
          margin-right: 16px;
          img {
            border-radius: 50%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
        .name {
          font-size: 14px;
          font-weight: 500;
          color: #777;
          flex: 1;
        }
        .classroom {
          color: #777;
          font-size: 14px;
          font-weight: 500;
        }
      }
      .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        border-radius: 50%;
        .dots {
          width: 36px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 50%;
          transition: linear 0.1s;
          user-select: none;
          &:hover {
            background-color: #ececec;
            path {
              fill: var(--color-primary);
            }
          }
          &:active {
            background-color: #dcdcdc;
          }
          svg {
          }
        }
        &.active .mini-menu {
          visibility: unset;
          opacity: 1;
          transform: translateY(0);
        }
        .mini-menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: max-content;
          box-shadow: 0 2px 3px rgba(#000, 0.3);
          padding: 8px 0;
          background-color: #fff;
          z-index: 1;
          transform: translateY(30px);
          opacity: 0;
          visibility: hidden;
          transition: linear 0.2s;
          .item {
            padding: 8px 24px 8px 16px;
            cursor: pointer;
            user-select: none;
            position: relative;
            &:hover {
              background-color: #ddd;
            }
            &:active {
              background-color: #aaa;
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
  height: 100%;
  top: 0;
  left: 0;
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    background-color: rgba(#000, 0.2);
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

#form-invite-import {
  .form-block {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 7px 7px 14px rgba(#000, 0.2), -3px -3px 7px rgba(#ddd, 1);
    .group-row {
      margin-top: 14px;
      &.flex {
        display: flex;
        align-items: center;
      }
      &.table {
        position: relative;
        height: 30vh;
        overflow-y: auto;
      }
      label {
        font-weight: 500;
        margin-right: 15px;
        width: max-content;
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
      .status-details {
        display: flex;
        align-items: center;
        margin-right: 24px;
        cursor: pointer;
        user-select: none;
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
      .table-import {
        position: absolute;
        top: 0;
        left: 0;
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
            text-align: center;
          }
          th {
            font-weight: 600;
            user-select: none;
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
  }
}
</style>
