<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div
    id="subject"
    :class="{ 'display-grid-card': $store.state.SUBJECT.subjects.length > 0 }"
  >
    <loading z-index="1500" :loading="loading" />
    <h2 v-if="dataSubject().length < 1">
      Chưa có lớp học nào
    </h2>
    <router-link
      v-for="subject in dataSubject()"
      :key="subject.id"
      :to="{ name: 'ListClassSubject', params: { subjectId: subject.id } }"
      custom
      v-slot="{ navigate, href }"
    >
      <a :href="href" @click="navigate">
        <card-subject :dataSubject="subject" />
      </a>
    </router-link>

    <div class="filter-class" v-if="$store.state.SUBJECT.subjects.length > 0">
      <div class="left">
        <div class="filter-semester">
          <select v-model="filterSemester">
            <option value="0">Tất cả</option>
            <option value="1">Học kỳ 1</option>
            <option value="2">Học kỳ 2</option>
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
  data: function() {
    return {
      loading: true,
      filterSemester: 0
    };
  },
  methods: {
    dataSubject() {
      if (this.filterSemester == 0) {
        return this.$store.state.SUBJECT.subjects;
      } else {
        return this.$store.state.SUBJECT.subjects.filter(subject => {
          if (subject.semester == this.filterSemester) {
            return true;
          } else {
            return false;
          }
        });
      }
    }
  },
  components: {
    Loading,
    CardSubject
  },
  async beforeCreate() {
    document.title = "Danh sách môn học";
    this.$router.options.nprogress.set(0.7);
    await this.$store
      .dispatch("apiGetSubjectByUserId", localStorage.getItem("token_user"))
      .then(res => {
        this.$store.commit("setDataSubject", res.data);
      })
      .catch(() => {
        this.$message.error("Không thể gửi yêu cầu đến máy chủ");
      });
    this.$store.commit("setSubjectId", null);
    this.$router.options.nprogress.done();
    this.loading = false;
  },
  created() {
    let timeNow = new Date();
    let month = timeNow.getMonth() + 1;
    if (month > 8 && month < 2) {
      this.filterSemester = 1;
    } else if (month > 1 && month < 7) {
      this.filterSemester = 2;
    } else {
      this.filterSemester = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
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
