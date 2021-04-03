<!--suppress ALL -->
<template>
  <div class="card-outer">
    <div class="card-block" v-if="!dataClass">
      <div
        class="card-header"
        :style="{ backgroundImage: 'url(' + dataSubject.img + ')' }"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="dataSubject.name"
          placement="top-start"
        >
          <h3 class="card-title">{{ dataSubject.name }}</h3>
        </el-tooltip>
        <span class="card-description">{{ dataSubject.description }}</span>
      </div>
      <div class="card-body">
        <ul class="card-body__list">
          <li
            class="card-body__item"
            v-for="(time, index) in dataSubject.times"
            :key="index"
          >
            - {{ time }}
          </li>
        </ul>
      </div>
      <div class="card-footer"></div>
    </div>

    <div class="card-block" v-else-if="$store.getters.getUserRole">
      <div
        class="card-header"
        :style="{ backgroundImage: 'url(' + dataClass.img + ')' }"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="dataClass.name"
          placement="top-start"
        >
          <h3 class="card-title">{{ dataClass.name }}</h3>
        </el-tooltip>
        <span class="card-description"><span style="font-weight: 500">{{ dataClass.subject_description }}</span>: {{ dataClass.subject_name }}</span>
      </div>
      <div class="card-body">
        <span>{{ dataClass.description }}</span>
      </div>
      <div class="card-footer"></div>
    </div>

    <div class="card-block" v-else>
      <div
        class="card-header"
        :style="{ backgroundImage: 'url(' + dataClass.img + ')' }"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            dataClass.subject_description + ': ' + dataClass.subject_name
          "
          placement="top-start"
        >
          <h3 class="card-title">
            <span style="font-weight: 500">{{
              dataClass.subject_description
            }}</span
            >: {{ dataClass.subject_name }}
          </h3>
        </el-tooltip>
        <span class="card-description">{{ dataClass.name }}</span>
      </div>
      <div class="card-body">
        <span>{{ dataClass.description }}</span>
      </div>
      <div class="card-footer"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["dataSubject", "dataClass"]
};
</script>

<style lang="scss" scoped>
$padding: 25px 20px;

.card-outer {
  margin: 0px 20px;
  border-radius: 20px;
  overflow: hidden;
  max-width: 100%;
  height: 100%;
  box-shadow: 0px 0px 3px rgba(#000, 0.3);
  cursor: pointer;
  transition: linear 0.3s;
  will-change: box-shadow;

  &:hover {
    box-shadow: 0px 0px 8px rgba(rgb(10, 10, 10), 0.4);

    .card-header {
      .card-title {
        text-decoration: underline;
      }
    }
  }
  .card-block {
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    .card-header {
      border-bottom: 1px solid #d8d8d8;
      padding: $padding;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      color: #fff;
      min-height: 93px;
      .card-title,
      .card-description {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
      .card-title {
        font-weight: 500;
      }
    }

    .card-body {
      border-bottom: 1px solid #d8d8d8;
      padding: $padding;
      min-height: 100px;
      .card-body__list {
        list-style: none;
      }
      .card-body__item {
      }
    }

    .card-footer {
      height: 40px;
      padding: $padding;
    }
  }
}
</style>
