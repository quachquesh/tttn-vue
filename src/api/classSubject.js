import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  create(token, data) {
    return axios().post("/class-subject", data, headerAuth(token));
  },
  get(token, subjectId) {
    return axios().get(
      "/class-subject/subject/" + subjectId,
      headerAuth(token)
    );
  },
  update(token, id, data) {
    return axios().put("/class-subject/" + id, data, headerAuth(token));
  },
  getById(classId) {
    return axios().get("/class-subject/" + classId);
  },
  getByUser(token) {
    return axios().get("/class-subject/user", headerAuth(token));
  },
  getAllInfo(token, classId) {
    return axios().get("/class-subject/all-info/" + classId, headerAuth(token));
  }
};
