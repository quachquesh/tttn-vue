<template>
  <div class="txtarea-editor">
    <div class="body" :class="{ active: contentEdit != '' }">
      <textarea
        class="notify-content"
        @input="inputTxtArea"
        :value="contentEdit"
        :id="txtareaId"
      ></textarea>
      <span class="line"></span>
      <label>{{ content }}</label>
    </div>
    <div class="list-tools">
      <ul class="tool-groups">
        <el-tooltip
          class="item"
          effect="dark"
          content="Chèn link"
          placement="top"
        >
          <li
            @click="openFormInsertLink(txtareaId)"
            class="material-icons tool-items"
          >
            insert_link
          </li>
        </el-tooltip>
      </ul>
      <ul class="tool-groups">
        <el-tooltip class="item" effect="dark" content="Cỡ chữ" placement="top">
          <li
            class="material-icons tool-items"
            style="display: flex; align-items: center;"
          >
            <el-select
              v-model="dataInserLink.format.fontSize"
              filterable
              placeholder="Cỡ chữ"
              size="mini"
              style="width: 62px; height: 24px; user-select:none;"
              @change="
                changeAttr(txtareaId, 'fontSize', dataInserLink.format.fontSize)
              "
              @focus="focusAttr(txtareaId)"
            >
              <el-option
                v-for="size in fontSizeOptions"
                :key="size"
                :label="size"
                :value="size"
              >
              </el-option>
            </el-select>
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Chữ in đậm"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'bold')"
          >
            format_bold
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Chữ in nghiêng"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'italic')"
          >
            format_italic
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Chữ gạch chân"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'underline')"
          >
            format_underlined
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Gạch ngang chữ"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'strikethrough')"
          >
            format_strikethrough
          </li>
        </el-tooltip>
      </ul>
      <ul class="tool-groups">
        <el-tooltip
          class="item"
          effect="dark"
          content="Căn lề trái"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'align', 'left')"
          >
            format_align_left
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Căn lề giữa"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'align', 'center')"
          >
            format_align_center
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Căn lề phải"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'align', 'right')"
          >
            format_align_right
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Căn đều"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click="changeAttr(txtareaId, 'align', 'justify')"
          >
            format_align_justify
          </li>
        </el-tooltip>
      </ul>
      <ul class="tool-groups">
        <el-tooltip
          class="item"
          effect="dark"
          content="Màu chữ"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click.prevent="$refs.textColorPicker.$el.children[0].click()"
          >
            format_color_text
            <el-color-picker
              v-model="dataInserLink.format.color"
              ref="textColorPicker"
              class="tool-template"
              @change="changeAttr(txtareaId, 'color', $event)"
            ></el-color-picker>
          </li>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="Màu nền"
          placement="top"
        >
          <li
            class="material-icons tool-items"
            @click.prevent="$refs.bgColorPicker.$el.children[0].click()"
          >
            format_color_fill
            <el-color-picker
              v-model="dataInserLink.format.bgColor"
              ref="bgColorPicker"
              class="tool-template"
              @change="changeAttr(txtareaId, 'bgColor', $event)"
            ></el-color-picker>
          </li>
        </el-tooltip>
      </ul>
    </div>

    <!--  Form insert link  -->
    <transition name="fade">
      <div class="form-inser-link-box form-box" v-if="formInsertLink">
        <div class="overlay" @click="formInsertLink = false"></div>
        <form
          @submit.prevent="insertLink(txtareaId)"
          class="form-body"
          :lock-scroll="false"
        >
          <div class="form-block">
            <h3 class="form-title">Chèn link</h3>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataInserLink.format.url }"
                v-model="dataInserLink.format.url"
              />
              <label>
                URL
                <span class="required">*</span>
              </label>
            </div>
            <div class="form-group">
              <input
                type="text"
                :class="{ valid: dataInserLink.content }"
                v-model="dataInserLink.content"
              />
              <label>
                Nội dung hiển thị
              </label>
            </div>
            <div class="form-btn-group">
              <button
                class="btn btn-danger"
                @click.prevent="formInsertLink = false"
              >
                Hủy
              </button>
              <button
                class="btn btn-success"
                style="margin-left: 15px"
                @click="$customjs.clickBtnAnimation($event)"
              >
                Chèn
              </button>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    txtareaId: {
      required: true
    },
    contentEdit: {
      required: true
    },
    content: {
      default: "Nội dung thông báo cho lớp học"
    }
  },
  data() {
    return {
      formInsertLink: false,
      dataInserLink: {
        content: "",
        format: {
          url: "",
          fontSize: 16,
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          align: "",
          color: "",
          bgColor: ""
        }
      },
      fontSizeOptions: [8, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40]
    };
  },
  methods: {
    inputTxtArea(event) {
      this.$emit("input", event.target.value);
    },
    focusAttr(elementId) {
      this.$set(
        this,
        "dataInserLink",
        formatStyleTxtArea(elementId, this.contentEdit)
      );
    },
    changeAttr(elementId, type, value = undefined) {
      let dataFormatInsert = {};
      if (typeof this.dataInserLink.format[type] != "undefined") {
        this.$set(
          this,
          "dataInserLink",
          formatStyleTxtArea(elementId, this.contentEdit)
        );
        if (!value) {
          this.dataInserLink.format[type] = !this.dataInserLink.format[type];
        } else {
          this.dataInserLink.format[type] = value;
        }
        dataFormatInsert = fortmatInsert(
          elementId,
          this.dataInserLink,
          this.contentEdit
        );
        this.$emit("input", dataFormatInsert.content);
        let txtarea = document.getElementById(elementId);
        txtarea.focus();
        setTimeout(() => {
          if (dataFormatInsert.selectedStart == dataFormatInsert.selectedEnd) {
            txtarea.selectionStart = dataFormatInsert.selectedEnd_new - 9;
            txtarea.selectionEnd = dataFormatInsert.selectedEnd_new - 9;
          } else {
            txtarea.selectionStart = dataFormatInsert.selectedStart;
            txtarea.selectionEnd = dataFormatInsert.selectedEnd_new;
          }
        }, 50);
      }
    },
    openFormInsertLink(elementId) {
      this.formInsertLink = true;
      this.$set(
        this,
        "dataInserLink",
        formatStyleTxtArea(elementId, this.contentEdit)
      );
    },
    insertLink(elementId) {
      let dataFormatInsert = {};
      var pattern = new RegExp("^(http|https)(:\\/\\/)[\\pL\\d\\W\\w]*$");
      if (!pattern.test(this.dataInserLink.format.url)) {
        this.$customjs.showToast({
          title: "Lỗi URL",
          message: "URL sai định dạng, vui lòng nhập đúng định dạng",
          type: 1
        });
      } else {
        if (this.dataInserLink.content == "") {
          this.dataInserLink.content = this.dataInserLink.format.url;
        }

        dataFormatInsert = fortmatInsert(
          elementId,
          this.dataInserLink,
          this.contentEdit
        );
        this.$emit("input", dataFormatInsert.content);
        this.formInsertLink = false;
        let txtarea = document.getElementById(elementId);
        txtarea.focus();
        setTimeout(() => {
          txtarea.selectionStart = dataFormatInsert.selectedStart;
          txtarea.selectionEnd = dataFormatInsert.selectedEnd_new;
        }, 50);
      }
    }
  }
};
function formatStyleTxtArea(elementId, txtareaValue) {
  let data = {
    content: "",
    format: {
      url: "",
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      align: "",
      color: "",
      bgColor: ""
    }
  };

  let txtarea = document.getElementById(elementId);
  let selectedStart = txtarea.selectionStart;
  let selectedEnd = txtarea.selectionEnd;

  data.content = txtareaValue.slice(selectedStart, selectedEnd);
  var pattern = new RegExp(
    "^(\\[FORMAT[\\s\\w\\d\\W]*\\])([\\pL\\d\\W\\w]*)?(\\[\\/FORMAT\\])$"
  );
  if (pattern.test(data.content)) {
    // [FORMAT url="http://localhost:8080/c/10/"]sadas[/FORMAT]
    let regex = pattern.exec(data.content);
    // Lấy được nội dung
    data.content = regex[2] ? regex[2] : "";
    // Lấy thuộc tính
    let arrAttr = regex[1].split(" ");
    arrAttr.forEach(attr => {
      let attrDetails = attr.split('"');
      if (attrDetails.length > 0) {
        switch (attrDetails[0].split("]")[0]) {
          case "url=":
            data.format.url = attrDetails[1];
            break;
          case "fontSize=":
            if (attrDetails[1] > 40 || attrDetails[1] < 8) {
              data.format.fontSize = 16;
            } else {
              data.format.fontSize = attrDetails[1];
            }
            break;
          case "bold":
            data.format.bold = true;
            break;
          case "italic":
            data.format.italic = true;
            break;
          case "underline":
            data.format.underline = true;
            break;
          case "strikethrough":
            data.format.strikethrough = true;
            break;
          case "align=":
            data.format.align = attrDetails[1];
            break;
          case "color=":
            data.format.color = attrDetails[1];
            break;
          case "bgColor=":
            data.format.bgColor = attrDetails[1];
            break;
        }
      }
    });
  }
  return data;
}
function fortmatInsert(elementId, dataOptions, content) {
  let txtarea = document.getElementById(elementId);
  let selectedStart = txtarea.selectionStart;
  let selectedEnd = txtarea.selectionEnd;

  let strStart = content.slice(0, selectedStart);
  let strEnd = content.slice(selectedEnd, content.length);
  let txtOption = "";
  for (const key in dataOptions.format) {
    if (key == "url" && dataOptions.format[key] != "") {
      txtOption += ` url="${dataOptions.format[key]}"`;
    } else if (key == "fontSize" && dataOptions.format[key] != "") {
      txtOption += ` fontSize="${dataOptions.format[key]}"`;
    } else if (key == "bold" && dataOptions.format[key] == true) {
      txtOption += " bold";
    } else if (key == "italic" && dataOptions.format[key] == true) {
      txtOption += " italic";
    } else if (key == "underline" && dataOptions.format[key] == true) {
      txtOption += " underline";
    } else if (key == "strikethrough" && dataOptions.format[key] == true) {
      txtOption += " strikethrough";
    } else if (key == "align" && dataOptions.format[key] != "") {
      txtOption += ` align="${dataOptions.format[key]}"`;
    } else if (key == "color" && dataOptions.format[key] != "") {
      txtOption += ` color="${dataOptions.format[key]}"`;
    } else if (key == "bgColor" && dataOptions.format[key] != "") {
      txtOption += ` bgColor="${dataOptions.format[key]}"`;
    }
  }
  let strInsert = `[FORMAT${txtOption}]${dataOptions.content}[/FORMAT]`;
  return {
    strInsert: strInsert,
    content: `${strStart}${strInsert}${strEnd}`,
    selectedEnd_new: strInsert.length + selectedStart,
    selectedEnd: selectedEnd,
    selectedStart: selectedStart
  };
}
</script>

<style scoped lang="scss">
.txtarea-editor {
  margin-top: 20px;
  .body {
    width: 100%;
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
  .list-tools {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 5px;
    .tool-groups {
      padding: 0 5px;
      border-right: 1px solid #000;
      display: flex;
      align-items: center;
      &:last-child {
        padding-right: 0;
        border-right: unset;
      }
      .tool-items {
        margin: 0 4px;
        user-select: none;
        cursor: pointer;
        position: relative;
        .tool-template {
          opacity: 0;
          visibility: hidden;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
      }
    }
  }
  .form-inser-link-box {
    z-index: 1500;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 20px;
    overflow: hidden;
    .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      background-color: rgba(#000, 0.4);
      -webkit-tap-highlight-color: transparent;
    }
    form {
      min-width: 400px;
      max-width: 90%;
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%);
      .form-block {
        box-shadow: 7px 7px 14px rgba(#000, 0.2), -3px -3px 7px rgba(#ddd, 1);
      }
      .group-row {
        margin-top: 18px;
        .title {
          font-weight: 500;
          font-size: 16px;
          margin-right: 16px;
          .required {
            color: red;
          }
        }
      }
    }
  }
}
</style>
