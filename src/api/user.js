import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  getDetails(token) {
    return axios().get("user/details", headerAuth(token));
  },
  login(username, password) {
    return axios().post("user/login", {
      username: username,
      password: password
    });
  },
  logout(token) {
    return axios().get("user/logout", headerAuth(token));
  }
};
