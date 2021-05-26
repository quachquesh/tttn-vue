<template>
  <div id="list-group row">
    <div class="col c-8 c-o-2">
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
              v-if="isJoinGroup == false"
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
          width="100"
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
          <!--        <template slot-scope="scope">-->
          <!--          <router-link-->
          <!--            :to="{-->
          <!--              name: 'ListClassSubject',-->
          <!--              params: { subjectId: scope.row.id }-->
          <!--            }"-->
          <!--            custom-->
          <!--            v-slot="{ navigate, href }"-->
          <!--          >-->
          <!--            <a :href="href" @click="navigate" class="table-link">{{-->
          <!--                scope.row.name-->
          <!--              }}</a>-->
          <!--          </router-link>-->
          <!--        </template>-->
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          width="250"
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
          :width="$store.getters.getUserRole ? 230 : 140"
          v-if="isGroupLeader == false"
        >
          <!--        gv: xoa, sua, add member-->
          <!--        sv: tham gia/ hủy-->
          <template slot-scope="scope">
            <span v-if="$store.getters.getUserRole">
              <el-button
                type="success"
                size="small"
                @click.native.prevent="openFormEdit(scope.$index, scope.row)"
              >
                Thêm sv
              </el-button>
              <el-button type="primary" size="small">Sửa</el-button>
              <el-button type="danger" size="small">Xóa</el-button>
            </span>

            <span v-else-if="isJoinGroup == false">
              <el-button
                @click.native.prevent="sendTicket(0, scope.row)"
                type="primary"
                size="small"
                v-if="!scope.row.ticket"
                :disabled="isTicket || scope.row.members >= maximumMember"
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

            <span v-else-if="scope.row.id != myGroup.id">
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

    <!--    Form tạo nhóm mới-->
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
    },
    isGroupLeader: {
      required: true
    }
  },
  data() {
    return {
      formCreateGroup: false,
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
      maximumMember: 3
    };
  },
  methods: {
    test(t) {
      console.log(t);
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
          this.$prompt("Nhập lý do chuyển nhóm", "Chuyển nhóm", {
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy"
          }).then(({ value }) => {
            apiGroup
              .createTicket(token, this.roomId, type, {
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
    },
    dataTable() {
      return this.groupData;
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
              } else {
                this.groupData = [...this.groupData, ...res.data.data];
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    }
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      await apiGroup.get(token, this.roomId).then(res => {
        this.groupData = res.data;
        this.groupData.forEach(group => {
          if (group.ticket != null) {
            this.isTicket = true;
          }
        });
      });
    }

    if (this.$store.getters.getClassDetails.maximum_group_member) {
      this.maximumMember = this.$store.getters.getClassDetails.maximum_group_member;
    } else {
      let check = setInterval(() => {
        if (this.$store.getters.getClassDetails.maximum_group_member) {
          this.maximumMember = this.$store.getters.getClassDetails.maximum_group_member;
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
