import Vue from "vue";
import apiClassSubject from "@/api/classSubject";

const state = {
  subjectId: null, // id môn học hiện tại
  classSubjects: [], // Các lớp hiện tại của môn học
  myClassSubjects: [] // Các môn user quản lý
};
const getters = {
  getClassSubject(state) {
    return state.classSubjects;
  },
  getMyClassSubjects(state) {
    return state.myClassSubjects;
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
  setDataMyClassSubject(state, data) {
    Vue.set(state, "myClassSubjects", data);
  },
  setDataMyClassSubjectById(state, [id, data]) {
    state.myClassSubjects.forEach((cs, index) => {
      if (cs.id == id) {
        Vue.set(state.myClassSubjects, index, data);
      }
    });
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
  apiGetMyClassSubject({ commit }, token) {
    return apiClassSubject.getByUser(token);
  },
  apiCreateClassSubject({ commit }, [token, data]) {
    return apiClassSubject.create(token, data);
  },
  apiUpdateClassSubject({ commit }, [token, id, data]) {
    return apiClassSubject.update(token, id, data);
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
