// import Vue from "vue";
// import apiUser from "@/apis/user.js";

const state = {
  isClassRoom: false
};
const getters = {
  getIsClassRoom: state => {
    return state.isClassRoom;
  }
};
const mutations = {
  setStateClassRoom(state, isClassRoom) {
    state.isClassRoom = isClassRoom;
  }
};
const actions = {};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
