import Vue from "vue";

const state = {
  notifies: [], // Các thông báo trong lớp học
  questions: [], // Các thảo luận trong lớp học
  classSubject: {}, // Chi tiết lớp hiện tại
  subject: {}, // chi tiết môn học hiện tại
  classMembers: [], // danh sách các thành viên trong lớp
  classLecturer: {}, // Thông tin giảng viên của lớp học hiện tại
  group: {
    isJoinGroup: false, // Đã tham gia nhóm
    myGroup: {}, // Nhóm của tôi
    isGroupLeader: false, // Nhóm trưởng
    listGroups: [] // Danh sách nhóm
  }
};
const getters = {
  getNotifies(state) {
    return state.notifies;
  },
  getQuestions(state) {
    return state.questions;
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
  },
  getMyGroup(state) {
    return state.group.myGroup;
  }
};
const mutations = {
  setClassNotifies(state, data) {
    Vue.set(state, "notifies", data);
  },
  setClassQuestions(state, data) {
    Vue.set(state, "questions", data);
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
  addQuestion(state, data) {
    state.questions.unshift(data);
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
  deleteQuestion(state, index) {
    Vue.delete(state.questions, index);
  },
  updateQuestion(state, { index, data }) {
    for (const key in data) {
      Vue.set(state.questions[index], key, data[key]);
    }
  },
  updateQuestionReply(state, { questionIndex, cmtIndex, cmt }) {
    for (const key in cmt) {
      Vue.set(state.questions[questionIndex].comment[cmtIndex], key, cmt[key]);
    }
  },
  deleteQuestionReply(state, { questionIndex, cmtIndex }) {
    Vue.delete(state.questions[questionIndex].comment, cmtIndex);
  },
  deleteMemberByMemberId(state, member_id) {
    state.classMembers.forEach((member, index) => {
      if (member.member_id == member_id) {
        state.classMembers.splice(index, 1);
      }
    });
  },
  createGroup(state, data) {
    Vue.set(state.group, "myGroup", data);
    state.group.isJoinGroup = true;
    state.group.isGroupLeader = true;
  },
  createGroupNotify(state, data) {
    state.group.myGroup.notifies.unshift(data);
  },
  updateGroupNotify(state, { index, data }) {
    for (const key in data) {
      Vue.set(state.group.myGroup.notifies[index], key, data[key]);
    }
  },
  deleteGroupNotify(state, index) {
    Vue.delete(state.group.myGroup.notifies, index);
  },
  updateGroupNotifyReply(state, { notifyIndex, cmtIndex, cmt }) {
    for (const key in cmt) {
      Vue.set(
        state.group.myGroup.notifies[notifyIndex].comment[cmtIndex],
        key,
        cmt[key]
      );
    }
  },
  deleteGroupNotifyReply(state, { notifyIndex, cmtIndex }) {
    Vue.delete(state.group.myGroup.notifies[notifyIndex].comment, cmtIndex);
  },
  deleteMyGroup(state) {
    Vue.set(state.group, "myGroup", {});
    state.group.isGroupLeader = false;
    state.group.isJoinGroup = false;
  },
  updateMyGroup(state, data) {
    state.group.myGroup.name = data.name;
    state.group.myGroup.description = data.description;
    state.group.myGroup.note = data.note;
  },
  setDataMyGroup(state, { data, isJoinGroup = false }) {
    Vue.set(state.group, "myGroup", data);
    Vue.set(state.group, "isJoinGroup", isJoinGroup);
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
