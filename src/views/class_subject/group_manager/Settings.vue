<template>
  <div id="group-settings" class="grid" style="padding: 0 10%">
    <div class="row">
      <div class="col c-4 c-o-4 setting-body">
        <div class="item">
          <span>Mở sinh viên tự tạo nhóm</span>
          <el-switch
            v-model="isOpenCreateGroup"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <div class="item">
          <span>Thành viên nhóm tối đa</span>
          <el-input-number
            v-model="groupMembers"
            :min="1"
            size="small"
          ></el-input-number>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col c-4 c-o-4 btn-apply">
        <el-button
          type="success"
          icon="el-icon-check"
          size="medium"
          @click="saveChange"
          >Lưu cài đặt</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import apiClassSubject from "@/api/classSubject";
export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      isOpenCreateGroup: false,
      groupMembers: 1
    };
  },
  methods: {
    saveChange() {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiClassSubject
          .update(token, this.roomId, {
            maximum_group_member: this.groupMembers,
            student_create_group: this.isOpenCreateGroup
          })
          .then(res => {
            if (res.data.status) {
              this.$store.commit("setClassSubjectDetails", res.data.data);
              this.$customjs.showToast({
                title: "Cập nhật cài đặt",
                message: "Lưu cài đặt thành công"
              });
            } else {
              this.$customjs.showToast({
                title: "Cập nhật cài đặt",
                message: res.data.message,
                type: 1
              });
            }
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    }
  },
  created() {
    if (this.$store.getters.getClassDetails.maximum_group_member) {
      let classDetails = this.$store.getters.getClassDetails;
      this.isOpenCreateGroup = !!classDetails.student_create_group;
      this.groupMembers = classDetails.maximum_group_member;
    } else {
      let check = setInterval(() => {
        if (this.$store.getters.getClassDetails.maximum_group_member) {
          let classDetails = this.$store.getters.getClassDetails;
          this.isOpenCreateGroup = !!classDetails.student_create_group;
          this.groupMembers = classDetails.maximum_group_member;
          clearInterval(check);
        }
      }, 500);
    }
  }
};
</script>

<style scoped lang="scss">
#group-settings {
  .setting-body {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  }
  .btn-apply {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
