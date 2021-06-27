<template>
  <div id="group-class-subject">
    <div class="grid wide">
      <div class="row">
        <div class="col c-12">
          <div class="form-box">
            <div class="form-navbar">
              <ul class="list-menu">
                <router-link
                  :to="{ name: 'Group' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Nhóm
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'GroupMembers' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Thành viên
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'ListGroups' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                  >
                    Danh sách nhóm
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'Approves' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                    v-if="
                      $store.state.CLASSSUBJECTDETAILS.group.isGroupLeader ||
                        $store.getters.getUserRole
                    "
                  >
                    Phê duyệt
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'Settings' }"
                  custom
                  v-slot="{ navigate, isExactActive }"
                >
                  <li
                    class="item"
                    :class="isExactActive && 'active'"
                    @click="navigate"
                    v-if="$store.getters.getUserRole"
                  >
                    Cài đặt
                  </li>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="group-body" style="margin-top: 30px">
      <transition name="slide-left" mode="out-in" appear>
        <router-view
          :isJoinGroup="$store.state.CLASSSUBJECTDETAILS.group.isJoinGroup"
          :isGroupLeader="$store.state.CLASSSUBJECTDETAILS.group.isGroupLeader"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import apiGroup from "@/api/group.js";

export default {
  props: {
    roomId: {
      required: true
    }
  },
  methods: {
    createGroup(data) {
      this.$store.commit("createGroup", data);
    },
    updateNotify(e) {
      this.$store.commit("updateGroupNotify", e);
    },
    deleteNotify(index) {
      this.$store.commit("deleteGroupNotify", index);
    },
    updateNotifyReply(event) {
      this.$store.commit("updateGroupNotifyReply", event);
    },
    deleteNotifyReply(event) {
      this.$store.commit("deleteGroupNotifyReply", event);
    },
    deleteMyGroup() {
      this.$store.commit("deleteMyGroup");
    },
    updateMyGroup(data) {
      this.$store.commit("updateMyGroup", data);
    },
    seeGroupDetails(data) {
      this.$store.commit("setDataMyGroup", data);
    }
  },
  async created() {
    let token = localStorage.getItem("token_user");
    if (token) {
      if (
        !this.$store.getters.getUserRole &&
        Object.keys(this.$store.getters.getMyGroup).length == 0
      ) {
        await apiGroup.getMyGroup(token, this.roomId).then(res => {
          if (Object.keys(res.data).length == 0) {
            this.$store.commit("deleteMyGroup");
          } else {
            this.$store.commit("setDataMyGroup", {
              data: res.data,
              isJoinGroup: true
            });
            this.$store.getters.getMyGroup.members.forEach(member => {
              if (
                member.id == this.$store.getters.getUserId &&
                member.role == 1
              ) {
                this.$store.state.CLASSSUBJECTDETAILS.group.isGroupLeader = true;
              }
            });
          }
        });
      }
    }
    document.title = "Nhóm lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.form-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  .list-menu {
    list-style: none;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    .item {
      width: max-content;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      cursor: pointer;
      user-select: none;
      transition: linear 0.2s;
      border-bottom: 1px solid var(--color-primary);
      &.active {
        color: #000;
        background-color: rgba(#1266f1, 0.3);
        &:hover {
          background-color: rgba(#1266f1, 0.3);
        }
      }
      &:hover {
        background-color: rgba(#1266f1, 0.1);
      }
      &:active {
        background-color: rgba(#1266f1, 0.2);
      }
    }
  }
}

.create-user-body {
  margin-top: 32px;
}
@media (max-width: 739px) {
  .form-navbar {
    justify-content: flex-start;
  }
}
</style>
