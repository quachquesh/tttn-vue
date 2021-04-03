import Vue from "vue";
import apiStudent from "@/api/student";

const state = {
  students: []
};
const getters = {};
const mutations = {
  setDataStudent(state, data) {
    Vue.set(state, "students", data);
  }
};
const actions = {
  // eslint-disable-next-line
  reqGetAllStudent({ commit }, token) {
    return apiStudent.getAllStudent(token);
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
