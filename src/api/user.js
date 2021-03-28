import axios from "@/api";

export default {
  logout(token) {
    return axios().get("/user/logout", {
      headers: { Authorization: "Bearer " + token }
    });
  }
};
