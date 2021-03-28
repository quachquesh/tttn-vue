import Vue from "vue";

const state = {
  isLogin: false,
  dataUser: {
    id: null,
    email: null,
    mssv: null,
    role: null,
    isActive: null,
    first_name: null,
    last_name: null,
    sex: null,
    birthday: null,
    phone_number: null,
    address: null,
    create_by: null
  }
};
const getters = {
  getDataUser: state => {
    return state.dataUser;
  },
  getIsLogin: state => {
    return state.isLogin;
  },
  getUserRole: state => {
    return state.dataUser.role;
  }
};
const mutations = {
  setStateLogin(state, isLogin) {
    state.isLogin = isLogin;
  },
  setDataUser(state, dataUser) {
    Vue.set(state, "dataUser", dataUser);
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
