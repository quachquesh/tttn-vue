<template>
  <div id="subject-manager" v-if="loading == false">
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
        width="150"
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
            :to="{
              name: 'ListClassSubject',
              params: { subjectId: scope.row.id }
            }"
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
        width="250"
        sortable="custom"
      >
      </el-table-column>
      <el-table-column
        prop="semester"
        label="Học kỳ"
        width="100"
        sortable="custom"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="number_of_class"
        label="Số lượng lớp"
        width="200"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.number_of_class == 0 ? 'danger' : 'primary'"
            :hit="true"
            size="medium"
            >{{ scope.row.number_of_class }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="" width="90">
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            @click.native.prevent="openFormEdit(scope.$index, scope.row)"-->
          <!--            type="primary"-->
          <!--            size="small"-->
          <!--            >Sửa-->
          <!--          </el-button>-->
          <el-button
            @click.native.prevent="openFormCreateClass(scope.$index, scope.row)"
            type="success"
            size="small"
            >Tạo lớp
          </el-button>
        </template>
      </el-table-column>
    </data-tables>

    <!--Form Class New-->
    <transition name="fade">
      <div class="form-box" v-if="formCreateClass">
        <div class="overlay" @click="formCreateClass = false"></div>
        <form
          @submit.prevent="createClass()"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Tạo lớp học mới</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataCreateClass.class.name }"
                v-model="dataCreateClass.class.name"
              />
              <label>
                Tên
                <span class="required">*</span>
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataCreateClass.class.description }"
                v-model="dataCreateClass.class.description"
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
              <el-select
                v-model="dataCreateClass.class.img"
                placeholder="Chọn chủ đề"
              >
                <el-option
                  v-for="(theme, index) in dataTheme"
                  :key="index"
                  :label="theme.name"
                  :value="theme.link"
                >
                </el-option>
              </el-select>
            </div>
            <div class="group-row block">
              <label class="title">
                Môn học:
                <span class="required">*</span>
              </label>
              <el-input
                :value="dataCreateClass.subject.name"
                :disabled="true"
                style="width: auto; display: inline-block"
              >
              </el-input>
            </div>
            <div class="group-row block">
              <label class="title">
                Học kỳ:
              </label>
              <el-input
                :value="dataCreateClass.class.semester"
                :disabled="true"
                style="width: auto; display: inline-block"
              >
              </el-input>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formCreateClass = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Tạo lớp học
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
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
      formCreateClass: false,
      dataCreateClass: {
        class: {
          name: "",
          description: "",
          img: "/assets/img/code.jpg",
          semester: "Học kỳ 1"
        },
        subject: {
          id: 0,
          name: "",
          description: "",
          number_of_class: 0
        }
      },
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
      ]
    };
  },
  methods: {
    dataTable() {
      // Nếu không từ khóa search
      if (!this.keySearch && this.filterSemester.length == 0)
        return this.$store.state.SUBJECT.allSubjects;
      let data = this.$store.state.SUBJECT.allSubjects;
      // Nếu lọc học kỳ
      if (this.filterSemester.length > 0) {
        data = data.filter(subject => {
          for (const key in this.filterSemester) {
            if (this.filterSemester[key] == subject.semester) {
              return true;
            }
          }
          return false;
        });
      }
      // Nếu có từ khóa keySearch
      if (this.keySearch) {
        data = data.filter(data => {
          for (let key in data) {
            if (
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
      return data;
    },
    createClass() {
      let token = localStorage.getItem("token_user");
      if (token) {
        let data = {
          name: this.dataCreateClass.class.name,
          description: this.dataCreateClass.class.description,
          img: this.dataCreateClass.class.img,
          subject_id: this.dataCreateClass.subject.id
        };
        this.$store
          .dispatch("apiCreateClassSubject", [token, data])
          .then(res => {
            if (res.data.status) {
              this.$message.success(res.data.message);
              let id = this.dataCreateClass.subject.id;
              let number_of_class =
                parseInt(this.dataCreateClass.subject.number_of_class) + 1;
              this.$store.commit("setDataAllSubjectKey", [
                id,
                "number_of_class",
                number_of_class
              ]);
              // reset value
              this.$set(this.dataCreateClass.class, "name", "");
              this.$set(this.dataCreateClass.class, "description", "");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            if (err.response.status == 422 && err.response.data.errors.name) {
              this.$message.error("Chưa nhập tên lớp");
            } else {
              this.$message.error("Không thể gửi yêu cầu đến máy chủ");
            }
          });
      }
    },
    openFormCreateClass(index, value) {
      console.log(value);
      this.$set(this.dataCreateClass, "subject", value);
      this.formCreateClass = true;
    }
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      // Có data rồi thì k cần gửi request nữa
      if (Object.keys(this.$store.getters.getAllSubjects).length == 0) {
        await this.$store
          .dispatch("apiGetAllSubjects", token)
          .then(res => {
            this.$store.commit("setDataAllSubject", res.data);
            this.loading = false;
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      } else {
        this.loading = false;
      }
      // Lọc học kỳ
      let timeNow = new Date();
      let month = timeNow.getMonth() + 1;
      if (month > 8 && month < 2) {
        this.filterSemester.push("1");
        this.dataCreateClass.class.semester = "Học kỳ 1";
      } else if (month > 1 && month < 7) {
        this.filterSemester.push("2");
        this.dataCreateClass.class.semester = "Học kỳ 2";
      }
      this.$router.options.nprogress.done();
    }
  }
};
</script>

<style lang="scss" scoped>
#subject-manager {
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
