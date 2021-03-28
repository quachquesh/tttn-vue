<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12 lecturer-group">
        <div class="header">
          <h2>Giảng viên</h2>
        </div>
        <ul class="list-lecturers">
          <li class="item">
            <span class="avt">
              <img src="/assets/img/hacker.png" />
            </span>
            <span class="name">Nguyễn Quốc Trung</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col c-12 student-group">
        <div class="header">
          <h2>Sinh viên</h2>
          <span class="add-student">
            <span class="number-student">2 Sinh viên</span>
            <span class="material-icons">person_add_alt</span>
          </span>
        </div>
        <ul class="list-students">
          <li class="item first">
            <div class="left">
              <input type="checkbox" />
              <span class="select-option">
                <span class="select-box" @click="clickSelectBox($event)">
                  <span class="content">Tác vụ</span>
                  <span class="material-icons">expand_more</span>
                </span>
                <ul class="list-option">
                  <li class="option">option 1 option 1</li>
                  <li class="option">option 2</li>
                  <li class="option">option 3</li>
                  <li class="option">option 4</li>
                  <li class="option">option 5</li>
                </ul>
              </span>
            </div>
            <div class="right">
              <span class="material-icons">sort_by_alpha</span>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <input type="checkbox" />
              <span class="avt">
                <img src="/assets/img/hacker.png" />
              </span>
              <span class="name">Nguyễn Quốc Trung</span>
            </div>
            <div class="right">
              <span class="dots">
                <svg focusable="false" viewBox="0 0 24 24" class="NMm5M">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  ></path>
                </svg>
              </span>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <input type="checkbox" />
              <span class="avt">
                <img src="/assets/img/hacker.png" />
              </span>
              <span class="name">Nguyễn Quốc Trung</span>
            </div>
            <div class="right">
              <span class="dots">
                <svg focusable="false" viewBox="0 0 24 24" class="NMm5M">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  ></path>
                </svg>
              </span>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <input type="checkbox" />
              <span class="avt">
                <img src="/assets/img/hacker.png" />
              </span>
              <span class="name">Nguyễn Quốc Trung</span>
            </div>
            <div class="right">
              <span class="dots">
                <svg focusable="false" viewBox="0 0 24 24" class="NMm5M">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  ></path>
                </svg>
              </span>
            </div>
          </li>
          <li class="item">
            <div class="left">
              <input type="checkbox" />
              <span class="avt">
                <img src="/assets/img/hacker.png" />
              </span>
              <span class="name">Nguyễn Quốc Trung</span>
            </div>
            <div class="right">
              <span class="dots">
                <svg focusable="false" viewBox="0 0 24 24" class="NMm5M">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  ></path>
                </svg>
              </span>
            </div>
          </li>
        </ul>
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
  methods: {
    clickSelectBox(event) {
      let element = event.target;
      while (!element.classList.contains("select-option")) {
        element = element.parentElement;
      }
      element.querySelector(".list-option").classList.toggle("active");
    }
  },
  created() {
    document.title = `Lớp ${this.$route.params.roomId} - Thành viên`;
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .grid.wide {
    width: 800px;
  }
}
.lecturer-group {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-weight: 400;
      font-size: 30px;
      color: var(--color-primary);
    }
    border-bottom: 1px solid var(--color-primary);
    padding: 18px;
  }
  .list-lecturers {
    list-style: none;
    margin-top: 6px;
    .item {
      display: flex;
      // justify-content: center;
      align-items: center;
      padding: 8px 0px;
      .avt {
        margin: 0px 16px;
        img {
          height: 40px;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
        }
      }
      .name {
        color: #777;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.student-group {
  margin-top: 24px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-weight: 400;
      font-size: 30px;
      color: var(--color-primary);
    }
    .add-student {
      display: flex;
      align-items: center;
      .number-student {
        font-size: 16px;
        color: var(--color-primary);
        margin-right: 20px;
      }
      .material-icons {
        font-size: 30px;
        color: var(--color-primary);
        cursor: pointer;
        user-select: none;
      }
    }
    border-bottom: 1px solid var(--color-primary);
    padding: 18px;
  }
  .list-students {
    list-style: none;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0px;
      &.first {
        .select-option {
          position: relative;
          .select-box {
            border: 1px solid #dcdcdc;
            padding: 4px 14px;
            display: block;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 28px;
            cursor: pointer;
            user-select: none;
          }
          .list-option {
            position: absolute;
            list-style: none;
            top: 100%;
            left: 28px;
            padding: 8px 0px;
            width: max-content;
            background-color: #fff;
            box-shadow: 0px 2px 2px rgba(#000, 0.3), 0px 2px 5px rgba(#000, 0.3);
            user-select: none;
            transform: translateY(30px);
            opacity: 0;
            visibility: hidden;
            transition: linear 0.3s;
            &.active {
              transform: translateY(0px);
              opacity: 1;
              visibility: unset;
            }
            cursor: pointer;
            .option {
              padding: 8px 32px 8px 16px;
              &:hover {
                background-color: #ececec;
              }
              &:active {
                background-color: #dcdcdc;
              }
            }
          }
        }
        .right {
          height: 100%;
          .material-icons {
            cursor: pointer;
            user-select: none;
          }
        }
      }
      .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }
        .avt {
          height: 36px;
          margin-left: 28px;
          margin-right: 16px;
          img {
            border-radius: 50%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
        }
        .name {
          font-size: 14px;
          font-weight: 500;
          color: #777;
        }
      }
      .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .dots {
          width: 24px;
          cursor: pointer;
          user-select: none;
          svg {
          }
        }
      }
    }
  }
}
</style>
