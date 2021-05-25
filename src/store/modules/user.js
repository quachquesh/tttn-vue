import Vue from "vue";
// import apiLecturer from "@/api/lecturer";
// import apiStudent from "@/api/student";
import apiUser from "@/api/user";

const state = {
  token: localStorage.getItem("token_user") || "",
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
  },
  getUserId: state => {
    return state.dataUser.id;
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
const actions = {
  login({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      apiUser
        .login(username, password)
        .then(res => {
          if (res.data.status) {
            localStorage.setItem("token_user", res.data.data.token);
            commit("setDataUser", res.data.data);
            commit("setStateLogin", true);
          }
          resolve(res.data);
        })
        .catch(() => {
          reject();
        });
    });
  },
  logout({ commit }) {
    let token_user = localStorage.getItem("token_user");
    return new Promise((resolve, reject) => {
      if (token_user) {
        apiUser
          .logout(token_user)
          .then(res => {
            if (res.data.status) {
              commit("setStateLogin", false);
              commit("setDataUser", {
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
                address: null
              });
              localStorage.removeItem("token_user");
              resolve(res.data);
            }
          })
          .catch(() => {
            reject();
          });
      }
    });
  },
  checkLogin({ commit }) {
    let token_user = localStorage.getItem("token_user");
    return new Promise((resolve, reject) => {
      if (token_user) {
        apiUser
          .getDetails(token_user)
          .then(res => {
            commit("setStateLogin", true);
            commit("setDataUser", res.data);
            resolve(res.data);
          })
          .catch(() => {
            commit("setStateLogin", false);
            localStorage.removeItem("token_user");
            reject();
          });
      } else {
        commit("setStateLogin", false);
        reject();
      }
    });
  }
  // checkLogin({ commit }) {
  //   let token_user = localStorage.getItem("token_user");
  //   return new Promise((resolve, reject) => {
  //     if (token_user) {
  //       apiLecturer
  //         .userDetails(token_user)
  //         .then(res => {
  //           commit("setStateLogin", true);
  //           commit("setDataUser", res.data);
  //           resolve(res.data);
  //         })
  //         .catch(err => {
  //           if (
  //             err.response.data.message === "Unauthenticated." ||
  //             err.response.data.message === "Invalid scope(s) provided."
  //           ) {
  //             apiStudent
  //               .userDetails(token_user)
  //               .then(res => {
  //                 commit("setStateLogin", true);
  //                 commit("setDataUser", res.data);
  //                 resolve(res.data);
  //               })
  //               .catch(() => {
  //                 commit("setStateLogin", false);
  //                 localStorage.removeItem("token_user");
  //                 reject();
  //               });
  //           } else {
  //             localStorage.removeItem("token_user");
  //             commit("setStateLogin", false);
  //             reject();
  //           }
  //         });
  //     } else {
  //       commit("setStateLogin", false);
  //       reject();
  //     }
  //   });
  // }
};

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
};
