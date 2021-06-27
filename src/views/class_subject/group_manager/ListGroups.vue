<template>
  <div id="list-group row">
    <div class="col l-8 l-o-2 c-12">
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
        <div class="right">
          <span v-if="$store.state.USER.dataUser.role">
            <el-select
              v-model="groupSortType"
              placeholder="Chọn kiểu xếp nhóm"
              size="small"
              style="margin-right: 10px"
            >
              <el-option
                v-for="item in groupSortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              type="primary"
              size="small"
              @click="createGroup(groupSortType)"
              >Xếp nhóm</el-button
            >
          </span>
          <span v-else>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="formCreateGroup = true"
              :disabled="checkCreateGroup()"
              >Tạo nhóm</el-button
            >
          </span>
        </div>
      </div>
      <!--    END HEADER -->
      <data-tables
        :data="dataTable()"
        :table-props="tableProps"
        style="width: 100%"
      >
        <el-table-column
          label="STT"
          width="80"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="Tên Nhóm"
          width="auto"
          min-width="200"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              @click="seeGroupDetails(scope.row.id)"
              class="table-link"
              v-if="$store.getters.getUserRole"
            >
              {{ scope.row.name }}
            </span>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Nhóm trưởng"
          width="auto"
          min-width="200"
          sortable="custom"
        >
          <template slot-scope="scope">{{
            scope.row.leader.first_name + " " + scope.row.leader.last_name
          }}</template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          width="auto"
          min-width="250"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          prop="members"
          label="Thành viên"
          width="120"
          sortable="custom"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.members >= maximumMember ? 'danger' : 'success'"
              :hit="true"
              size="medium"
              >{{ scope.row.members }}/{{ maximumMember }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label=""
          :width="142"
          v-if="$store.state.CLASSSUBJECTDETAILS.group.isGroupLeader == false"
        >
          <template slot-scope="scope">
            <span v-if="$store.getters.getUserRole">
              <el-button
                type="success"
                size="small"
                @click.native.prevent="openFormAddMember(scope.row)"
              >
                Thêm thành viên
              </el-button>
            </span>

            <span
              v-else-if="
                $store.state.CLASSSUBJECTDETAILS.group.isJoinGroup == false
              "
            >
              <el-button
                @click.native.prevent="sendTicket(0, scope.row)"
                type="primary"
                size="small"
                v-if="!scope.row.ticket"
                :disabled="checkJoinGroup(scope.row.members)"
              >
                Tham gia
              </el-button>
              <el-button
                type="danger"
                size="small"
                v-else
                @click="destroyTicket(scope.row)"
                >Hủy</el-button
              >
            </span>

            <span
              v-else-if="
                scope.row.id !=
                  $store.state.CLASSSUBJECTDETAILS.group.myGroup.id
              "
            >
              <el-button
                type="primary"
                size="small"
                @click.native.prevent="sendTicket(1, scope.row)"
                v-if="!scope.row.ticket"
                :disabled="isTicket || scope.row.members >= maximumMember"
              >
                Chuyển nhóm
              </el-button>
              <el-button
                type="danger"
                size="small"
                v-else
                @click="destroyTicket(scope.row)"
                >Hủy</el-button
              >
            </span>
          </template>
        </el-table-column>
      </data-tables>
    </div>

    <!--  Form tạo nhóm mới  -->
    <transition name="fade">
      <div class="form-box" v-if="formCreateGroup">
        <div class="overlay" @click="formCreateGroup = false"></div>
        <form
          @submit.prevent="createGroup(1, dataCreateGroup)"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Tạo nhóm mới</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataCreateGroup.name }"
                v-model="dataCreateGroup.name"
              />
              <label>
                Tên nhóm
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataCreateGroup.description }"
                v-model="dataCreateGroup.description"
              />
              <label>
                Mô tả
              </label>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formCreateGroup = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>

    <!-- Form thêm sinh viên vào nhóm -->
    <transition name="fade">
      <div class="form-box" v-if="formAddMember">
        <div class="overlay" @click="formAddMember = false"></div>
        <form
          @submit.prevent="submitAddMember()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title-small">Thêm thành viên</h3>
            <el-tooltip
              class="item"
              effect="dark"
              content="Copy liên kết mời"
              placement="right"
            >
              <div class="form-group">
                <input
                  type="text"
                  class="valid copy"
                  :value="dataAddMember.group.name"
                  disabled
                  style="cursor: pointer; font-size: 14px"
                  name="linkInvite"
                />
                <label>
                  Tên nhóm
                </label>
              </div>
            </el-tooltip>

            <el-select
              v-model="dataAddMember.listMembers"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Nhập tên sinh viên"
              style="width: 100%"
            >
              <el-option
                v-for="student in $store.state.CLASSSUBJECTDETAILS.classMembers"
                :key="student.mssv"
                :label="student.first_name + ' ' + student.last_name"
                :value="student.member_id"
              >
                <span style="float: left; margin-right: 10px;">{{
                  student.first_name + " " + student.last_name
                }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  student.mssv
                }}</span>
              </el-option>
            </el-select>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formAddMember = false"
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
  </div>
