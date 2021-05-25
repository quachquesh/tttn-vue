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
                @click="showNotifyBox()"
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
                  <div
                    class="select-options-box"
                    :class="{ disable: !$store.getters.getUserRole }"
                    @clickout="showListMember = false"
                  >
                    <span
                      class="select-box"
                      @click="
                        $store.getters.getUserRole
                          ? (showListMember = !showListMember)
                          : (showListMember = false)
                      "
                    >
                      <span class="content">{{
                        $store.getters.getUserRole
                          ? "Chọn sinh viên"
                          : "Tất cả sinh viên"
                      }}</span>
                      <span class="material-icons">arrow_drop_down</span>
                    </span>
                    <ul class="select-options active" v-show="showListMember">
                      <li
                        class="option-item first active"
                        @click="cbxNotifySelectAll($event, notifySelects)"
                      >
                        <span class="check-box">
                          <span class="material-icons checked">check_box</span>
                          <span class="material-icons unchecked"
                            >check_box_outline_blank</span
                          >
                        </span>
                        <span class="content">Tất cả sinh viên</span>
                      </li>

                      <li
                        v-for="member in notifySelects"
                        :key="member.id"
                        class="option-item"
                        @click="cbxNotifySelect($event, member)"
                      >
                        <span class="check-box">
                          <span class="material-icons" v-if="member.isNotify"
                            >check_box</span
                          >
                          <span class="material-icons" v-else
                            >check_box_outline_blank</span
                          >
                        </span>
                        <span class="icon">
                          <img src="/assets/img/hacker.png" />
                        </span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="member.first_name + ' ' + member.last_name"
                          placement="right"
                        >
                          <span class="content"
                            >{{ member.first_name }}
                            {{ member.last_name }}</span
                          >
                        </el-tooltip>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="body" :class="{ active: dataNotify.content != '' }">
                  <textarea
                    name=""
                    class="notify-content"
                    v-model="dataNotify.content"
                  ></textarea>
                  <span class="line"></span>
                  <label>Nội dung thông báo cho lớp học</label>
                </div>
                <div class="files">
                  <ul class="list-files">
                    <li
                      class="file-items"
                      v-for="(file, index) in dataNotify.listFiles"
                      :key="index"
                    >
                      <span class="file-name">{{ file.name }}</span>
                      <span
                        class="btn-remove material-icons"
                        @click="removeNotifyFile(index, dataNotify.listFiles)"
                        >highlight_off</span
                      >
                    </li>
                  </ul>
                </div>
                <div class="footer">
                  <div class="left">
                    <div
                      class="btn btn-light"
                      @click="$refs.fileNotify.click()"
                    >
                      <span class="material-icons">attach_file</span>
                      <span class="content">Thêm</span>
                    </div>
                    <input
                      ref="fileNotify"
                      @change="postNotifyFile"
                      type="file"
                      multiple
                      class="fileNotify"
                      style="display: none"
                    />
                  </div>
                  <div class="right">
                    <div
                      class="btn btn-light"
                      @click="postNotifyCancel($event)"
                    >
                      Hủy
                    </div>
                    <div class="btn btn-primary" @click="submitNotify($event)">
                      Đăng
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div
              class="notify-empty"
              v-if="$store.state.CLASSSUBJECTDETAILS.notifies.length == 0"
            >
              Lớp học chưa có thông báo
            </div>
            <div class="list-notify">
              <div
                class="notify-box"
                v-for="(notify, index) in $store.state.CLASSSUBJECTDETAILS
                  .notifies"
                :key="notify.id"
              >
                <div class="notify-main">
                  <div class="header">
                    <div class="icon">
                      <img src="/assets/img/hacker.png" />
                    </div>
                    <div class="name-time">
                      <div class="name">
                        {{
                          notify.author.first_name +
                            " " +
                            notify.author.last_name
                        }}
                      </div>
                      <div class="time">
                        {{
                          formatTime(
                            notify.created_at,
                            notify.created_at == notify.updated_at
                          )
                        }}{{
                          notify.created_at == notify.updated_at
                            ? ""
                            : " (Đã chỉnh sửa " +
                              formatTime(notify.updated_at) +
                              ")"
                        }}
                      </div>
                    </div>
                    <div
                      class="dots"
                      @click.stop="clickDots($event)"
                      v-if="notify.author.id == $store.getters.getUserId"
                    >
                      <svg focusable="false" viewBox="0 0 24 24" class=" NMm5M">
                        <path
                          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        ></path>
                      </svg>
                      <ul class="list-menu">
                        <li
                          class="item"
                          @click="clickEditNotify(notify, index)"
                        >
                          Chỉnh sửa
                        </li>
                        <li
                          class="item"
                          @click="deleteNotify(notify.id, index)"
                        >
                          Xóa
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="content">
                    {{ notify.content }}
                  </div>
                  <div class="files">
                    <ul class="list-files">
                      <li
                        class="file-items"
                        v-for="file in notify.files"
                        :key="file.id"
                        @click="downloadFile(file.link, file.file_name)"
                      >
                        <div class="file-name">{{ file.file_name }}</div>
                        <span class="material-icons">file_download</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="notify-comment">
                  <div
                    class="number-comment"
                    @click="clickShowComment($event)"
                    v-if="notify.comment.length > 0"
                  >
                    <span class="material-icons">people_alt</span>
                    <div class="number">
                      {{ notify.comment.length }} nhận xét
                    </div>
                  </div>
                  <div
                    class="comment-box"
                    v-for="(cmt, cmtIndex) in notify.comment"
                    :key="cmt.id"
                  >
                    <div class="left">
                      <img src="/assets/img/hacker.png" />
                    </div>
                    <div class="right">
                      <div class="name-time">
                        <span class="name">{{
                          cmt.author.first_name + " " + cmt.author.last_name
                        }}</span>
                        <span class="time">
                          {{
                            formatTime(
                              cmt.created_at,
                              cmt.created_at == cmt.updated_at
                            )
                          }}
                          {{
                            cmt.created_at == cmt.updated_at
                              ? ""
                              : " (Đã chỉnh sửa " +
                                formatTime(cmt.updated_at) +
                                ")"
                          }}
                        </span>
                      </div>
                      <span class="content">
                        {{ cmt.content }}
                      </span>
                    </div>
                    <span
                      class="dots"
                      @click.stop="clickDots($event)"
                      v-if="cmt.author.id == $store.getters.getUserId"
                    >
                      <svg focusable="false" viewBox="0 0 24 24" class=" NMm5M">
                        <path
                          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        ></path>
                      </svg>
                      <ul class="list-menu">
                        <li
                          class="item"
                          @click="clickEditCmt(cmt, index, cmtIndex)"
                        >
                          Chỉnh sửa
                        </li>
                        <li
                          class="item"
                          @click="deleteComment(cmt.id, index, cmtIndex)"
                        >
                          Xóa
                        </li>
                      </ul>
                    </span>
                  </div>
                  <div
                    class="input-comment-box"
                    :style="{
                      borderTop:
                        notify.comment.length > 0 ? '1px solid #dcdcdc' : ''
                    }"
                  >
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
                          @click="submitComment($event, notify)"
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

    <!--    FORM EDIT COMMENT-->
    <transition name="fade">
      <div class="form-edit hidden" id="form-edit-comment">
        <div class="overlay" @click="hiddenFormEdit('form-edit-comment')"></div>
        <div class="form-box">
          <div class="form-block">
            <h3 class="form-title">Chỉnh sửa nhận xét</h3>
            <!--            form-group-->
            <div class="input-box valid">
              <span
                class="input"
                role="textbox"
                contenteditable="plaintext-only"
                @input="editCommentInput($event)"
              ></span>
              <label>Nội dung chỉnh sửa</label>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="hiddenFormEdit('form-edit-comment')"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="submitEditComment"
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!--    FORM EDIT POST-->
    <transition name="fade">
      <div class="form-edit hidden" id="form-edit-notify">
        <div class="overlay" @click="hiddenFormEdit('form-edit-notify')"></div>
        <div class="form-box">
          <div class="form-block">
            <h3 class="form-title">Chỉnh sửa thông báo</h3>
            <div class="post-notify-full">
              <div class="header">
                <div class="title">Dành cho</div>
                <div
                  class="select-options-box"
                  :class="{ disable: !$store.getters.getUserRole }"
                  @clickout="dataEditNotify.showListMember = false"
                >
                  <span
                    class="select-box"
                    @click="
                      $store.getters.getUserRole
                        ? (dataEditNotify.showListMember = !dataEditNotify.showListMember)
                        : (dataEditNotify.showListMember = false)
                    "
                  >
                    <span class="content">{{
                      $store.getters.getUserRole
                        ? "Chọn sinh viên"
                        : "Tất cả sinh viên"
                    }}</span>
                    <span class="material-icons">arrow_drop_down</span>
                  </span>
                  <ul
                    class="select-options active"
                    v-show="dataEditNotify.showListMember"
                  >
                    <li
                      class="option-item first active"
                      @click="
                        cbxNotifySelectAll($event, dataEditNotify.listMembers)
                      "
                    >
                      <span class="check-box">
                        <span class="material-icons checked">check_box</span>
                        <span class="material-icons unchecked"
                          >check_box_outline_blank</span
                        >
                      </span>
                      <span class="content">Tất cả sinh viên</span>
                    </li>

                    <li
                      v-for="member in dataEditNotify.listMembers"
                      :key="member.id"
                      class="option-item"
                      @click="cbxNotifySelect($event, member)"
                    >
                      <span class="check-box">
                        <span class="material-icons" v-if="member.isNotify"
                          >check_box</span
                        >
                        <span class="material-icons" v-else
                          >check_box_outline_blank</span
                        >
                      </span>
                      <span class="icon">
                        <img src="/assets/img/hacker.png" />
                      </span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="member.first_name + ' ' + member.last_name"
                        placement="right"
                      >
                        <span class="content"
                          >{{ member.first_name }} {{ member.last_name }}</span
                        >
                      </el-tooltip>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                class="body"
                :class="{ active: dataEditNotify.data.content != '' }"
              >
                <textarea
                  name=""
                  class="notify-content"
                  v-model="dataEditNotify.data.content"
                ></textarea>
                <span class="line"></span>
                <label>Nội dung thông báo cho lớp học</label>
              </div>
              <div class="files">
                <ul class="list-files">
                  <li
                    class="file-items"
                    v-for="(file, index) in dataEditNotify.listFiles"
                    :key="index"
                  >
                    <span class="file-name">{{ file.name }}</span>
                    <span
                      class="btn-remove material-icons"
                      @click="removeNotifyFile(index, dataEditNotify.listFiles)"
                      >highlight_off</span
                    >
                  </li>
                </ul>
              </div>
              <div class="footer">
                <div class="left">
                  <div
                    class="btn btn-light"
                    @click="$refs.fileEditNotify.click()"
                  >
                    <span class="material-icons">attach_file</span>
                    <span class="content">Thêm</span>
                  </div>
                  <input
                    ref="fileEditNotify"
                    @change="editNotifyChangeFile"
                    type="file"
                    multiple
                    class="fileNotify"
                    style="display: none"
                  />
                </div>
                <div class="right">
                  <div
                    class="btn btn-light"
                    @click="hiddenFormEdit('form-edit-notify')"
                  >
                    Hủy
                  </div>
                  <div class="btn btn-primary" @click="submitEditNotify">
                    Sửa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import apiNotify from "@/api/notify";
