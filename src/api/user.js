import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  getDetails(token) {
    return axios().get("user/details", headerAuth(token));
  }
};
