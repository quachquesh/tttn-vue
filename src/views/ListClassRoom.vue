<template>
  <div id="class-room" class="display-grid-card">
    <div
      v-for="classRoom in classRooms"
      :key="classRoom.id"
      @click="clickClassRoom(classRoom.id)"
    >
      <card-subject :dataCard="classRoom" />
    </div>
  </div>
</template>

<script>
import CardSubject from "@/components/template/card_subject.vue";
export default {
  data() {
    return {
      classRooms: [
        {
          id: 1,
          title: "D17_TH01",
          description: "Thực hành: Lập trình ứng dụng web",
          times: ["Thứ 3: ca 1", "Thứ 4: ca 2, 3"]
        },
        {
          id: 2,
          title: "D17_TH02",
          description: "Thực hành: Nhập môn lập trình",
          times: ["Thứ 3: ca 1", "Thứ 4: ca 2, 3"]
        },
        {
          id: 3,
          title: "D17_TH03",
          description: "abc xyz",
          times: ["Thứ 3: ca 1", "Thứ 4: ca 2, 3"]
        }
      ]
    };
  },
  methods: {
    clickClassRoom: function(id) {
      this.$router.push({
        name: "ClassRoom",
        params: {
          roomId: id
        }
      });
    }
  },
  components: {
    CardSubject
  },
  created() {
    document.title = "Danh sách lớp học";
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped></style>
