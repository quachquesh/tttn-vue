<template>
  <div id="ticket-manager">
    <div class="grid wide">
      <transition name="slide-left" mode="out-in" appear>
        <div class="row" v-if="isTicketDetails == false" key="table">
          <div class="col c-12">
            <div class="header-table">
              <div class="left">
                <span class="label">Tìm kiếm: </span>
                <div>
                  <el-input
                    placeholder="Nhập từ khóa tìm kiếm"
                    v-model="keySearch"
                    clearable
                  />
                </div>
              </div>
              <div class="right">
                <span class="label">Trạng thái: </span>
                <div style="width: 200px; margin-right: 10px;">
                  <el-select
                    v-model="filterStatus"
                    multiple
                    placeholder="Trạng thái"
                    style="width: 100%"
                  >
                    <el-option label="Đợi" value="0"> </el-option>
                    <el-option label="Trả lời" value="1"> </el-option>
                    <el-option label="Đóng" value="2"> </el-option>
                  </el-select>
                </div>
                <el-button
                  type="primary"
                  size="medium"
                  @click="openFormTicket()"
                  v-if="!$store.getters.getUserRole"
                  >Gửi yêu cầu</el-button
                >
              </div>
            </div>

            <data-tables
              :data="dataTable()"
              :table-props="tableProps"
              style="width: 100%"
              @row-click="clickTicket($event)"
            >
              <!--      :pagination-props="{ pageSizes: [5, 10, 30, 50, 100] }"-->
              <el-table-column
                :label="$store.getters.getUserRole ? 'Người gửi' : 'Người nhận'"
                width="220"
                sortable="custom"
              >
                <template slot-scope="scope">{{
                  scope.row.first_name + " " + scope.row.last_name
                }}</template>
              </el-table-column>

              <el-table-column
                prop="title"
                label="Tiêu đề"
                min-width="150"
                sortable="custom"
              ></el-table-column>
              <el-table-column
                label="Trạng thái"
                width="120"
                sortable="custom"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="
                      scope.row.status == 0
                        ? 'warning'
                        : scope.row.status == 1
                        ? 'success'
                        : 'info'
                    "
                    >{{ formatStatus(scope.row.status) }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="Lần cập nhật cuối"
                width="170"
                sortable="custom"
              >
                <template slot-scope="scope">{{
                  formatTime(scope.row.updated_at)
                }}</template>
              </el-table-column>
            </data-tables>
          </div>
        </div>

        <!--  Xem chi tiết yêu cầu  -->
        <div class="row" v-else key="details" id="ticket-details">
          <div class="col c-12" v-if="loading == false">
            <el-button
              type="primary"
              @click="isTicketDetails = false"
              size="medium"
              icon="el-icon-back"
              >Quay lại</el-button
            >
            <div class="ticket-details-body">
              <div class="body-left">
                <h3>Thông tin Ticket</h3>
                <div class="ticket-info">
                  <ul class="list-info">
                    <li class="item">
                      <div class="title">Người gửi</div>
                      <div class="content">
                        {{
                          dataTicketDetails.student_send.first_name +
                            " " +
                            dataTicketDetails.student_send.last_name
                        }}
                      </div>
                    </li>
                    <li class="item">
                      <div class="title">Người nhận</div>
                      <div class="content">
                        {{
                          dataTicketDetails.lecturer_take.first_name +
                            " " +
                            dataTicketDetails.lecturer_take.last_name
                        }}
                      </div>
                    </li>
                    <li class="item">
                      <div class="title">Đã gửi</div>
                      <div class="content">
                        {{ formatTime(dataTicketDetails.created_at) }}
                      </div>
                    </li>
                    <li class="item">
                      <div class="title">Cập nhật lần cuối</div>
                      <div class="content">
                        {{
                          formatTime(
                            this.dataTicketDetails.replies[0].created_at
                          )
                        }}
                      </div>
                    </li>
                    <li class="item">
                      <div class="title">Trạng thái</div>
                      <div class="content">
                        <el-tag
                          :type="
                            dataTicketDetails.status == 0
                              ? 'warning'
                              : dataTicketDetails.status == 1
                              ? 'success'
                              : 'info'
                          "
                        >
                          {{ formatStatus(dataTicketDetails.status) }}
                        </el-tag>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="ticket-button">
                  <el-button
                    type="primary"
                    size="medium"
                    @click="isFormReply = !isFormReply"
                    v-if="
                      dataTicketDetails.status != 2 ||
                        !$store.getters.getUserRole
                    "
                    >Trả lời</el-button
                  >
                  <el-button
                    type="info"
                    size="medium"
                    plain
                    @click="disableTicket()"
                    v-if="
                      !$store.getters.getUserRole &&
                        dataTicketDetails.status != 2
                    "
                    >Đóng ticket</el-button
                  >
                </div>
              </div>
              <div class="body-right">
                <el-alert
                  title="Trả lời để mở lại ticket"
                  type="warning"
                  v-if="
                    dataTicketDetails.status == 2 && !$store.getters.getUserRole
                  "
                  style="margin-bottom: 16px"
                >
                </el-alert>
                <div
                  class="body-answer"
                  v-if="
                    dataTicketDetails.status != 2 || !$store.getters.getUserRole
                  "
                >
                  <div
                    class="body-answer_header"
                    @click="isFormReply = !isFormReply"
                  >
                    <span class="content"
                      ><span class="material-icons">edit</span>Trả lời</span
                    >
                    <span class="material-icons">expand_more</span>
                  </div>
                  <transition
                    name="height"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    appear
                  >
                    <div class="post-notify-box" v-show="isFormReply">
                      <div class="post-notify-full">
                        <txtarea-editor
                          txtarea-id="reply-post"
                          :content-edit="dataTicketReply.content"
                          content="Nội dung"
                          @input="dataTicketReply.content = $event"
                          style="margin-top: 0;"
                        />
                        <div class="files">
                          <ul class="list-files">
                            <li
                              class="file-items"
                              v-for="file in dataTicketReply.listFiles"
                              :key="file.id"
                            >
                              <span class="file-name">{{ file.name }}</span>
                              <span
                                class="btn-remove material-icons"
                                @click="
                                  removeFile(index, dataTicketReply.listFiles)
                                "
                                >highlight_off</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div class="footer">
                          <div class="left">
                            <div
                              class="btn btn-light"
                              @click="$refs.dataFileTicketReply.click()"
                            >
                              <span class="material-icons">attach_file</span>
                              <span class="content">Thêm</span>
                            </div>
                            <input
                              ref="dataFileTicketReply"
                              @change="postFileTicketReply"
                              type="file"
                              multiple
                              class="fileNotify"
                              style="display: none"
                            />
                          </div>
                          <div class="right">
                            <div
                              class="btn btn-light"
                              @click="isFormReply = false"
                            >
                              Hủy
                            </div>
                            <div
                              class="btn btn-primary"
                              @click="submitTicketReply($event)"
                            >
                              Gửi
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="body-list-answer">
                  <div
                    class="answer-item"
                    v-for="reply in dataTicketDetails.replies"
                    :key="reply.id"
                  >
                    <div class="answer-author">
                      <div class="author-info">
                        <div class="name">
                          {{
                            reply.author.first_name +
                              " " +
                              reply.author.last_name
                          }}
                        </div>
                        <div class="role">
                          {{ reply.author.role ? "Giảng viên" : "Sinh viên" }}
                        </div>
                      </div>
                      <div class="answer-time">
                        {{ formatTime(reply.created_at) }}
                      </div>
                    </div>
                    <div class="answer-content">
                      <div
                        class="content"
                        v-html="formatHTML(reply.content)"
                      ></div>
                      <ul class="list-file">
                        <li
                          class="file-item"
                          v-for="file in reply.files"
                          :key="file.id"
                          @click="downloadFile(file.link, file.file_name)"
                        >
                          <div class="file-name">{{ file.file_name }}</div>
                          <span class="material-icons">file_download</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!--  FORM TẠO YÊU CẦU  -->
    <transition name="fade">
      <div class="form-edit" id="form-create-ticket" v-if="isFormTicket">
        <div class="overlay" @click="isFormTicket = false"></div>
        <div class="form-box">
          <div class="form-block">
            <h3 class="form-title">Gửi yêu cầu</h3>
            <div class="post-notify-full">
              <div class="header">
                <div class="title">Gửi cho:</div>
                <el-select
                  v-model="dataTicketCreate.sendTo"
                  filterable
                  placeholder="Gửi cho"
                  size="small"
                  :loading="teachers.loading"
                >
                  <el-option
                    v-for="item in teachers.data"
                    :key="item.id"
                    :label="item.first_name + ' ' + item.last_name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="header">
                <div class="title">Tiêu đề:</div>
                <el-input
                  placeholder="Nhập tiêu đề"
                  v-model="dataTicketCreate.title"
                  size="small"
                  clearable
                >
                </el-input>
              </div>
              <txtarea-editor
                txtarea-id="ticket-post"
                :content-edit="dataTicketCreate.content"
                content="Nội dung"
                @input="dataTicketCreate.content = $event"
                style="margin-top: 0;"
              />
              <div class="files">
                <ul class="list-files">
                  <li
                    class="file-items"
                    v-for="file in dataTicketCreate.listFiles"
                    :key="file.id"
                  >
                    <span class="file-name">{{ file.name }}</span>
                    <span
                      class="btn-remove material-icons"
                      @click="removeFile(index, dataTicketCreate.listFiles)"
                      >highlight_off</span
                    >
                  </li>
                </ul>
              </div>
              <div class="footer">
                <div class="left">
                  <div
                    class="btn btn-light"
                    @click="$refs.dataFileTicket.click()"
                  >
                    <span class="material-icons">attach_file</span>
                    <span class="content">Thêm</span>
                  </div>
                  <input
                    ref="dataFileTicket"
                    @change="postFileTicket"
                    type="file"
                    multiple
                    class="fileNotify"
                    style="display: none"
                  />
                </div>
                <div class="right">
                  <div class="btn btn-light" @click="isFormTicket = false">
                    Hủy
                  </div>
                  <div class="btn btn-primary" @click="submitSendTicket">
                    Gửi
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
import apiLecturer from "@/api/lecturer";
import apiTicket from "@/api/ticket";
import txtareaEditor from "@/components/template/txtarea_editor";
import apiDownload from "@/api/download";
const FileDownload = require("js-file-download");
export default {
  name: "TicketManager",
  data() {
    return {
      contentTest: "",
      loading: true,
      isTicketDetails: false,
      isFormTicket: false,
      isFormReply: false,
      keySearch: "",
      filterStatus: [],
      tableProps: {
        border: true,
        stripe: true,
        fit: true,
        "highlight-current-row": true,
        resizable: true,
        defaultSort: {
          prop: "flow_no",
          order: "descending"
        }
      },
      dataTicketCreate: {
        sendTo: "", // id giảng viên
        title: "",
        content: "",
        listFiles: []
      },
      teachers: {
        loading: true,
        data: []
      },
      dataTicketReply: {
        content: "",
        listFiles: []
      },
      dataTicketDetails: {
        created_at: "",
        id: -1,
        lecturer_take: -1,
        replies: [], // content, lecturer_reply, student_reply, created_at
        status: 0,
        student_send: -1,
        title: "",
        updated_at: ""
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
    dataTable() {
      if (this.keySearch == "" && this.filterStatus.length == 0) {
        return this.$store.getters.getDataTickets;
      } else {
        let dataFilter = this.$store.getters.getDataTickets;
        if (this.filterStatus.length > 0) {
          dataFilter = dataFilter.filter(ticket => {
            for (const key in this.filterStatus) {
              if (this.filterStatus[key] == ticket.status) {
                return true;
              }
            }
            return false;
          });
        }
        if (this.keySearch != "") {
          return dataFilter.filter(ticket => {
            for (const key in ticket) {
              if (
                key != "created_at" &&
                key != "updated_at" &&
                (ticket[key] + "")
                  .toLowerCase()
                  .indexOf(this.keySearch.toLowerCase()) != -1
              ) {
                return true;
              }
            }
          });
        }
      }
    },
    formatHTML(text) {
      if (text.length == 0) {
        return text;
      }
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
    formatTime(time) {
      let timePost = new Date(time);
      let date = timePost.getDate();
      let month = timePost.getMonth() + 1;
      let year = timePost.getFullYear();
      let hour = timePost.getHours();
      let minutes = timePost.getMinutes();
      if (date < 10) date = "0" + date;
      if (month < 10) month = "0" + month;
      if (hour < 10) hour = "0" + hour;
      if (minutes < 10) minutes = "0" + minutes;
      return `${date}/${month}/${year} (${hour}:${minutes})`;
    },
    formatStatus(status) {
      if (status == 0) {
        return "Đợi";
      } else if (status == 1) {
        return "Đã trả lời";
      } else {
        return "Đóng";
      }
    },
    openFormTicket() {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.isFormTicket = true;
        if (this.teachers.data.length == 0) {
          apiLecturer
            .get(token)
            .then(res => {
              this.teachers.data = res.data;
              this.teachers.loading = false;
            })
            .catch(() => {
              this.$message.error("Không thể tải danh sách giảng viên");
            });
        }
      }
    },
    postFileTicket() {
      this.$refs.dataFileTicket.files.forEach(file => {
        this.dataTicketCreate.listFiles.push(file);
      });
      this.$refs.dataFileTicket.value = "";
    },
    postFileTicketReply() {
      this.$refs.dataFileTicketReply.files.forEach(file => {
        this.dataTicketReply.listFiles.push(file);
      });
      this.$refs.dataFileTicketReply.value = "";
    },
    removeFile(index, listFiles) {
      listFiles.splice(index, 1);
    },
    clickTicket(event) {
      let token = localStorage.getItem("token_user");
      if (token) {
        this.isTicketDetails = true;
        this.loading = true;
        this.$router.options.nprogress.start();
        apiTicket.show(token, event.id).then(res => {
          this.$set(this, "dataTicketDetails", res.data);
          this.loading = false;
          this.$router.options.nprogress.done();
        });
      }
    },
    submitSendTicket(event) {
      this.$customjs.clickBtnAnimation(event);
      if (!this.dataTicketCreate.sendTo) {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa chọn giảng viên",
          type: 1
        });
      } else if (this.dataTicketCreate.title == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập tiêu đề yêu cầu",
          type: 1
        });
      } else if (this.dataTicketCreate.content == "") {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung yêu cầu",
          type: 1
        });
      } else {
        let token = localStorage.getItem("token_user");
        if (token) {
          let formData = new FormData();
          formData.append("lecturer_take", this.dataTicketCreate.sendTo);
          formData.append("title", this.dataTicketCreate.title);
          formData.append("content", this.dataTicketCreate.content);
          this.dataTicketCreate.listFiles.forEach((value, key) => {
            formData.append("listFiles[" + key + "]", value);
          });
          apiTicket
            .create(token, formData)
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Thành công",
                  message: res.data.message
                });
                this.teachers.data.forEach(teacher => {
                  if (teacher.id == this.dataTicketCreate.sendTo) {
                    let data = res.data.data;
                    data["first_name"] = teacher.first_name;
                    data["last_name"] = teacher.last_name;
                    this.$store.commit("addTicket", data);
                    this.isFormTicket = false;
                    return true;
                  }
                });
              } else {
                this.$customjs.showToast({
                  title: "Thất bại",
                  message: res.data.message
                });
              }
            })
            .catch(() => this.$message.error("Lỗi kết nối"));
        }
      }
    },
    submitTicketReply(event) {
      this.$customjs.clickBtnAnimation(event);
      if (!this.dataTicketReply.content) {
        this.$customjs.showToast({
          title: "Lỗi",
          message: "Chưa nhập nội dung yêu cầu",
          type: 1
        });
      } else {
        let token = localStorage.getItem("token_user");
        if (token) {
          let formData = new FormData();
          formData.append("content", this.dataTicketReply.content);
          this.dataTicketReply.listFiles.forEach((value, key) => {
            formData.append("listFiles[" + key + "]", value);
          });
          apiTicket
            .reply(token, this.dataTicketDetails.id, formData)
            .then(res => {
              if (res.data.status) {
                this.$customjs.showToast({
                  title: "Thành công",
                  message: res.data.message
                });
                this.dataTicketReply.content = "";
                this.dataTicketReply.listFiles = [];
                let data = res.data.data;
                data["author"] = this.$store.getters.getDataUser;
                this.dataTicketDetails.replies.unshift(data);
                if (
                  (this.$store.getters.getUserRole &&
                    this.dataTicketDetails.status == 0) ||
                  (!this.$store.getters.getUserRole &&
                    this.dataTicketDetails.status == 2)
                ) {
                  this.dataTicketDetails.status = 1;
                }
              } else {
                this.$customjs.showToast({
                  title: "Thất bại",
                  message: res.data.message
                });
              }
            })
            .catch(() => this.$message.error("Lỗi kết nối"));
        }
      }
    },
    disableTicket() {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiTicket
          .update(token, this.dataTicketDetails.id)
          .then(res => {
            if (res.data.status) {
              this.$customjs.showToast({
                title: "Thành công",
                message: res.data.message
              });
              this.dataTicketDetails.status = 2;
            } else {
              this.$customjs.showToast({
                title: "Thất bại",
                message: res.data.message,
                type: 1
              });
            }
          })
          .catch(() => this.$message.error("Lỗi kết nối"));
      }
    },
    enter(element) {
      let curHeight = getComputedStyle(element).height;
      element.style.width = getComputedStyle(element).width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";

      const height = getComputedStyle(element).height;
      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = curHeight;

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

      requestAnimationFrame(() => {
        element.style.height = 0;
      });
    }
  },
  components: {
    txtareaEditor
  },
  created() {
    if (this.$store.getters.getDataTickets.length == 0) {
      let token = localStorage.getItem("token_user");
      if (token) {
        apiTicket
          .get(token)
          .then(res => {
            this.$store.commit("setDataTickets", res.data);
            this.loading = false;
            this.$router.options.nprogress.done();
          })
          .catch(() => {
            this.$message.error("Lỗi không tải được danh sách yêu cầu");
          });
      }
    } else {
      this.loading = false;
      this.$router.options.nprogress.done();
    }
  }
};
</script>

