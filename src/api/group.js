import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  get(token, classId) {
    return axios().get(
      "/class-subject/" + classId + "/groups",
      headerAuth(token)
    );
  },
  create(token, classId, type) {
    return axios().post(
      "/class-subject/" + classId + "/groups/" + type,
      headerAuth(token)
    );
  }
};
