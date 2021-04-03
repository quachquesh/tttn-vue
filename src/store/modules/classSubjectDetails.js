import Vue from "vue";

const state = {
  classSubject: {}, // Chi tiết lớp hiện tại
  subject: {}, // chi tiết môn học hiện tại
  classMembers: [], // danh sách các thành viên trong lớp
  classLecturer: {} // Thông tin giảng viên của lớp học hiện tại
};
const getters = {
  getClassDetails(state) {
    return state.classSubject;
  },
  getSubjectDetails(state) {
    return state.subject;
  },
  getClassMembers(state) {
    return state.classMembers;
  },
  getClassLecturer(state) {
    return state.classLecturer;
  }
};
const mutations = {
  setClassSubjectDetails(state, data) {
    Vue.set(state, "classSubject", data);
  },
  setSubjectDetails(state, data) {
    Vue.set(state, "subject", data);
  },
  setClassMember(state, data) {
    Vue.set(state, "classMembers", data);
  },
  setClassLecturer(state, data) {
    Vue.set(state, "classLecturer", data);
  },
  addNewMember(statue, data) {
    Vue.set(state, "classMembers", [...state.classMembers, ...data]);
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
