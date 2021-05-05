import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  create(token, data, classId) {
    return axios().post(
      "/class-member",
      {
        listStudent: data,
        classId: classId
      },
      headerAuth(token)
    );
  },
  get(token, classId) {
    return axios().get("/class-member/" + classId, headerAuth(token));
  },
  delete(token, memberId) {
    return axios().delete("/class-member/" + memberId, headerAuth(token));
  },
  deleteList(token, listMember) {
    return axios().post(
      "/class-member/list-member",
      { listMember: listMember },
      headerAuth(token)
    );
  }
};
