import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  create(token, data) {
    return axios().post("/subject", data, headerAuth(token));
  },
  get(token) {
    return axios().get("/subject", headerAuth(token));
  },
  getAll(token) {
    return axios().get("/subject/all", headerAuth(token));
  },
  getByUserId(token) {
    return axios().get("/subject/user", headerAuth(token));
  },
  getById(subjectId) {
    return axios().get("/subject/" + subjectId);
  }
};
