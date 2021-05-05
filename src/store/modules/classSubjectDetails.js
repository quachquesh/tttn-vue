import Vue from "vue";

const state = {
  notifies: [], // Các thông báo trong lớp học
  classSubject: {}, // Chi tiết lớp hiện tại
  subject: {}, // chi tiết môn học hiện tại
  classMembers: [], // danh sách các thành viên trong lớp
  classLecturer: {} // Thông tin giảng viên của lớp học hiện tại
};
const getters = {
  getnotifies(state) {
    return state.notifies;
  },
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
  setClassNotifies(state, data) {
    Vue.set(state, "notifies", data);
  },
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
  addNewMember(state, data) {
    Vue.set(state, "classMembers", [...state.classMembers, ...data]);
  },
  addNotify(state, data) {
    state.notifies.unshift(data);
  },
  deleteNotify(state, index) {
    Vue.delete(state.notifies, index);
  },
  updateNotify(state, { index, data }) {
    for (const key in data) {
      Vue.set(state.notifies[index], key, data[key]);
    }
  },
  updateNotifyReply(state, { notifyIndex, cmtIndex, cmt }) {
    for (const key in cmt) {
      Vue.set(state.notifies[notifyIndex].comment[cmtIndex], key, cmt[key]);
    }
  },
  deleteNotifyReply(state, { notifyIndex, cmtIndex }) {
    Vue.delete(state.notifies[notifyIndex].comment, cmtIndex);
  },
  deleteMemberByMemberId(state, member_id) {
    state.classMembers.forEach((member, index) => {
      if (member.member_id == member_id) {
        state.classMembers.splice(index, 1);
      }
    });
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