<style scoped lang="scss">
.header-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  .right,
  .left {
    display: flex;
    align-items: center;
    .label {
      margin-right: 8px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .right {
    justify-content: flex-end;
  }
}

#ticket-details {
  .ticket-details-body {
    display: flex;
    margin-top: 21px;
    .body-left {
      min-width: 230px;
      margin-right: 20px;
      height: max-content;
      h3 {
        font-weight: 600;
        font-size: 16px;
      }
      .ticket-info {
        margin-top: 16px;
        background-color: #ffffff;
        box-shadow: 0 0 5px rgba(#000, 0.1);
        border-radius: 5px;
        padding: 5px 0;
        .list-info {
          list-style: none;
          .item {
            border-bottom: 1px solid #f0f0f0;
            padding: 12px 18px;
            .title {
              font-size: 12px;
              font-weight: 600;
              color: #a3a3a3;
              user-select: none;
            }
            .content {
              font-size: 14px;
              margin-top: 8px;
            }
          }
        }
      }
      .ticket-button {
        margin-top: 12px;
        display: flex;
        justify-content: space-around;
        button {
          flex: 1;
        }
      }
    }
    .body-right {
      flex: 1;
      height: max-content;
      width: 50%;
      .body-answer {
        box-shadow: 0 0 5px rgba(#000, 0.15);
        transition: linear 0.3s;
        &:hover {
          box-shadow: 0 0 4px rgba(#000, 0.2), 0 0 13px rgba(#000, 0.3);
        }
        .body-answer_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ffffff;
          padding: 10px 20px;
          border-bottom: 1px solid #d3d3d3;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          .content {
            display: flex;
            align-items: center;
            color: var(--color-primary);
            font-weight: 600;
            .material-icons {
              font-size: 16px;
              margin-right: 10px;
            }
          }
        }
        .post-notify-box {
          padding: 0 20px;
          box-sizing: border-box;
          transition: height 0.5s ease-in-out;
          background-color: #ffffff;
          height: 0;
          .post-notify-full {
            width: 100%;
            padding: 20px 0;
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
      }
      .body-list-answer {
        .answer-item {
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(#000, 0.15);
          margin-top: 16px;
          .answer-author {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 12px;
            .author-info {
              .name {
                font-size: 15px;
                font-weight: 600;
                margin-bottom: 6px;
                display: flex;
                align-items: center;
                &:before {
                  content: "\e7fd";
                  font-family: "Material Icons";
                  font-weight: normal;
                  font-style: normal;
                  font-size: 21px;
                  color: var(--color-primary);
                  margin-right: 8px;
                  line-height: 1;
                  letter-spacing: normal;
                  text-transform: none;
                  display: inline-block;
                  white-space: nowrap;
                  word-wrap: normal;
                  direction: ltr;
                  -webkit-font-feature-settings: "liga";
                  -webkit-font-smoothing: antialiased;
                }
              }
              .role {
                font-size: 14px;
                color: #7c8088;
              }
            }
            .answer-time {
              font-size: 14px;
              color: #7c8088;
            }
          }
          .answer-content {
            background-color: #ffffff;
            padding: 20px;
            .content {
              white-space: pre-wrap;
              overflow-wrap: anywhere;
              margin-bottom: 16px;
            }
            .list-file {
              list-style: none;
              .file-item {
                display: flex;
                align-items: center;
                position: relative;
                width: fit-content;
                max-width: 100%;
                user-select: none;
                cursor: pointer;
                border: 1px solid #8b8b8b;
                padding: 4px 38px 4px 14px;
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
                  font-size: 14px;
                }
                .material-icons {
                  position: absolute;
                  right: 10px;
                  font-size: 20px;
                  transition: 0.3s;
                }
              }
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
    .form-block {
      padding: 30px !important;
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
#form-create-ticket {
  .form-box {
    min-width: 760px;
    .form-block {
      padding: 30px;
    }
  }
  .post-notify-full {
    //padding: 15px 25px;
    margin-top: 15px;
    height: 100%;
    width: 100%;
    .header {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .title {
        display: inline-block;
        font-weight: 500;
        color: #777777;
        font-size: 15px;
        margin-right: 10px;
      }
      .el-input {
        width: unset;
        flex: 1;
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
        padding: 0 12px 9px;
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
              color: #000000;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .btn-remove {
              opacity: 1;
              visibility: unset;
            }
          }
          .file-name {
            color: #0020ff;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
  .ticket-details-body {
    flex-direction: column;
    .body-left {
      width: 100%;
      margin-bottom: 20px;
      h3 {
        margin-left: 6px;
      }
    }
    .body-right {
    }
  }
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
  #form-create-ticket {
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
