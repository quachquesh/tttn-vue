<template>
  <div class="grid wide">
    <div class="row">
      <div class="col l-8 l-o-2 c-10 c-o-1">
        <div class="post-notify-box">
          <div class="post-notify-full">
            <txtarea-editor
              txtarea-id="question-post"
              :content-edit="dataNotify.content"
              content="Nội dung câu hỏi"
              @input="dataNotify.content = $event"
            />
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
                <div class="btn btn-light" @click="$refs.fileNotify.click()">
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
                <div class="btn btn-primary" @click="submitNotify($event)">
                  Đăng
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="list-notify-box">
          <div class="list-notify">
            <div
              class="notify-box"
              :class="{ red: notify.author.role }"
              v-for="(notify, index) in $store.state.CLASSSUBJECTDETAILS
                .questions"
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
                        notify.author.first_name + " " + notify.author.last_name
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
                      <li class="item" @click="clickEditNotify(notify, index)">
                        Chỉnh sửa
                      </li>
                      <li class="item" @click="deleteNotify(notify.id, index)">
                        Xóa
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="content" v-html="formatHTML(notify.content)"></div>
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
                    {{ notify.comment.length }} bình luận
                  </div>
                </div>
                <div
                  class="comment-box"
                  :class="{ red: cmt.author.role }"
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
                    <span class="content">{{ cmt.content }}</span>
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
                        @click="
                          deleteComment(cmt.id, notify.id, index, cmtIndex)
                        "
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
                    <label>Nội dung bình luận</label>
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
          </div>
        </div>
      </div>
    </div>
    <!--  FORM EDIT COMMENT  -->
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

    <!--  FORM EDIT POST  -->
    <transition name="fade">
      <div class="form-edit hidden" id="form-edit-notify">
        <div class="overlay" @click="hiddenFormEdit('form-edit-notify')"></div>
        <div class="form-box">
          <div class="form-block">
            <h3 class="form-title">Chỉnh sửa bài thảo luận</h3>
            <div class="post-notify-full">
              <txtarea-editor
                txtarea-id="question-edit"
                :content-edit="dataEditNotify.data.content"
                content="Nội dung câu hỏi"
                @input="dataEditNotify.data.content = $event"
              />
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
                    Cập nhật
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
import apiDownload from "@/api/download";
import apiQuestion from "@/api/question";
import txtareaEditor from "@/components/template/txtarea_editor";
const FileDownload = require("js-file-download");

