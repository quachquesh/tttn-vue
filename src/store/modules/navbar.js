// import Vue from "vue";

const state = {
  isClassSubject: false,
  isSubject: false,
  isListClassSubject: false
};
const getters = {
  getIsClassSubject: state => {
    return state.isClassSubject;
  },
  getIsSubject: state => {
    return state.isSubject;
  },
  getIsListClassSubject: state => {
    return state.isListClassSubject;
  }
};
const mutations = {
  setStateClassSubject(state, isClassSubject) {
    state.isClassSubject = isClassSubject;
  },
  setStateSubject(state, isSubject) {
    state.isSubject = isSubject;
  },
  setStateListClassSubject(state, isListClassSubject) {
    state.isListClassSubject = isListClassSubject;
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
