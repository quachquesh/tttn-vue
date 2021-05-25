import axios from "@/api";

export default {
  register(token, data) {
    return axios().post(`/lecturer`, data, {
      headers: { Authorization: "Bearer " + token }
    });
  }
};
