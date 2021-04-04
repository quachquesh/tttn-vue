import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import custom from "../public/assets/js/custom";
// vue-data-tables
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import lang from "element-ui/lib/locale/lang/vi";
import locale from "element-ui/lib/locale";
import { DataTables } from "vue-data-tables";

import ClickOut from "clickout-event";

locale.use(lang);
Vue.use(ElementUI);
Vue.use(DataTables);

Vue.use(ClickOut);

Vue.config.productionTip = false;
Vue.prototype.$customjs = custom;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
