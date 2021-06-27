<template>
  <div id="group-members" class="grid wide">
    <div class="row">
      <div
        class="col l-8 l-o-2 c-12"
        v-if="
          Object.keys(this.$store.state.CLASSSUBJECTDETAILS.group.myGroup)
            .length == 0
        "
      >
        Chưa có nhóm
      </div>
      <div class="col l-8 l-o-2 c-12" v-else>
        <div
          class="list-members"
          :class="{ 'show-details': index == showDetails }"
          v-for="(member, index) in this.$store.state.CLASSSUBJECTDETAILS.group
            .myGroup.members"
          :key="member.id"
        >
          <div class="member">
            <div class="member-info">
              <div class="full-name">
                {{ member.first_name + " " + member.last_name }}
                <i
                  class="el-icon-star-on"
                  style="color: #e3db00; font-size: 21px;"
                  v-if="member.role == 1"
                ></i>
              </div>
              <div class="class-room">{{ member.classroom }}</div>
            </div>
            <span class="btn-details" @click="clickShowDetails(index)">
              Chi tiết
              <i
                :class="{
                  'el-icon-caret-top': index == showDetails,
                  'el-icon-caret-bottom': index != showDetails
                }"
              ></i>
            </span>
          </div>
          <transition
            name="height"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            appear
          >
            <div class="member-details" v-show="showDetails == index">
              <div>MSSV: {{ member.mssv }}</div>
              <div>Email: {{ member.email }}</div>
              <div>Số điện thoại: {{ member.phone_number }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      showDetails: -1
    };
  },
  methods: {
    clickShowDetails(index) {
      if (this.showDetails == index) {
        this.showDetails = -1;
      } else {
        this.showDetails = index;
      }
    },
    enter(element) {
      const curHeight = getComputedStyle(element).height;
      element.style.width = getComputedStyle(element).width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;

      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = curHeight;

      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    },
    leave(element) {
      const height = getComputedStyle(element).height;

      element.style.height = height;

      getComputedStyle(element).height;

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    }
  },
  beforeCreate() {
    this.$router.options.nprogress.set(0.7);
  },
  created() {
    if (
      this.$store.getters.getUserRole &&
      Object.keys(this.$store.getters.getMyGroup).length == 0
    ) {
      this.$router.push({ name: "ListGroups" });
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style scoped lang="scss">
.list-members {
  margin-bottom: 10px;
  font-size: 18px;
  padding: 16px 16px 0;
  border-radius: 10px;
  transition: 0.3s linear;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #ffffff;
  &.show-details {
    box-shadow: 0 0 3px rgba(#000, 0.1), 0 0 10px rgba(#000, 0.2);
    padding: 16px;
    transition: 0.3s linear;
  }
  .member {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    .member-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      margin-right: 60px;
    }
    .btn-details {
      cursor: pointer;
      user-select: none;
      color: var(--color-primary);
    }
  }
  .member-details {
    transition: height 0.3s ease-in-out;
    height: 0;
    div {
      padding: 2px 0;
      overflow-wrap: anywhere;
      &.null {
        color: red;
      }
    }
  }
}

@media (max-width: 770px) {
  .list-members {
    .member {
      .member-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;
        margin-right: 10px;
        .class-room {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
