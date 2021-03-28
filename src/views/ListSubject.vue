<template>
  <div id="subject" class="display-grid-card">
    <div
      v-for="subject in subjects"
      :key="subject.id"
      @click="clickSubject(subject.id)"
    >
      <card-subject :dataCard="subject" />
    </div>
  </div>
</template>

<script>
import CardSubject from "@/components/template/card_subject.vue";
export default {
  data: function() {
    return {
      subjects: [
        {
          id: 1,
          title: "Quản trị cơ sở dữ liệu Quản trị cơ sở dữ liệu ",
          description: "abc xyz"
        },
        {
          id: 2,
          title: "Nhập môn lập trình",
          description: "abc xyz"
        },
        {
          id: 3,
          title: "Thực hành: Lập trình web",
          description: "abc xyz"
        },
        {
          id: 4,
          title: "Nhập môn lập trình",
          description: "abc xyz"
        },
        {
          id: 5,
          title:
            "Thực hành: Lập trình web Thực hành: Lập trình web Thực hành: Lập trình web",
          description: "abc xyz"
        }
      ]
    };
  },
  methods: {
    clickSubject(id) {
      this.$router.push({ name: "ListClassRoom", params: { subjectId: id } });
    }
  },
  components: {
    CardSubject
  },
  created() {
    document.title = "Danh sách môn học";
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped></style>
