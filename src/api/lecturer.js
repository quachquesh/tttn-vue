import axios from "@/api";

export default {
  register(token, data) {
    return axios().post(`/lecturer`, data, {
      headers: { Authorization: "Bearer " + token }
    });
  },
  login(email, password) {
    return axios().post("/lecturer/login", {
      email: email,
      password: password
    });
  },
  logout(token) {
    return axios().get("/lecturer/logout", {
      headers: { Authorization: "Bearer " + token }
    });
  },
  userDetails(token) {
    return axios().get("/lecturer/details", {
      headers: { Authorization: "Bearer " + token }
    });
  }
};
