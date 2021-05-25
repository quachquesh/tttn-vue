<template>
  <div id="class-subject-manager">
    <loading :z-index="1500" :loading="loading" />
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
        <span class="label">Học kỳ: </span>
        <div style="width: 300px">
          <el-select
            v-model="filterSemester"
            multiple
            placeholder="Học kỳ"
            style="width: 100%"
          >
            <el-option label="Học kỳ 1" value="1"> </el-option>
            <el-option label="Học kỳ 2" value="2"> </el-option>
            <el-option label="Học kỳ 3" value="3"> </el-option>
          </el-select>
        </div>
        <span class="label" style="margin-left: 30px">Năm học: </span>
        <div style="width: 150px">
          <el-select v-model="filterYear.index" style="width: 100%">
            <el-option
              v-for="(item, index) in filterYear.data"
              :key="index"
              :label="item.label"
              :value="index"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <data-tables
      :data="dataTable()"
      :table-props="tableProps"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="120"
        sortable="custom"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="Tên lớp"
        width="auto"
        min-width="200"
        sortable="custom"
      >
        <template slot-scope="scope">
          <router-link
            :to="{ name: 'ClassSubject', params: { roomId: scope.row.id } }"
            custom
            v-slot="{ navigate, href }"
          >
            <a :href="href" @click="navigate" class="table-link">{{
              scope.row.name
            }}</a>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="Mô tả"
        width="auto"
        min-width="150"
        sortable="custom"
      >
      </el-table-column>
      <el-table-column
        prop="subject_name"
        label="Môn học"
        width="auto"
        min-width="200"
        sortable="custom"
      >
        <template slot-scope="scope">
          {{ scope.row.subject_name + " - " + scope.row.subject_description }}
        </template>
      </el-table-column>

      <el-table-column
        prop="semester"
        label="Học kỳ"
        width="100"
        sortable="custom"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="created_at"
        label="Năm học"
        width="150"
        sortable="custom"
        align="center"
        :formatter="formatTime"
      ></el-table-column>

      <el-table-column
        prop="number_of_member"
        label="Số lượng thành viên"
        width="200"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.number_of_member == 0 ? 'danger' : 'primary'"
            :hit="true"
            size="medium"
            >{{ scope.row.number_of_member }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="" width="80">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="openFormEdit(scope.$index, scope.row)"
            type="primary"
            size="small"
            >Sửa
          </el-button>
        </template>
      </el-table-column>
    </data-tables>

    <!--Form Class New-->
    <transition name="fade">
      <div class="form-box" v-if="formEditClass">
        <div class="overlay" @click="formEditClass = false"></div>
        <form
          @submit.prevent="editClass()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Tạo lớp học mới</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataEdit.name }"
                v-model="dataEdit.name"
              />
              <label>
                Tên
                <span class="required">*</span>
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataEdit.description }"
                v-model="dataEdit.description"
              />
              <label>
                Mô tả
              </label>
            </div>
            <div class="group-row block">
              <label class="title">
                Chủ đề:
                <span class="required">*</span>
              </label>
              <el-select v-model="dataEdit.img" placeholder="Chọn chủ đề">
                <el-option
                  v-for="(theme, index) in dataTheme"
                  :key="index"
                  :label="theme.name"
                  :value="theme.link"
                >
                </el-option>
              </el-select>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formEditClass = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Sửa
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from "@/components/template/loading";

