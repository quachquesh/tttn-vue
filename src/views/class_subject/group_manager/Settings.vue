<template>
  <div id="group-settings" class="grid" style="padding: 0 10%">
    <div class="row">
      <div class="col c-6 c-o-3 setting-body">
        <div class="item">
          <span>Mở sinh viên tự tạo nhóm</span>
          <el-switch
            v-model="dataSetting.isOpenCreateGroup"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <div class="item">
          <span>Thành viên nhóm tối đa</span>
          <el-input-number
            v-model="dataSetting.groupMembers"
            :min="1"
            size="small"
          ></el-input-number>
        </div>
        <div class="item">
          <span>Thời gian đăng ký</span>
          <el-date-picker
            v-model="dataSetting.setting_group_date_end"
            type="date"
            placeholder="Chọn một ngày"
            format="dd/MM/yyyy"
            size="small"
            width="100px"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col c-6 c-o-3 btn-apply">
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
      dataSetting: {
        isOpenCreateGroup: false,
        groupMembers: 1,
        setting_group_date_end: "2021-05-28"
      },
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return time.getTime() < date.getTime() - 3600 * 1000 * 24;
        },
        shortcuts: [
          {
            text: "Hôm nay",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "Ngày mai",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "1 tuần sau",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  methods: {
    saveChange() {
      let token = localStorage.getItem("token_user");
      if (token) {
        let date = new Date(this.dataSetting.setting_group_date_end);
        let setting_group_date_end =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();
        apiClassSubject
          .update(token, this.roomId, {
            maximum_group_member: this.dataSetting.groupMembers,
            student_create_group: this.dataSetting.isOpenCreateGroup,
            setting_group_date_end: setting_group_date_end
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
  beforeCreate() {
    this.$router.options.nprogress.set(0.7);
  },
  created() {
    if (this.$store.getters.getClassDetails.maximum_group_member) {
      let classDetails = this.$store.getters.getClassDetails;
      this.dataSetting.isOpenCreateGroup = !!classDetails.student_create_group;
      this.dataSetting.groupMembers = classDetails.maximum_group_member;
      this.dataSetting.setting_group_date_end =
        classDetails.setting_group_date_end;
    } else {
      let check = setInterval(() => {
        if (this.$store.getters.getClassDetails.maximum_group_member) {
          let classDetails = this.$store.getters.getClassDetails;
          this.dataSetting.isOpenCreateGroup = !!classDetails.student_create_group;
          this.dataSetting.groupMembers = classDetails.maximum_group_member;
          this.dataSetting.setting_group_date_end =
            classDetails.setting_group_date_end;
          clearInterval(check);
        }
      }, 500);
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style scoped lang="scss">
#group-settings {
  .setting-body {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 24px 16px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .btn-apply {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 8px;
  }
}
</style>
