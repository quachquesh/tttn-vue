<template>
  <div class="grid wide">
    <div class="row">
      <div class="col c-12">
        <div
          class="classroom-banner"
          :style="{
            backgroundImage: 'url(' + $store.getters.getClassDetails.img + ')'
          }"
        >
          <div class="banner-body">
            <div class="class-banner-top">
              <h2 class="banner-title">
                {{ $store.getters.getClassDetails.name }}
              </h2>
              <h3 class="banner-description">
                {{ $store.getters.getClassDetails.description }}<br />
                {{
                  $store.getters.getSubjectDetails.name +
                    " (" +
                    $store.getters.getSubjectDetails.description +
                    ")"
                }}
              </h3>
              <div class="banner-class-key">
                <span class="key-title">Mã lớp: </span>
                <span class="key-content" id="class_key">{{
                  $store.getters.getClassDetails.key
                }}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Copy mã lớp"
                  placement="right"
                >
                  <span class="key-icon material-icons" @click="copyClassKey()"
                    >content_copy</span
                  >
                </el-tooltip>
              </div>
            </div>
            <div class="class-banner-bottom">
              <div class="banner-change-theme">chọn chủ đề</div>
              <div class="banner-upload">upload ảnh</div>
            </div>
          </div>
        </div>
        <div class="class-body">
          <div class="body-left">
            <div class="body-left__title">Sắp đến hạn</div>
            <div class="body-left__content">
              <div class="content-empty" v-if="dataBT == false">
                Tuyệt vời, không có bài tập nào sắp đến hạn!
              </div>
              <div class="list-content" v-else>
                <div class="content-item">
                  <div class="content-item__title">Hạn đến ngày mai</div>
                  <div class="content-item__time">23:59 - abc</div>
                </div>
                <div class="content-item">
                  <div class="content-item__title">Hạn đến ngày mai</div>
                  <div class="content-item__time">23:59 - abc</div>
                </div>
              </div>
            </div>
            <div class="btn-group">
              <div class="btn btn-link">Xem tất cả</div>
            </div>
          </div>
          <div class="body-right">
            <!--  -->
            <div
              class="post-notify-box"
              :class="{
                'notify-full': !postNotifyBox,
                'notify-collapse': postNotifyBox
              }"
            >
              <div
                class="post-notify-collapse"
                v-if="postNotifyBox"
                @click="postNotifyBox = false"
              >
                <div class="left">
                  <span class="icon">
                    <img src="/assets/img/hacker.png" />
                  </span>
                  <span class="content"
                    >Thông báo nội dung cho lớp học của bạn</span
                  >
                </div>
                <div class="right">
                  <span class="material-icons">history_edu</span>
                </div>
              </div>
              <div class="post-notify-full" v-else>
                <div class="header">
                  <div class="title">Dành cho</div>
                  <div class="select-options-box">
                    <span
                      class="select-box"
                      @click="showListMember = !showListMember"
                    >
                      <span class="content">Tất cả sinh viên</span>
                      <span class="material-icons">arrow_drop_down</span>
                    </span>
                    <transition name="fade" appear v-if="showListMember">
                      <ul class="select-options">
                        <li
                          class="option-item first"
                          @click="checkbox = !checkbox"
                        >
                          <span class="check-box">
                            <span class="material-icons" v-if="checkbox"
                              >check_box</span
                            >
                            <span class="material-icons" v-else
                              >check_box_outline_blank</span
                            >
                          </span>
                          <!--                          <span class="icon">-->
                          <!--                            <img src="/assets/img/hacker.png" />-->
                          <!--                          </span>-->
                          <span class="content">Tất cả học viên</span>
                        </li>

                        <li
                          v-for="member in $store.state.CLASSSUBJECTDETAILS
                            .classMembers"
                          :key="member.id"
                          class="option-item"
                          @click="checkbox = !checkbox"
                        >
                          <span class="check-box">
                            <span class="material-icons" v-if="checkbox"
                              >check_box</span
                            >
                            <span class="material-icons" v-else
                              >check_box_outline_blank</span
                            >
                          </span>
                          <span class="icon">
                            <img src="/assets/img/hacker.png" />
                          </span>
                          <span class="content"
                            >{{ member.first_name }}
                            {{ member.last_name }}</span
                          >
                        </li>
                      </ul>
                    </transition>
                  </div>
                </div>
                <div class="body" :class="{ active: notifyBody }">
                  <textarea
                    name=""
                    class="notify-content"
                    @input="notifyBody = $event.target.value != ''"
                  ></textarea>
                  <span class="line"></span>
                  <label>Nội dung thông báo cho lớp học</label>
                </div>
                <div class="footer">
                  <div class="left">
                    <div class="btn btn-light" @click="postNotifyFile($event)">
                      <span class="material-icons">attach_file</span>
                      <span class="content">Thêm</span>
                    </div>
                  </div>
                  <div class="right">
                    <div
                      class="btn btn-light"
                      @click="postNotifyCancel($event)"
                    >
                      Hủy
                    </div>
                    <div
                      class="btn btn-primary"
                      @click="postNotifyUpload($event)"
                    >
                      Đăng
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="list-notify">
              <div class="notify-box">
                <div class="notify-main">
                  <div class="header">
                    <div class="icon">
                      <img src="/assets/img/hacker.png" />
                    </div>
                    <div class="name-time">
                      <div class="name">Nguyễn Quốc Trung</div>
                      <div class="time">23 tháng 3</div>
                    </div>
                    <div class="dots" @click.stop="clickDots($event)">
                      <svg focusable="false" viewBox="0 0 24 24" class=" NMm5M">
                        <path
                          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        ></path>
                      </svg>
                      <ul class="list-menu">
                        <li class="item">Chỉnh sửa</li>
                        <li class="item">Xóa</li>
                      </ul>
                    </div>
                  </div>
                  <div class="content">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Harum, aliquam incidunt perferendis saepe laboriosam
                    obcaecati cupiditate, voluptates, consectetur non quaerat
                    in. Tenetur, excepturi tempora labore perspiciatis a
                    doloremque alias veniam. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Amet, blanditiis laborum.
                    Aliquid autem voluptate ipsum qui fugiat commodi ducimus!
                    Saepe itaque deserunt aliquam enim nisi quas tempora
                    similique asperiores tenetur.
                  </div>
                </div>
                <div class="notify-comment">
                  <div class="number-comment" @click="clickShowComment($event)">
                    <span class="material-icons">people_alt</span>
                    <div class="number">3 nhận xét về lớp học</div>
                  </div>
                  <div
                    class="comment-box"
                    v-for="(cmt, index) in dataComments"
                    :key="index"
                  >
                    <div class="left">
                      <img src="/assets/img/hacker.png" />
                    </div>
                    <div class="right">
                      <div class="name-time">
                        <span class="name">{{ cmt.name }}</span>
                        <span class="time">{{ cmt.time }}</span>
                      </div>
                      <span class="content">
                        {{ cmt.content }}
                      </span>
                    </div>
                    <span class="dots" @click.stop="clickDots($event)">
                      <svg focusable="false" viewBox="0 0 24 24" class=" NMm5M">
                        <path
                          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        ></path>
                      </svg>
                      <ul class="list-menu">
                        <li class="item">Chỉnh sửa</li>
                        <li class="item">Xóa</li>
                      </ul>
                    </span>
                  </div>
                  <div class="input-comment-box">
                    <div class="icon">
                      <img src="/assets/img/hacker.png" />
                    </div>
                    <div class="input-box">
                      <span
                        class="input"
                        role="textbox"
                        contenteditable="plaintext-only"
                        @input="commentInput($event)"
                      ></span>
                      <label>Thêm nhận xét của lớp học</label>
                      <span class="icon-send">
                        <svg
                          focusable="false"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          class=" NMm5M hhikbc"
                        >
                          <path
                            fill="currentColor"
                            d="M2 3v18l20-9L2 3zm2 11l9-2-9-2V6.09L17.13 12 4 17.91V14z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="exercise-box">
                Bài tập
              </div> -->
            </div>
          </div>
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
  data: function() {
    return {
      dataBT: [],
      postNotifyBox: true,
      checkbox: false,
      showListMember: false,
      notifyBody: false,
      dataComments: [
        {
          name: "Nguyễn Quốc Trung",
          time: "20:23",
          content: "comment bla bla"
        },
        {
          name: "Nguyễn Quốc Trung 2",
          time: "23:11 2 tháng 3",
          content: `comment bla bla comment bla bla comment bla bla comment bla bla comment bla bla comment bla bla comment bla bla comment bla bla`
        },
        {
          name: "Nguyễn Quốc Trung 3",
          time: "20:23",
          content: "comment bla bla asdsad sa dsa sda"
        }
      ]
    };
  },
  methods: {
    toast() {
      let type = Math.floor(Math.random() * 4);
      this.$customjs.showToast({
        title: "Lỗi đăng nhập",
        message: "Tên tài khoản hoặc mật khẩu không chính xác",
        type: type,
        time: 3000
      });
    },
    copyClassKey() {
      navigator.clipboard
        .writeText(this.$store.getters.getClassDetails.key)
        .then(
          () => {
            this.$customjs.showToast({
              title: "Thành công",
              message: "Copy mã lớp thành công"
            });
          },
          () => {
            this.$customjs.showToast({
              title: "Lỗi",
              message: "Copy mã lớp thất bại",
              type: 1
            });
          }
        );
    },
    postNotifyFile() {},
    postNotifyCancel(event) {
      this.postNotifyBox = true;
      this.notifyBody = false;
      this.$customjs.clickBtnAnimation(event);
    },
    postNotifyUpload(event) {
      this.$customjs.clickBtnAnimation(event);
    },
    commentInput(event) {
      if (!event.target.innerText) {
        event.target.parentElement.classList.remove("valid");
      } else {
        event.target.parentElement.classList.add("valid");
      }
    },
    clickDots(event) {
      let element = event.target;
      while (!element.classList.contains("dots")) {
        element = element.parentElement;
      }
      element.classList.toggle("active");
    },
    clickShowComment(event) {
      if (event.target.classList.contains("number-comment"))
        event.target.classList.toggle("active");
      else event.target.parentElement.classList.toggle("active");
    }
  },
  created() {
    document.title = "Bảng tin lớp";
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.classroom-banner {
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 15px;
  color: #fff;
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to bottom,
      rgba(#fff, 0.2) -10%,
      rgba(#fff, 0) 120%
    );
    z-index: 1;
  }
  .banner-body {
    position: relative;
    z-index: 2;
    .class-banner-top {
      width: 100%;
      padding: 15px 10px;
      .banner-title {
        font-weight: 700;
        font-size: 32px;
      }
      .banner-description {
        font-weight: 400;
        font-size: 20px;
        margin-top: 5px;
      }
      .banner-class-key {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 5px;
        .key-title {
          font-weight: 500;
          margin-right: 8px;
        }
        .key-content {
          font-weight: 400;
          font-size: 16px;
        }
        .key-icon {
          margin-left: 2px;
          cursor: pointer;
          user-select: none;
          font-size: 20px;
          padding: 8px;
          transition: 0.2s linear;
          &:hover {
            background-color: rgba(#c4c4c4, 0.1);
            border-radius: 50%;
          }
          &:active {
            background-color: rgba(#929292, 0.4);
          }
        }
      }
    }

    .class-banner-bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 5px 10px;
      margin-top: 20px;
      font-size: 14px;
      .banner-change-theme {
        margin-bottom: 5px;
      }
      .banner-change-theme,
      .banner-upload {
        cursor: pointer;
        user-select: none;
        transition: linear 0.15s;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.class-body {
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
  align-items: flex-start;
  .body-left {
    min-width: 220px;
    max-width: 220px;
    margin-right: 30px;
    border-radius: 10px;
    box-shadow: 0px 0px 3px rgba(#000, 0.3);
    padding: 22px;
    .body-left__title {
      font-weight: 500;
      color: #5c5c5c;
    }
    .body-left__content {
      color: #7c7c7c;
      font-size: 14px;
      .content-empty {
        margin: 20px 0px;
        font-size: 12px;
        line-height: 18px;
      }
      .list-content {
        .content-item {
          border-bottom: 1px solid #d8d8d8;
          padding: 20px 0px;
          color: #737373;
          font-size: 13px;
          &:last-child {
            border-bottom: none;
          }
          .content-item__title {
          }
          .content-item__time {
            margin-top: 5px;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: var(--color-primary);
            }
          }
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: flex-end;
      .btn.btn-link {
        padding: 0;
        font-size: 15px;
        text-transform: unset;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .body-right {
    flex: 1;
    .post-notify-box {
      box-shadow: 0px 0px 3px rgba(#000, 0.1), 0px 0px 10px rgba(#000, 0.2);
      border-radius: 10px;
      box-sizing: border-box;
      height: 72px;
      transition: linear 0.3s;
      &.notify-full {
        height: auto;
      }
      &:hover {
        box-shadow: 0px 0px 4px rgba(#000, 0.2), 0px 0px 13px rgba(#000, 0.3);
        .post-notify-collapse {
          .left {
            .content {
              color: var(--color-primary);
            }
          }
        }
      }
      @mixin post-notify {
        padding: 15px 25px;
        height: 100%;
        width: 100%;
      }
      .post-notify-collapse {
        @include post-notify;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
        .left {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .icon {
            height: 100%;
            margin-right: 20px;
            img {
              border-radius: 50%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          }
          .content {
            color: #7c7c7c;
            font-size: 13px;
          }
        }
        .right {
          color: #7c7c7c;
        }
      }
      .post-notify-full {
        @include post-notify;
        padding: 25px;
        .header {
          .title {
            font-weight: 500;
            color: #777777;
            font-size: 15px;
          }
          .select-options-box {
            position: relative;
            margin-top: 10px;
            .select-box {
              display: flex;
              // justify-content: center;
              align-items: center;
              padding: 8px 8px 8px 16px;
              background-color: #f8f8f8;
              border-radius: 5px;
              cursor: pointer;
              user-select: none;
              width: 150px;
              &:hover {
                background-color: #e4e4e4;
              }
              .content {
                width: 80%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 8px 0px;
                font-size: 14px;
              }
              .material-icons {
                flex: 1;
              }
            }
            .select-options {
              position: absolute;
              z-index: 10;
              left: 0;
              bottom: 0;
              list-style: none;
              transform: translateY(100%);
              width: 250px;
              height: 240px;
              overflow: auto;
              background-color: #fff;
              padding: 8px 0px;
              border-radius: 5px;
              box-shadow: 0px 0px 2px rgba(#000, 0.3),
                0px 0px 5px rgba(#000, 0.1), 0px 2px 2px rgba(#000, 0.3);
              .option-item {
                padding: 12px 15px;
                // height: 40px;
                display: flex;
                align-items: center;
                user-select: none;
                cursor: pointer;
                background-color: #fff;
                &:hover {
                  background-color: #e4e4e4;
                }
                .check-box {
                  color: #696969;
                }
                .icon {
                  height: 100%;
                  padding: 0px 14px;
                  img {
                    border-radius: 50%;
                    height: 32px;
                  }
                }
                &.first {
                  .content {
                    margin-left: 24px;
                    font-weight: 500;
                    font-size: 15px;
                  }
                }
                .content {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  flex: 1;
                  font-size: 14px;
                  color: #757575;
                  font-weight: 500;
                }
              }
            }
          }
        }
        .body {
          width: 100%;
          margin-top: 20px;
          position: relative;
          overflow: hidden;
          border-radius: 5px;
          background-color: #f8f8f8;

          &.active {
            label {
              top: 8px;
              font-size: 13px;
            }
          }
          .notify-content {
            background-color: transparent;
            resize: none;
            height: 128px;
            width: 100%;
            padding: 0 16px 9px;
            margin-top: 28px;
            overflow: hidden;
            border-radius: 5px;
            border: none;
            outline: none;
            position: relative;
            font-size: 16px;
            &:focus {
              border: none;
              outline: none;
              & ~ .line {
                background-color: var(--color-primary);
                height: 2px;
              }
              & ~ label {
                top: 8px;
                font-size: 13px;
                color: var(--color-primary);
              }
            }
          }
          .line {
            z-index: 1;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #000;
            transition: linear 0.2s;
            will-change: height;
          }
          label {
            position: absolute;
            left: 16px;
            top: 23px;
            pointer-events: none;
            color: #727272;
            transition: linear 0.2s;
          }
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          .btn {
            padding: 6px 12px;
            font-size: 16px;
            text-transform: unset;
            font-weight: 400;
          }
          .left {
            flex: 1;
            .btn.btn-light {
              box-shadow: 0px 0px 2px rgba(#000, 0.4);
              display: inline-flex;
              justify-content: space-between;
              align-items: center;
              color: var(--color-primary);
              .material-icons {
                font-size: 18px;
              }
              .content {
                font-weight: 500;
                padding-left: 4px;
              }
            }
          }
          .right {
            display: flex;
            align-items: center;
            .btn-light {
              margin-right: 10px;
            }
            .btn-primary {
              padding: 6px 20px;
              font-weight: 500;
            }
          }
        }
      }
    }

    .list-notify {
      width: 100%;
      margin-top: 10px;
      .notify-box {
        margin: 20px 0;
        width: 100%;
        box-shadow: 0px 0px 5px rgba(#000, 0.2);
        border-radius: 5px;
        font-size: 14px;
        .notify-main {
          width: 100%;
          padding: 16px 15px 24px 25px;
          border-bottom: 1px solid #dcdcdc;
          .header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 56px;
            padding: 5px 0;
            .icon {
              height: 100%;
              img {
                height: 100%;
                object-fit: cover;
                object-position: center;
                border-radius: 50%;
              }
            }
            .name-time {
              flex: 1;
              font-size: 14px;
              color: #555;
              margin-left: 15px;
              .name {
                font-weight: 500;
              }
              .time {
                margin-top: 4px;
              }
            }
            .dots {
              width: 36px;
              cursor: pointer;
              padding: 6px 8px;
              border-radius: 50%;
              transition: linear 0.1s;
              user-select: none;
              position: relative;
              svg {
                width: 20px;
                height: 20px;
                path {
                  transition: linear 0.1s;
                }
              }
              &:hover {
                background-color: #ececec;
                path {
                  fill: var(--color-primary);
                }
              }
              &:active {
                background-color: #dcdcdc;
              }

              &.active {
                background-color: #dcdcdc;
                &:hover,
                &:active {
                  background-color: #dcdcdc;
                }
                .list-menu {
                  transform: translateY(0px);
                  opacity: 1;
                  visibility: unset;
                  transition: linear 0.3s;
                }
              }

              .list-menu {
                position: absolute;
                list-style: none;
                z-index: 2;
                top: 100%;
                right: 5px;
                width: max-content;
                background-color: #fff;
                box-shadow: 0px 0px 4px rgba(#444, 0.1),
                  0px 0px 7px rgba(#444, 0.2), 0px 2px 2px rgba(#222, 0.3);
                padding: 8px 0px;
                border-radius: 5px;
                transform: translateY(20px);
                opacity: 0;
                visibility: hidden;
                transition: linear 0.2s;
                .item {
                  padding: 8px 48px 8px 16px;
                  &:hover {
                    background-color: #ececec;
                  }
                  &:active {
                    background-color: #dcdcdc;
                  }
                }
              }
            }
          }
          .content {
            margin-top: 8px;
            // text-align: justify;
            font-size: 14px;
            line-height: 20px;
            margin-right: 12px;
          }
        }
        .notify-comment {
          margin-top: 10px;
          .number-comment {
            padding: 6px 16px;
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            user-select: none;
            cursor: pointer;
            margin-bottom: 2px;
            margin-left: 14px;
            border-radius: 5px;
            &:hover {
              background-color: #efefef;
            }
            &:active {
              background-color: #dcdcdc;
            }
            .material-icons {
              color: #555;
            }
            .number {
              margin-left: 10px;
            }
          }

          .number-comment.active ~ .comment-box {
            display: flex;
          }
          div:nth-last-child(2) {
            display: flex;
          }

          .comment-box {
            padding: 0px 32px 0px 24px;
            display: none;
            justify-content: flex-start;
            position: relative;
            &:hover {
              .dots {
                opacity: 1;
              }
            }
            .left {
              padding: 12px 0;
              img {
                height: 36px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
              }
            }
            .right {
              padding: 12px 0px;
              margin-left: 14px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .name-time {
                color: #555;
                .name {
                  font-weight: 500;
                }
                .time {
                  margin-left: 14px;
                }
              }
              .content {
                margin-top: 6px;
                margin-right: 16px;
              }
            }
            .dots {
              position: absolute;
              right: 12px;
              border-radius: 50%;
              top: 6px;
              padding: 6px 8px;
              cursor: pointer;
              opacity: 0;
              user-select: none;
              &:hover {
                background-color: rgba(184, 184, 184, 0.2);
              }
              &:active {
                background-color: #dcdcdc;
              }
              svg {
                width: 20px;
                height: 20px;
              }

              &.active {
                background-color: #dcdcdc;
                opacity: 1;
                &:hover,
                &:active {
                  background-color: #dcdcdc;
                }
                .list-menu {
                  transform: translateY(0px);
                  opacity: 1;
                  visibility: unset;
                  transition: linear 0.3s;
                }
              }

              .list-menu {
                position: absolute;
                z-index: 2;
                list-style: none;
                top: 100%;
                right: 5px;
                width: max-content;
                background-color: #fff;
                box-shadow: 0px 0px 4px rgba(#444, 0.1),
                  0px 0px 7px rgba(#444, 0.2), 0px 2px 2px rgba(#222, 0.3);
                padding: 8px 0px;
                border-radius: 5px;
                transform: translateY(20px);
                opacity: 0;
                visibility: hidden;
                transition: linear 0.2s;
                .item {
                  padding: 8px 48px 8px 16px;
                  &:hover {
                    background-color: #ececec;
                  }
                  &:active {
                    background-color: #dcdcdc;
                  }
                }
              }
            }
          }

          .input-comment-box {
            padding: 14px 25px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            border-top: 1px solid #dcdcdc;
            user-select: none;
            .icon {
              height: 36px;
              img {
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
                object-position: center;
              }
            }
            .input-box {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              position: relative;
              margin-left: 14px;
              flex: 1;
              &.valid {
                label {
                  display: none;
                }
                .icon-send {
                  color: var(--color-primary);
                }
              }
              .input {
                border-radius: 20px;
                width: 100px;
                flex: 1;
                position: relative;
                outline: none;
                user-select: text;
                white-space: pre-wrap;
                overflow-wrap: break-word;
                // height: 36px;
                cursor: text;
                padding: 10px 18px;
                font-size: 14px;
                border: 2px solid rgba(#000, 0.1);
                &:focus {
                  outline: none;
                  border: 2px solid var(--color-primary);
                }
              }
              label {
                position: absolute;
                left: 21px;
                top: 50%;
                transform: translateY(-50%);
                color: #777;
                pointer-events: none;
                font-size: 14px;
              }
              .icon-send {
                position: absolute;
                bottom: 6px;
                right: 12px;
                color: #777;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>
