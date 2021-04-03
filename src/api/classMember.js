import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  create(token, data, classId, override, type) {
    return axios().post(
      "/class-member",
      {
        listStudent: data,
        classId: classId,
        override: override,
        type: type
      },
      headerAuth(token)
    );
  },
  get(token, classId) {
    return axios().get("/class-member/" + classId, headerAuth(token));
  }
};