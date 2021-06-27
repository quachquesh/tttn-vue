import axios from "@/api";

export default {
  get(token) {
    return axios().get("/lecturer", {
      headers: { Authorization: "Bearer " + token }
    });
  },
  register(token, data) {
    return axios().post(`/lecturer`, data, {
      headers: { Authorization: "Bearer " + token }
    });
  }
};