</template>

<script>
import apiGroup from "@/api/group";
export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      formCreateGroup: false,
      formAddMember: false,
      dataAddMember: {
        group: {},
        listMembers: []
      },
      dataCreateGroup: {
        name: "",
        description: ""
      },
      keySearch: "",
      groupSortType: 2,
      groupSortOptions: [
        {
          label: "Xếp nhóm ngẫu nhiên",
          value: 2
        },
        {
          label: "Xếp theo thứ tự",
          value: 3
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
      groupData: [],
      isTicket: false,
      maximumMember: 3,
      isCreateGroup: false
    };
  },
  methods: {
    checkCreateGroup() {
      let date = new Date().getTime();
      let date_end =
        new Date(
          this.$store.getters.getClassDetails.setting_group_date_end
        ).getTime() + 61200000;
      if (
        this.isTicket ||
        this.$store.state.CLASSSUBJECTDETAILS.group.isJoinGroup ||
        !this.isCreateGroup ||
        date > date_end
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkJoinGroup(memberGroup) {
      let date = new Date().getTime();
      let date_end =
        new Date(
          this.$store.getters.getClassDetails.setting_group_date_end
        ).getTime() + 61200000;
      if (
        this.isTicket ||
        memberGroup >= this.maximumMember ||
        date > date_end ||
        !this.$store.getters.getClassDetails.student_create_group
      ) {
        return true;
      } else {
        return false;
      }
    },
    openFormAddMember(data) {
      this.formAddMember = true;
      this.dataAddMember.group = data;
      this.dataAddMember.listMembers = [];
    },
    submitAddMember() {
      if (this.dataAddMember.listMembers.length < 1) {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa chọn thành viên"
        });
      }
      let token = localStorage.getItem("token_user");
      if (token) {
        apiGroup
          .addNewMember(
            token,
            this.roomId,
            this.dataAddMember.group.id,
            this.dataAddMember.listMembers
          )
          .then(res => {
            if (res.data.status) {
              this.$customjs.showToast({
                title: "Thành công",
                message: res.data.message
              });
              this.dataAddMember.group.members += res.data.data.count_new;
              res.data.data.list_destroy.forEach(value => {
                this.groupData.forEach(group => {
                  if (group.id == value.group_id) {
                    group.members--;
                  }
                });
              });
              this.formAddMember = false;
            } else {
              this.$customjs.showToast({
                title: "Thất bại",
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
    destroyTicket(group) {
      let token = localStorage.getItem("token_user");
      if (token) {
        if (Object.keys(group.ticket).length !== 0) {
          apiGroup
            .destroyTicket(token, this.roomId, group.ticket.id)
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Gửi yêu cầu",
                  message: res.data.message
                });
                group.ticket = null;
                this.isTicket = false;
              } else {
                this.$customjs.showToast({
                  title: "Gửi yêu cầu",
                  message: res.data.message,
                  type: 1
                });
              }
            })
            .catch(() => {
              this.$message.error("Lỗi kết nối");
            });
        }
      }
    },
    sendTicket(type, group) {
      let token = localStorage.getItem("token_user");
      if (token) {
        if (type == 0) {
          apiGroup
            .createTicket(token, this.roomId, type, { group_going: group.id })
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Gửi yêu cầu",
                  message: res.data.message
                });
                group.ticket = res.data.data;
                this.isTicket = true;
              } else {
                this.$customjs.showToast({
                  title: "Gửi yêu cầu",
                  message: res.data.message,
                  type: 1
                });
              }
            })
            .catch(() => {
              this.$message.error("Lỗi kết nối");
            });
        } else if (type == 1) {
          let date = new Date().getTime();
          let date_end =
            new Date(
              this.$store.getters.getClassDetails.setting_group_date_end
            ).getTime() + 61200000;
          if (date < date_end && this.isCreateGroup) {
            apiGroup
              .createTicket(token, this.roomId, 1, {
                group_going: group.id
              })
              .then(res => {
                if (res.data.status) {
                  this.$customjs.showToast({
                    title: "Gửi yêu cầu",
                    message: res.data.message
                  });
                  group.ticket = res.data.data;
                  this.isTicket = true;
                } else {
                  this.$customjs.showToast({
                    title: "Gửi yêu cầu",
                    message: res.data.message,
                    type: 1
                  });
                }
              })
              .catch(() => {
                this.$message.error("Lỗi kết nối");
              });
          } else {
            this.$prompt("Nhập lý do chuyển nhóm", "Chuyển nhóm", {
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Hủy"
            }).then(({ value }) => {
              apiGroup
                .createTicket(token, this.roomId, 2, {
                  group_going: group.id,
                  reason: value
                })
                .then(res => {
                  if (res.data.status) {
                    this.$customjs.showToast({
                      title: "Gửi yêu cầu",
                      message: res.data.message
                    });
                    group.ticket = res.data.data;
                    this.isTicket = true;
                  } else {
                    this.$customjs.showToast({
                      title: "Gửi yêu cầu",
                      message: res.data.message,
                      type: 1
                    });
                  }
                })
                .catch(() => {
                  this.$message.error("Lỗi kết nối");
                });
            });
          }
        }
      }
    },
    dataTable() {
      if (!this.keySearch) {
        return this.groupData;
      } else {
        return this.groupData.filter(data => {
          for (let key in data) {
            if (
              key != "updated_at" &&
              key != "created_at" &&
              (data[key] + "")
                .toLowerCase()
                .indexOf(this.keySearch.toLowerCase()) != -1
            ) {
              return true;
            }
          }
          return false;
        });
      }
    },
    createGroup(type, data = null) {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiGroup
          .create(token, this.roomId, type, data)
          .then(res => {
            if (res.data.status) {
              this.$message.success(res.data.message);
              if (type == 1) {
                this.groupData.push(res.data.data);
                this.formCreateGroup = false;
                let myGroup = {};
                for (const key in res.data.data) {
                  myGroup[key] = res.data.data[key];
                }
                myGroup["members"] = [];
                myGroup["members"].push({});
                let dataUser = this.$store.getters.getDataUser;
                for (const key in dataUser) {
                  myGroup["members"][0][key] = dataUser[key];
                }
                myGroup["members"][0]["role"] = 1;
                myGroup["notifies"] = [];
                this.$store.commit("createGroup", myGroup);
                // this.$emit("createGroup", myGroup);
              } else {
                this.groupData = [...this.groupData, ...res.data.data];
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    },
    seeGroupDetails(groupId) {
      let token = localStorage.getItem("token_user");
      if (token && this.$store.getters.getUserRole) {
        apiGroup
          .show(token, this.roomId, groupId)
          .then(res => {
            this.$store.commit("setDataMyGroup", {
              data: res.data
            });
            this.$router.push({ name: "Group" });
          })
          .catch(() => this.$message.error("Cõ lỗi xảy ra"));
      }
    }
  },
  beforeCreate() {
    this.$router.options.nprogress.set(0.7);
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      await apiGroup
        .get(token, this.roomId)
        .then(res => {
          this.groupData = res.data;
          this.groupData.forEach(group => {
            if (group.ticket != null) {
              this.isTicket = true;
            }
          });
        })
        .catch(() => this.$message.error("Lỗi kết nối"));
    }

    if (this.$store.getters.getClassDetails.maximum_group_member) {
      this.maximumMember = this.$store.getters.getClassDetails.maximum_group_member;
      this.isCreateGroup = !!this.$store.getters.getClassDetails
        .student_create_group;
    } else {
      let check = setInterval(() => {
        if (this.$store.getters.getClassDetails.maximum_group_member) {
          this.maximumMember = this.$store.getters.getClassDetails.maximum_group_member;
          this.isCreateGroup = !!this.$store.getters.getClassDetails
            .student_create_group;
          clearInterval(check);
        }
      }, 500);
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
  cursor: pointer;
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

.form-box {
  z-index: 1500;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
</style>