import apiDownload from "@/api/download";
const FileDownload = require("js-file-download");
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
      notifySelects: [], // Danh sách sinh viên nhận thông báo
      dataNotify: {
        content: "",
        listFiles: [],
        listMember: [] // list id member
      },
      dataEditCmt: {},
      dataEditNotify: {
        listMembers: [],
        listFiles: [],
        data: {},
        index: "",
        showListMember: false
      }
    };
  },
  methods: {
    downloadFile(filePath, fileName) {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiDownload
          .getFile(token, filePath)
          .then(res => {
            FileDownload(res.data, fileName);
          })
          .catch(() => this.$message.error("Lỗi kêt nối"));
      }
    },
    formatTime(time, showHour = true) {
      let timePost = new Date(time);
      let timePostMiliSecond = timePost.getTime();
      let timeNow = new Date();
      let timeNowMiliSecond = timeNow.getTime();

      let yearText = "";
      if (timePost.getFullYear() != timeNow.getFullYear()) {
        yearText = ", " + timePost.getFullYear();
      }

      // Check hơn 48h chưa
      if (timeNowMiliSecond - timePostMiliSecond > 86400000 * 2) {
        let hour = timePost.getHours();
        let minute = timePost.getMinutes();
        if (showHour) {
          return `${timePost.getDate()} tháng ${timePost.getMonth() +
            1}${yearText} lúc ${hour < 10 ? "0" + hour : hour}:${
            minute < 10 ? "0" + minute : minute
          }`;
        } else {
          return `${timePost.getDate()} tháng ${timePost.getMonth() +
            1}${yearText}`;
        }
      } else if (timeNowMiliSecond - timePostMiliSecond > 86400000) {
        // 24h - 48h
        let hour = timePost.getHours();
        let minute = timePost.getMinutes();
        // Check ngày hôm qua
        if (timeNow.getDate() - timePost.getDate() < 2) {
          return `Hôm qua lúc ${hour < 10 ? "0" + hour : hour}:${
            minute < 10 ? "0" + minute : minute
          }`;
        } else {
          if (showHour) {
            return `${timePost.getDate()} tháng ${timePost.getMonth() +
              1}${yearText} lúc ${hour < 10 ? "0" + hour : hour}:${
              minute < 10 ? "0" + minute : minute
            }`;
          } else {
            return `${timePost.getDate()} tháng ${timePost.getMonth() +
              1}${yearText}`;
          }
        }
      } else {
        let time = timeNowMiliSecond - timePostMiliSecond;
        if (time < 1000) {
          return "vừa xong";
        } else if (time < 60000) {
          // 1p
          return `${Math.floor(time / 1000)} giây trước`;
        } else if (time < 3600000) {
          // 1h
          return `${Math.floor(time / 1000 / 60)} phút trước`;
        } else {
          // 24h
          return `${Math.floor(time / 1000 / 60 / 60)} giờ trước`;
        }
      }
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
    submitEditNotify(event) {
      this.$customjs.clickBtnAnimation(event);
      if (this.dataEditNotify.data == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung thông báo",
          type: 1,
          time: 3000
        });
      } else {
        let token = localStorage.getItem("token_user");
        if (token) {
          let formData = new FormData();
          formData.append("content", this.dataEditNotify.data.content);
          let indexFile_old = 0;
          let indexFile_new = 0;
          this.dataEditNotify.listFiles.forEach(file => {
            if (file.id) {
              formData.append("listFiles_old[" + indexFile_old + "]", file.id);
              indexFile_old++;
            } else {
              formData.append("listFiles_new[" + indexFile_new + "]", file);
              indexFile_new++;
            }
          });
          // Lấy list member_id của các member được nhận thông báo
          if (this.$store.getters.getUserRole) {
            let listMembers = [];
            this.dataEditNotify.listMembers.forEach(member => {
              if (member.isNotify) {
                listMembers.push(member.member_id);
              }
            });
            listMembers.forEach((member, key) => {
              formData.append("listMembers[" + key + "]", member);
            });
          }
          apiNotify
            .update(token, formData, this.dataEditNotify.data.id)
            .then(res => {
              if (res.data.status) {
                this.$store.commit("updateNotify", {
                  index: this.dataEditNotify.index,
                  data: res.data.data
                });
                document
                  .getElementById("form-edit-notify")
                  .classList.add("hidden");
              } else {
                this.$customjs.showToast({
                  title: "Thất bại",
                  message: res.data.message,
                  time: 3000,
                  type: 1
                });
              }
            })
            .catch(() => this.$message.error("Lỗi kết nối"));
        }
      }
    },
    editNotifyChangeFile() {
      this.$refs.fileEditNotify.files.forEach(file => {
        this.dataEditNotify.listFiles.push(file);
      });
      this.$refs.fileEditNotify.value = "";
    },
    clickEditNotify(notify, index) {
      this.$set(this.dataEditNotify, "data", {});
      this.$set(this.dataEditNotify, "listMembers", []);
      this.$set(this.dataEditNotify, "listFiles", []);
      // file
      for (const key in notify.files) {
        this.$set(this.dataEditNotify.listFiles, key, {});
        for (const fileKey in notify.files[key]) {
          this.$set(
            this.dataEditNotify.listFiles[key],
            fileKey,
            notify.files[key][fileKey]
          );
        }
        this.$set(
          this.dataEditNotify.listFiles[key],
          "name",
          this.dataEditNotify.listFiles[key]["file_name"]
        );
        this.$delete(this.dataEditNotify.listFiles[key], "file_name");
      }
      // data
      this.$set(this.dataEditNotify.data, "id", notify.id);
      this.$set(this.dataEditNotify.data, "content", notify.content);
      // list members
      let token = localStorage.getItem("token_user");
      if (token && this.$store.getters.getUserRole) {
        apiNotify
          .getListMember(token, notify.id)
          .then(res => {
            let memberClass = this.$store.getters.getClassMembers;
            let memberNotify = res.data;
            memberClass.forEach(member => {
              let index = this.dataEditNotify.listMembers.push({});
              for (const key in member) {
                this.$set(
                  this.dataEditNotify.listMembers[index - 1],
                  key,
                  member[key]
                );
              }
              this.$set(
                this.dataEditNotify.listMembers[index - 1],
                "isNotify",
                false
              );
              // Check danh sách nhận thông báo
              memberNotify.forEach((value, key) => {
                if (member["member_id"] == value["member_id"]) {
                  this.$set(
                    this.dataEditNotify.listMembers[index - 1],
                    "isNotify",
                    true
                  );
                  this.$delete(memberNotify, key);
                }
              });
            });
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }

      this.$set(this.dataEditNotify, "index", index);
      document.getElementById("form-edit-notify").classList.remove("hidden");
    },
    deleteNotify(notifyId, index) {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$confirm("Xác nhận xóa thông báo?", "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning"
        })
          .then(() => {
            apiNotify
              .delete(token, this.$store.getters.getClassDetails.id, notifyId)
              .then(res => {
                if (res.data.status) {
                  this.$store.commit("deleteNotify", index);
                } else {
                  this.$customjs.showToast({
                    title: "Thất bại",
                    message: res.data.message,
                    time: 3000,
                    type: 1
                  });
                }
              })
              .catch(() =>
                this.$message.error("Không thể gửi yêu cầu đến máy chủ")
              );
          })
          .catch(() => {});
      }
    },
    submitNotify(event) {
      this.$customjs.clickBtnAnimation(event);
      if (this.dataNotify.content == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung thông báo",
          type: 1,
          time: 3000
        });
      } else {
        let token = localStorage.getItem("token_user");
        if (token) {
          // Lấy list member_id của các member được nhận thông báo
          if (this.$store.getters.getUserRole) {
            this.dataNotify.listMember = [];
            this.notifySelects.forEach(member => {
              if (member.isNotify) {
                this.dataNotify.listMember.push(member.member_id);
              }
            });
          }
          let formData = new FormData();
          formData.append("content", this.dataNotify.content);
          this.dataNotify.listFiles.forEach((value, key) => {
            formData.append("listFiles[" + key + "]", value);
          });
          this.dataNotify.listMember.forEach((value, key) => {
            formData.append("listMember[" + key + "]", value);
          });
          apiNotify
            .create(token, this.$store.getters.getClassDetails.id, formData)
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Thành công",
                  message: res.data.message
                });
                let dataCreate = res.data.data;
                dataCreate["author"] = this.$store.getters.getDataUser;
                this.$store.commit("addNotify", dataCreate);
                // reset value
                this.dataNotify.content = "";
                this.dataNotify.listFiles = [];
                document
                  .querySelector(".post-notify-full .body")
                  .classList.remove("active");
              } else {
                this.$customjs.showToast({
                  title: "Thất bại",
                  message: res.data.message,
                  time: 3000,
                  type: 1
                });
              }
            })
            .catch(() => this.$message.error("Lỗi kết nối"));
        }
      }
    },
    cbxNotifySelect(event, member) {
      let cbxParent = event.target;
      while (!cbxParent.classList.contains("select-options")) {
        cbxParent = cbxParent.parentElement;
      }

      let cbxSelectAll = cbxParent.querySelector(".option-item.first");
      cbxSelectAll.classList.remove("active");
      this.$set(member, "isNotify", !member.isNotify);
    },
    cbxNotifySelectAll(event, listMember) {
      let cbxParent = event.target;
      while (!cbxParent.classList.contains("select-options")) {
        cbxParent = cbxParent.parentElement;
      }

      let cbxSelectAll = cbxParent.querySelector(".option-item.first");
      if (cbxSelectAll.classList.contains("active")) {
        cbxSelectAll.classList.remove("active");
        listMember.forEach(member => {
          this.$set(member, "isNotify", false);
        });
      } else {
        cbxSelectAll.classList.add("active");
        listMember.forEach(member => {
          this.$set(member, "isNotify", true);
        });
      }
    },
    showNotifyBox() {
      this.postNotifyBox = false;
      this.$store.getters.getClassMembers.forEach(member => {
        this.$set(member, "isNotify", true);
        this.notifySelects.push(member);
      });
    },
    postNotifyFile() {
      this.$refs.fileNotify.files.forEach(file => {
        this.dataNotify.listFiles.push(file);
      });
      this.$refs.fileNotify.value = "";
    },
    removeNotifyFile(index, listFiles) {
      listFiles.splice(index, 1);
    },
    postNotifyCancel(event) {
      this.postNotifyBox = true;
      this.$customjs.clickBtnAnimation(event);
    },
    commentInput(event) {
      if (!event.target.innerText) {
        event.target.parentElement.classList.remove("valid");
      } else {
        event.target.parentElement.classList.add("valid");
      }
    },
    editCommentInput(event) {
      this.dataEditCmt.content = event.target.innerText;
      if (!this.dataEditCmt.content) {
        event.target.parentElement.classList.remove("valid");
      } else {
        event.target.parentElement.classList.add("valid");
      }
    },
    submitComment(event, notify) {
      let element = event.target;
      while (!element.classList.contains("input-box")) {
        element = element.parentElement;
      }
      let input = element.querySelector(".input");
      let token = localStorage.getItem("token_user");
      if (token && input.innerText != "") {
        apiNotify
          .createReply(token, notify.id, input.innerText)
          .then(res => {
            if (res.data.status) {
              res.data.data["author"] = this.$store.getters.getDataUser;
              res.data.data["comment"] = [];
              notify.comment.push(res.data.data);
              input.innerText = "";
              input.parentElement.classList.remove("valid");
            } else {
              this.$message.error("Có lỗi xảy ra");
            }
          })
          .catch(() =>
            this.$message.error("Không thể gửi yêu cầu đến máy chủ")
          );
      }
    },
    deleteComment(replyId, notifyIndex, cmtIndex) {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$confirm("Xác nhận xóa nhận xét?", "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning"
        })
          .then(() => {
            apiNotify
              .deleteReply(
                token,
                this.$store.getters.getClassDetails.id,
                replyId
              )
              .then(res => {
                if (res.data.status) {
                  this.$store.commit("deleteNotifyReply", {
                    notifyIndex,
                    cmtIndex
                  });
                } else {
                  this.$customjs.showToast({
                    title: "Thất bại",
                    message: res.data.message,
                    time: 3000,
                    type: 1
                  });
                }
              })
              .catch(() =>
                this.$message.error("Không thể gửi yêu cầu đến máy chủ")
              );
          })
          .catch(() => {});
      }
    },
    submitEditComment(event) {
      this.$customjs.clickBtnAnimation(event);
      let token = localStorage.getItem("token_user");
      if (token) {
        apiNotify
          .updateReply(
            token,
            this.dataEditCmt.content,
            this.$store.getters.getClassDetails.id,
            this.dataEditCmt.id
          )
          .then(res => {
            if (res.data.status) {
              let cmt = this.dataEditCmt;
              this.$store.commit("updateNotifyReply", {
                notifyIndex: cmt.postIndex,
                cmtIndex: cmt.cmtIndex,
                cmt: res.data.data
              });
              document
                .getElementById("form-edit-comment")
                .classList.add("hidden");
            } else {
              this.$customjs.showToast({
                title: "Thất bại",
                message: res.data.message,
                time: 3000,
                type: 1
              });
            }
          })
          .catch(() => {
            this.$message.error("Lỗi kết nối");
          });
      }
    },
    clickEditCmt(cmt, postIndex, cmtIndex) {
      this.$set(this, "dataEditCmt", {});
      for (const key in cmt) {
        this.$set(this.dataEditCmt, key, cmt[key]);
      }
      this.$set(this.dataEditCmt, "postIndex", postIndex);
      this.$set(this.dataEditCmt, "cmtIndex", cmtIndex);
      document.getElementById("form-edit-comment").classList.remove("hidden");
      let textBox = document.querySelector(
        "#form-edit-comment span[role='textbox']"
      );
      textBox.innerText = this.dataEditCmt.content;
      textBox.parentElement.classList.add("valid");
    },
    hiddenFormEdit(elementId) {
      document.getElementById(elementId).classList.add("hidden");
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
            display: inline-block;
            &.disable {
              .select-box {
                user-select: none;
                cursor: not-allowed;
                background-color: #e4e4e4;
              }
            }
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
              padding: 8px 0;
              border-radius: 5px;
              box-shadow: 0 0 2px rgba(#000, 0.3), 0 0 5px rgba(#000, 0.1),
                0 2px 2px rgba(#000, 0.3);
              .option-item {
                padding: 12px 15px;
                // height: 40px;
                display: flex;
                align-items: center;
                user-select: none;
                cursor: pointer;
                background-color: #fff;
                &.first {
                  &.active {
                    .check-box {
                      .material-icons.checked {
                        display: unset;
                      }
                      .material-icons.unchecked {
                        display: none;
                      }
                    }
                  }
                  .check-box {
                    .material-icons.checked {
                      display: none;
                    }
                    .material-icons.unchecked {
                      display: unset;
                    }
                  }
                }
                &:hover {
                  background-color: #e4e4e4;
                }
                .check-box {
                  color: #5c5c5c;
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
        .files {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
          .list-files {
            list-style: none;
            .file-items {
              display: flex;
              align-items: center;
              position: relative;
              width: fit-content;
              padding: 4px 40px 4px 0px;
              transition: 0.3s;
              &:hover {
                background-color: #c6d1ff;
                .file-name {
                  color: #000000;
                }
                .btn-remove {
                  opacity: 1;
                  visibility: unset;
                }
              }
              .file-name {
                color: #0020ff;
              }
              .btn-remove {
                position: absolute;
                right: 5px;
                user-select: none;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: 0.3s;
              }
            }
          }
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
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
    .notify-empty {
      width: 100%;
      margin-top: 40px;
      display: flex;
      justify-content: center;
      font-size: 18px;
      color: #555555;
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
            white-space: pre-line;
            overflow-wrap: anywhere;
          }
          .files {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            .list-files {
              list-style: none;
              .file-items {
                display: flex;
                align-items: center;
                position: relative;
                width: fit-content;
                user-select: none;
                cursor: pointer;
                border: 1px solid #8b8b8b;
                padding: 6px 45px 6px 16px;
                margin-top: 10px;
                border-radius: 30px;
                transition: 0.3s;
                &:hover {
                  background-color: #0d6efd;
                  color: #fff;
                }
                .file-name {
                }
                .material-icons {
                  position: absolute;
                  right: 12px;
                  font-size: 20px;
                  transition: 0.3s;
                }
              }
            }
          }
        }
        .notify-comment {
          .number-comment {
            padding: 6px 16px;
            display: inline-flex;
            justify-content: flex-start;
            align-items: center;
            user-select: none;
            cursor: pointer;
            margin-bottom: 2px;
            margin-top: 10px;
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
                white-space: pre-line;
                overflow-wrap: anywhere;
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

.form-edit {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3000;
  transition: 0.3s;
  &.hidden {
    opacity: 0;
    visibility: hidden;
  }
  .overlay {
    width: 100%;
    height: 100%;
    background: rgba(#000, 0.2);
    cursor: pointer;
  }
  .form-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 360px;
    box-shadow: 7px 7px 14px rgba(#000, 0.2), -3px -3px 7px #dddddd;
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
        border: 2px solid rgba(#000, 0.6);
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
    }
    .form-btn-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}

#form-edit-notify {
  .form-box {
    min-width: 600px;
    .form-block {
      padding: 30px 30px;
    }
  }
  .post-notify-full {
    //padding: 15px 25px;
    margin-top: 15px;
    height: 100%;
    width: 100%;
    .header {
      .title {
        font-weight: 500;
        color: #777777;
        font-size: 15px;
      }
      .select-options-box {
        position: relative;
        margin-top: 10px;
        display: inline-block;
        &.disable {
          .select-box {
            user-select: none;
            cursor: not-allowed;
            background-color: #e4e4e4;
          }
        }
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
          padding: 8px 0;
          border-radius: 5px;
          box-shadow: 0 0 2px rgba(#000, 0.3), 0 0 5px rgba(#000, 0.1),
            0 2px 2px rgba(#000, 0.3);
          .option-item {
            padding: 12px 15px;
            // height: 40px;
            display: flex;
            align-items: center;
            user-select: none;
            cursor: pointer;
            background-color: #fff;
            &.first {
              &.active {
                .check-box {
                  .material-icons.checked {
                    display: unset;
                  }
                  .material-icons.unchecked {
                    display: none;
                  }
                }
              }
              .check-box {
                .material-icons.checked {
                  display: none;
                }
                .material-icons.unchecked {
                  display: unset;
                }
              }
            }
            &:hover {
              background-color: #e4e4e4;
            }
            .check-box {
              color: #5c5c5c;
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
    .files {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      .list-files {
        list-style: none;
        .file-items {
          display: flex;
          align-items: center;
          position: relative;
          width: fit-content;
          padding: 4px 40px 4px 0px;
          transition: 0.3s;
          &:hover {
            background-color: #c6d1ff;
            .file-name {
              color: #000000;
            }
            .btn-remove {
              opacity: 1;
              visibility: unset;
            }
          }
          .file-name {
            color: #0020ff;
          }
          .btn-remove {
            position: absolute;
            right: 5px;
            user-select: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: 0.3s;
          }
        }
      }
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
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
</style>