export default {
  data() {
    return {
      loading: true,
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
      keySearch: "",
      filterSemester: [],
      filterYear: {
        data: [
          {
            label: "Tất cả",
            start: 0,
            end: 9999
          }
        ],
        index: 0
      },
      formEditClass: false,
      dataTheme: [
        {
          name: "Code",
          link: "/assets/img/code.jpg"
        },
        {
          name: "Graduation",
          link: "/assets/img/graduation.jpg"
        },
        {
          name: "Learn Language",
          link: "/assets/img/learnlanguage.jpg"
        },
        {
          name: "Writing",
          link: "/assets/img/Writing.jpg"
        }
      ],
      dataEdit: {}
    };
  },
  methods: {
    dataTable() {
      // Nếu không từ khóa search
      if (
        !this.keySearch &&
        this.filterSemester.length == 0 &&
        this.filterYear.index == 0
      ) {
        return this.$store.getters.getMyClassSubjects;
      }
      let data = this.$store.getters.getMyClassSubjects;
      // Nếu lọc học kỳ
      if (this.filterSemester.length > 0) {
        data = data.filter(cs => {
          for (const key in this.filterSemester) {
            if (this.filterSemester[key] == cs.semester) {
              return true;
            }
          }
          return false;
        });
      }
      // Lọc năm học
      if (this.filterYear.index != 0) {
        data = data.filter(cs => {
          let date = new Date(cs.created_at);
          let year = date.getFullYear();
          if (cs.semester != 1) {
            year -= 1;
          }
          if (this.filterYear.data[this.filterYear.index].start == year) {
            return true;
          } else {
            return false;
          }
        });
      }
      // Nếu có từ khóa keySearch
      if (this.keySearch) {
        data = data.filter(cs => {
          for (let key in cs) {
            if (
              (cs[key] + "")
                .toLowerCase()
                .indexOf(this.keySearch.toLowerCase()) != -1
            ) {
              return true;
            }
          }
          return false;
        });
      }
      return data;
    },
    formatTime(row) {
      let date = new Date(row.created_at);
      let year = date.getFullYear();
      if (row.semester == 1) {
        return year + " - " + (year + 1);
      } else {
        return year - 1 + " - " + year;
      }
    },
    openFormEdit(index, value) {
      for (const key in value) {
        this.$set(this.dataEdit, key, value[key]);
      }
      this.formEditClass = true;
    },
    editClass() {
      let token = localStorage.getItem("token_user");
      if (token) {
        let id = this.dataEdit.id;
        let data = this.dataEdit;
        let number_of_member = data.number_of_member;
        this.$store
          .dispatch("apiUpdateClassSubject", [token, id, data])
          .then(res => {
            if (res.data.status) {
              let data = res.data.data;
              data["number_of_member"] = number_of_member;
              this.$store.commit("setDataMyClassSubjectById", [id, data]);
              this.formEditClass = false;
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(() => this.$message.error("Có lỗi xảy ra"));
      }
    }
  },
  components: {
    Loading
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      await this.$store
        .dispatch("apiGetMyClassSubject", token)
        .then(res => {
          this.$store.commit("setDataMyClassSubject", res.data);
          this.loading = false;
        })
        .catch(() => this.$message.error("Lỗi kết nối"));

      // check tất cả năm học
      let arrOption = [];
      this.$store.getters.getMyClassSubjects.forEach(value => {
        let date = new Date(value.created_at);
        let year = date.getFullYear();
        if (value.semester != 1) {
          year -= 1;
        }
        let checkYear = false;
        arrOption.forEach(opt => {
          if (opt.start == year) {
            checkYear = true;
          }
        });
        if (checkYear == false) {
          arrOption.push({
            label: year + " - " + (year + 1),
            start: year,
            end: year + 1
          });
        }
      });
      // Sắp xếp lại option
      for (let i = 0; i < arrOption.length; i++) {
        for (let j = i + 1; j < arrOption.length; j++) {
          if (arrOption[i].start > arrOption[j].start) {
            let tmp = arrOption[i];
            arrOption[i] = arrOption[j];
            arrOption[j] = tmp;
          }
        }
      }
      let newOption = [...this.filterYear.data, ...arrOption];
      this.$set(this.filterYear, "data", newOption);

      // set Thời gian hiện tại
      let timeNow = new Date();
      let month = timeNow.getMonth() + 1;
      let year = timeNow.getFullYear();
      if (month > 8 && month < 2) {
        this.filterSemester.push("1");
        for (let i = 0; i < this.filterYear.data.length; i++) {
          if (this.filterYear.data[i].start == year) {
            this.filterYear.index = i;
            break;
          }
        }
      } else {
        if (month > 1 && month < 7) {
          this.filterSemester.push("2");
        } else {
          this.filterSemester.push("3");
        }
        for (let i = 0; i < this.filterYear.data.length; i++) {
          if (this.filterYear.data[i].end == year) {
            this.filterYear.index = i;
            break;
          }
        }
      }

      this.$router.options.nprogress.done();
    }
  }
};
</script>

<style lang="scss" scoped>
#class-subject-manager {
  padding: 0 100px;
}
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