export default {
  props: {
    roomId: {
      required: true
    }
  },
  data() {
    return {
      dataNotify: {
        content: "",
        listFiles: []
      },
      dataEditNotify: {
        listFiles: [],
        data: {},
        index: ""
      },
      dataEditCmt: {}
    };
  },
  methods: {
    formatHTML(text) {
      let str = text;
      str = str.replaceAll(/</g, "&#60");
      str = str.replaceAll(/>/g, "&#62");

      while (str != "") {
        let formatOpen = {
          indexStart: -1,
          indexEnd: -1,
          content: ""
        };
        let indexFormatClose = -1;
        let content = {
          start: "",
          main: "",
          end: ""
        };

        formatOpen.indexStart = str.indexOf("[FORMAT");
        if (formatOpen.indexStart == -1) {
          break;
        }
        formatOpen.indexEnd = str.indexOf("]", formatOpen.indexStart);
        formatOpen.content = str.slice(
          formatOpen.indexStart,
          formatOpen.indexEnd
        );

        indexFormatClose = str.indexOf("[/FORMAT]");
        if (indexFormatClose == -1) {
          break;
        }
        content.start = str.slice(0, formatOpen.indexStart);
        content.main = str.slice(formatOpen.indexEnd + 1, indexFormatClose);
        content.end = str.slice(indexFormatClose + 9, str.length);
        let options = formatOpen.content.split(" ");
        let style = "";
        let attr = "";
        let tag = "div";
        options.forEach(option => {
          let arrStr = option.split('"');
          if (arrStr.length > 0) {
            switch (arrStr[0]) {
              case "url=":
                attr += ` href="${arrStr[1]}" target="_blank"`;
                tag = "a";
                style += "text-decoration: none; color: #1266f1;";
                break;
              case "fontSize=":
                if (arrStr[1] > 40) {
                  style += `font-size: 40px`;
                } else if (arrStr[1] < 8) {
                  style += `font-size: 8px`;
                } else {
                  style += `font-size: ${arrStr[1]}px`;
                }
                break;
              case "bold":
                style += "font-weight: 600;";
                break;
              case "italic":
                style += "font-style: italic;";
                break;
              case "underline":
                style += "text-decoration: underline;";
                break;
              case "strikethrough":
                style += "text-decoration: line-through;";
                break;
              case "align=":
                style += `text-align: ${arrStr[1]}; display: block;`;
                break;
              case "color=":
                style += `color: ${arrStr[1]};`;
                break;
              case "bgColor=":
                style += `background-color: ${arrStr[1]};`;
                break;
            }
          }
        });

        str = `${content.start}<${tag} ${attr} style="${style}">${content.main}</${tag}>${content.end}`;
      }

      return str;
    },
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
    submitNotify(event) {
      this.$customjs.clickBtnAnimation(event);
      if (this.dataNotify.content == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung thảo luận",
          type: 1
        });
      } else {
        let token = localStorage.getItem("token_user");
        if (token) {
          let formData = new FormData();
          formData.append("content", this.dataNotify.content);
          this.dataNotify.listFiles.forEach((value, key) => {
            formData.append("listFiles[" + key + "]", value);
          });
          apiQuestion
            .create(token, this.roomId, formData)
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Thành công",
                  message: res.data.message
                });
                let dataCreate = res.data.data;
                dataCreate["author"] = this.$store.getters.getDataUser;
                this.$store.commit("addQuestion", dataCreate);
                // reset value
                this.dataNotify.content = "";
                this.dataNotify.listFiles = [];
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
    submitEditNotify(event) {
      this.$customjs.clickBtnAnimation(event);
      if (this.dataEditNotify.data == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung thảo luận",
          type: 1
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
          apiQuestion
            .update(token, this.roomId, this.dataEditNotify.data.id, formData)
            .then(res => {
              if (res.data.status) {
                this.$store.commit("updateQuestion", {
                  index: this.dataEditNotify.index,
                  data: res.data.data
                });
                document
                  .getElementById("form-edit-notify")
                  .classList.add("hidden");
                this.$customjs.showToast({
                  title: "Thành công",
                  message: res.data.message
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
      this.$set(this.dataEditNotify, "index", index);
      document.getElementById("form-edit-notify").classList.remove("hidden");
    },
    deleteNotify(questionId, index) {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$confirm("Xác nhận xóa bài thảo luận?", "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning"
        })
          .then(() => {
            apiQuestion
              .delete(token, this.roomId, questionId)
              .then(res => {
                if (res.data.status) {
                  this.$store.commit("deleteQuestion", index);
                  this.$customjs.showToast({
                    title: "Thành công",
                    message: res.data.message
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
    submitComment(event, notify) {
      let element = event.target;
      while (!element.classList.contains("input-box")) {
        element = element.parentElement;
      }
      let input = element.querySelector(".input");
      let token = localStorage.getItem("token_user");
      if (token && input.innerText != "") {
        apiQuestion
          .createReply(token, this.roomId, notify.id, input.innerText)
          .then(res => {
            if (res.data.status) {
              res.data.data["author"] = this.$store.getters.getDataUser;
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
    deleteComment(replyId, notifyId, questionIndex, cmtIndex) {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.$confirm("Xác nhận xóa nhận xét?", "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning"
        })
          .then(() => {
            apiQuestion
              .deleteReply(token, this.roomId, notifyId, replyId)
              .then(res => {
                if (res.data.status) {
                  this.$store.commit("deleteQuestionReply", {
                    questionIndex,
                    cmtIndex
                  });
                  this.$customjs.showToast({
                    title: "Thành công",
                    message: res.data.message
                  });
                } else {
                  this.$customjs.showToast({
                    title: "Thất bại",
                    message: res.data.message
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
        apiQuestion
          .updateReply(
            token,
            this.roomId,
            this.dataEditCmt.question_id,
            this.dataEditCmt.id,
            this.dataEditCmt.content
          )
          .then(res => {
            if (res.data.status) {
              let cmt = this.dataEditCmt;
              this.$store.commit("updateQuestionReply", {
                questionIndex: cmt.postIndex,
                cmtIndex: cmt.cmtIndex,
                cmt: res.data.data
              });

              document
                .getElementById("form-edit-comment")
                .classList.add("hidden");

              this.$customjs.showToast({
                title: "Thành công",
                message: res.data.message
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
    postNotifyFile() {
      this.$refs.fileNotify.files.forEach(file => {
        this.dataNotify.listFiles.push(file);
      });
      this.$refs.fileNotify.value = "";
    },
    removeNotifyFile(index, listFiles) {
      listFiles.splice(index, 1);
    }
  },
  components: {
    txtareaEditor
  },
  async created() {
    document.title = "Thảo luận lớp";
    let token = localStorage.getItem("token_user");
    if (token) {
      if (
        Object.keys(this.$store.getters.getQuestions).length == 0 ||
        this.$store.getters.getQuestions[0].class_id != this.roomId
      ) {
        await apiQuestion
          .get(token, this.roomId)
          .then(res => this.$store.commit("setClassQuestions", res.data))
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    }
    if (this.$store.getters.getClassDetails.name) {
      document.title += " " + this.$store.getters.getClassDetails.name;
    }
    this.$router.options.nprogress.done();
  }
};
</script>

<style lang="scss" scoped>
.post-notify-box {
  margin: 20px -10px 0;
  padding: 20px;
  box-shadow: 0 0 3px rgba(#000, 0.1), 0 0 10px rgba(#000, 0.2);
  border-radius: 10px;
  box-sizing: border-box;
  transition: linear 0.3s;
  background-color: #ffffff;
  &:hover {
    box-shadow: 0px 0px 4px rgba(#000, 0.2), 0px 0px 13px rgba(#000, 0.3);
  }
  .post-notify-full {
    width: 100%;
    .body {
      width: 100%;
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      background-color: #f8f8f8;
      transition: 0.2s;
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
        padding: 0 15px 9px;
        margin-top: 28px;
        //overflow: hidden;
        border-radius: 5px;
        border: none;
        outline: none;
        position: relative;
        font-size: 15.5px;
        cursor: auto;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 10px;
          box-shadow: inset 0 0 5px grey;
        }

        &::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

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
        font-size: 15px;
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
          max-width: 100%;
          padding: 4px 40px 4px 0px;
          transition: 0.3s;
          &:hover {
            background-color: #c6d1ff;
            .file-name {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #000000;
            }
            .btn-remove {
              opacity: 1;
              visibility: unset;
            }
          }
          .file-name {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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

.list-notify-box {
  margin: 0 -10px;
  .list-notify {
    width: 100%;
    .notify-box {
      margin: 20px 0;
      width: 100%;
      box-shadow: 0px 0px 5px rgba(#000, 0.2);
      border-radius: 5px;
      font-size: 14px;
      background-color: #ffffff;
      &.red {
        box-shadow: 0px 0px 5px rgba(#f00, 1);
        .notify-main {
          .header {
            .name-time {
              .name {
                color: red;
              }
            }
          }
        }
      }
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
          font-size: 16px;
          //line-height: 20px;
          margin-right: 12px;
          white-space: pre-wrap;
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
              max-width: 100%;
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
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
          &.active {
            color: var(--color-primary);
            .material-icons {
              color: var(--color-primary);
            }
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
          &.red {
            .right {
              .name {
                color: red;
              }
            }
          }
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
              white-space: pre-wrap;
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

.form-edit {
  .form-box {
    width: 643px !important;
    border-radius: 20px;
    .form-block {
      padding: 30px !important;
      max-height: 500px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
  }
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2000;
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
      margin-left: 0;
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
        border-radius: 10px;
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
        border: 1px solid rgba(#000, 0.6);
        &:focus {
          outline: none;
          border: 1px solid var(--color-primary);
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
        padding: 0 15px 9px;
        margin-top: 28px;
        //overflow: hidden;
        border-radius: 5px;
        border: none;
        outline: none;
        position: relative;
        font-size: 15.5px;
        cursor: auto;
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 10px;
          box-shadow: inset 0 0 5px grey;
        }

        &::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

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
          max-width: 100%;
          padding: 4px 40px 4px 0px;
          transition: 0.3s;
          &:hover {
            background-color: #c6d1ff;
            .file-name {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #000000;
            }
            .btn-remove {
              opacity: 1;
              visibility: unset;
            }
          }
          .file-name {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
@media (max-width: 739px) {
  .form-edit {
    .form-box {
      width: 89% !important;
      .form-block {
        padding: 30px !important;
        .form-title {
          font-size: 22px;
        }
      }
    }
    .overlay {
      width: 100%;
      height: 100%;
      background: rgba(#000, 0.2);
      cursor: pointer;
    }
    .form-box {
    }
  }

  #form-edit-notify {
    .form-box {
      min-width: 95%;
      .form-block {
        padding: 25px 20px;
      }
    }
    .post-notify-full {
      .body {
        .notify-content {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
