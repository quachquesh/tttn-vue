import Vue from "vue";
import Vuex from "vuex";

import User from "./modules/user";
import Navbar from "./modules/navbar";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    USER: User,
    NAVBAR: Navbar
  }
});
