import Vue from "vue";
import apiSubject from "@/api/subject";

const state = {
  subjects: [] // các môn học hiện tại của giảng viên
};
const getters = {
  getSubjects(state) {
    return state.subjects;
  },
  getSubjectById(state) {
    return id => {
      state.subjects.forEach(subject => {
        if (subject.id == id) {
          return subject;
        }
      });
      return false;
    };
  }
};
const mutations = {
  setDataSubject(state, data) {
    Vue.set(state, "subjects", data);
  },
  addNewSubject(state, subjectNew) {
    let flag = false;
    state.subjects.forEach(subject => {
      if (subject.id == subjectNew.id) {
        flag = true;
      }
    });
    if (!flag) {
      state.subjects.push(subjectNew);
    }
  }
};
const actions = {
  /* eslint-disable */
  apiGetSubjectByUserId({ commit }, token) {
    return apiSubject.getByUserId(token);
  },
  apiGetAllSubjects({ commit }, token) {
    return apiSubject.get(token);
  },
  apiCreateSubject({ commit }, [token, data]) {
    return apiSubject.create(token, data)
  }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
