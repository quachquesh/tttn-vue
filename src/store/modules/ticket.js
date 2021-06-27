import Vue from "vue";

const state = {
  tickets: []
};
const getters = {
  getDataTickets: state => {
    return state.tickets;
  }
};
const mutations = {
  setDataTickets(state, data) {
    Vue.set(state, "tickets", data);
  },
  addTicket(state, data) {
    state.tickets.unshift(data);
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
