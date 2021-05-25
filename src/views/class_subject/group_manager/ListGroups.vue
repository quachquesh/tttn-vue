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
          <el-button type="primary" size="small" icon="el-icon-plus" v-else
            >Tạo nhóm</el-button
          >
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

        <el-table-column fixed="right" label="" width="230">
          <!--        gv: xoa, sua, add member-->
          <!--        sv: tham gia/ hủy-->
          <template slot-scope="scope">
            <!--            <el-button-->
            <!--              @click.native.prevent="openFormEdit(scope.$index, scope.row)"-->
            <!--              type="primary"-->
            <!--              size="small"-->
            <!--            >Tham gia-->
            <!--            </el-button>-->
            <!--            <el-button-->
            <!--              type="danger"-->
            <!--              size="small"-->
            <!--            >Hủy-->
            <!--            </el-button>-->

            <!--            <el-button-->
            <!--              type="primary"-->
            <!--              size="small"-->
            <!--            >Chuyển nhóm-->
            <!--            </el-button>-->
            <!--            <el-button-->
            <!--              type="danger"-->
            <!--              size="small"-->
            <!--            >Hủy-->
            <!--            </el-button>-->

            <el-button
              type="success"
              size="small"
              @click.native.prevent="openFormEdit(scope.$index, scope.row)"
              >Thêm sv</el-button
            >
            <el-button type="primary" size="small">Sửa</el-button>
            <el-button type="danger" size="small">Xóa</el-button>
          </template>
        </el-table-column>
      </data-tables>
    </div>
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
      maximumMember: 3
    };
  },
  methods: {
    dataTable() {
      return this.groupData;
    },
    createGroup(type) {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiGroup
          .create(token, this.roomId, type)
          .then(res => {
            if (res.data.status) {
              this.$message.success("Xếp nhóm thành công");
              this.groupData = [...this.groupData, ...res.data.data];
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    }
  },
  created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      apiGroup.get(token, this.roomId).then(res => {
        this.groupData = res.data;
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
