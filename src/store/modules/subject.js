import Vue from "vue";
import apiSubject from "@/api/subject";

const state = {
  subjects: [], // các môn học hiện tại của giảng viên
  allSubjects: [] // Tất cả môn học trên hệ thống
};
const getters = {
  getSubjects(state) {
    return state.subjects;
  },
  getAllSubjects(state) {
    return state.allSubjects;
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
  setDataAllSubject(state, data) {
    Vue.set(state, "allSubjects", data);
  },
  addDataAllSubject(state, data) {
    state.allSubjects.push(data);
  },
  setDataAllSubjectKey(state, [id, key, value]) {
    state.allSubjects.forEach((subject, index) => {
      if (subject.id == id) {
        Vue.set(state.allSubjects[index], key, value);
        return true;
      }
    });
    return false;
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
  apiGetSubjects({ commit }, token) {
    return apiSubject.get(token);
  },
  apiGetAllSubjects({ commit }, token) {
    return apiSubject.getAll(token);
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
