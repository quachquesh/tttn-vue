import Vue from "vue";
import apiClassSubject from "@/api/classSubject";

const state = {
  subjectId: null, // id môn học hiện tại
  classSubjects: [] // Các lớp hiện tại của môn học
};
const getters = {
  getClassSubject(state) {
    return state.classSubjects;
  },
  getSubjectCurrentId(state) {
    return state.subjectId;
  },
  getClassSubjectById(state) {
    return id => {
      state.classSubjects.forEach(classSubject => {
        if (classSubject.id == id) {
          return classSubject;
        }
      });
      return false;
    };
  }
};
const mutations = {
  setDataClassSubject(state, data) {
    Vue.set(state, "classSubjects", data);
  },
  setSubjectId(state, id) {
    state.subjectId = id;
  },
  addClassSubject(state, data) {
    state.classSubjects.push(data);
  }
};
const actions = {
  /* eslint-disable */
  apiGetClassSubject({ commit }, [token, subjectId]) {
    return apiClassSubject.get(token, subjectId);
  },
  apiGetClassSubjectMember({ commit }, token) {
    return apiClassSubject.getByUser(token);
  },
  apiCreateClassSubject({ commit }, [token, data]) {
    return apiClassSubject.create(token, data);
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
