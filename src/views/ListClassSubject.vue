<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div
    id="class-room"
    :class="{
      'display-grid-card': $store.state.CLASSSUBJECT.classSubjects.length > 0
    }"
  >
    <loading :z-index="1500" :loading="loading" />
    <h2 v-if="$store.state.CLASSSUBJECT.classSubjects.length < 1">
      Chưa tham gia lớp học nào
    </h2>
    <router-link
      v-else
      v-for="classSubject in filterClassSubjects()"
      :key="classSubject.id"
      :to="{ name: 'ClassSubject', params: { roomId: classSubject.id } }"
      custom
      v-slot="{ navigate, href }"
    >
      <a :href="href" @click="navigate">
        <card-subject :data-class="classSubject" />
      </a>
    </router-link>

    <div
      class="filter-class"
      v-if="$store.state.CLASSSUBJECT.classSubjects.length > 0"
    >
      <div class="left">
        <div class="filter-semester">
          <select v-model="optionFilter.semester">
            <option value="0">Tất cả</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
            <option value="3">Học kỳ 3</option>
          </select>
        </div>
      </div>
      <span class="mid"></span>
      <div class="right">
        <div class="filter-year">
          <select v-model="optionFilter.year">
            <option
              v-for="(item, index) in optionYear"
              :value="index"
              :key="index"
              >{{ item.label }}</option
            >
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardSubject from "@/components/template/card_subject.vue";
import Loading from "@/components/template/loading";
export default {
  props: ["subjectId"],
  data() {
    return {
      loading: true,
      optionYear: [
        {
          label: "Tất cả",
          start: 0,
          end: 9999
        }
      ],
      optionFilter: {
        semester: 0, // value học kỳ
        year: 0 // index optionYear
      }
    };
  },
  methods: {
    clickClassSubject: function(id) {
      this.$router.push({ name: "ClassSubject", params: { roomId: id } });
    },
    filterClassSubjects() {
      let classSubjects = this.$store.state.CLASSSUBJECT.classSubjects;
      // Lọc học kỳ
      if (this.optionFilter.semester != 0) {
        classSubjects = classSubjects.filter(cs => {
          if (cs.semester == this.optionFilter.semester) {
            return true;
          } else {
            return false;
          }
        });
      }
      // Lọc năm học
      if (this.optionFilter.year != 0) {
        classSubjects = classSubjects.filter(cs => {
          let date = new Date(cs.created_at);
          let year = date.getFullYear();
          if (cs.semester != 1) {
            year -= 1;
          }
          if (year == this.optionYear[this.optionFilter.year].start) {
            return true;
          } else {
            return false;
          }
        });
      }
      return classSubjects;
    }
  },
  components: {
    Loading,
    CardSubject
  },
  async created() {
    document.title = "Danh sách lớp học";
    let token = localStorage.getItem("token_user");
    if (token) {
      if (this.$store.getters.getUserRole) {
        await this.$store
          .dispatch("apiGetClassSubject", [token, this.subjectId])
          .then(res => {
            this.$store.commit("setDataClassSubject", res.data);
            this.$store.commit("setSubjectId", this.subjectId);
            this.loading = false;
          })
          .catch(() => {
            this.$message.error("Không thể gửi yêu cầu đến máy chủ");
          });
      } else {
        this.$store
          .dispatch("apiGetMyClassSubject", token)
          .then(res => {
            this.$store.commit("setDataClassSubject", res.data);
            this.loading = false;
          })
          .catch(() => {
            this.$message.error("Không thể gửi yêu cầu đến máy chủ");
          });
      }
    }

    // check tất cả năm học
    let arrOption = [];
    this.$store.getters.getClassSubject.forEach(value => {
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
    let newOption = [...this.optionYear, ...arrOption];
    this.$set(this, "optionYear", newOption);

    // set thời gian hiện tại
    let timeNow = new Date();
    let month = timeNow.getMonth() + 1;
    let year = timeNow.getFullYear();
    if (month > 8 && month < 2) {
      this.optionFilter.semester = "1";
      for (let i = 0; i < this.optionYear.length; i++) {
        if (this.optionYear[i].start == year) {
          this.optionFilter.year = i;
          break;
        }
      }
    } else {
      if (month > 1 && month < 7) {
        this.optionFilter.semester = "2";
      } else {
        this.optionFilter.semester = "3";
      }
      for (let i = 0; i < this.optionYear.length; i++) {
        if (this.optionYear[i].end == year) {
          this.optionFilter.year = i;
          break;
        }
      }
    }

    // $store.getters.getUserRole
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
#class-room {
  position: relative;
}
a {
  text-decoration: none;
  color: #000;
}

.filter-class {
  position: fixed;
  left: 30px;
  bottom: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  background-color: #0d6efd3a;
  padding: 10px;
  .left,
  .right {
    display: flex;
  }
  .mid {
    width: 10px;
    height: 2px;
    background-color: #000000;
    margin: 0px 4px;
  }
  select {
    padding: 6px 10px;
    border: none;
    outline: none;
    margin: 0px 3px;
  }
  option {
    padding: 6px 10px;
  }
}
</style>
