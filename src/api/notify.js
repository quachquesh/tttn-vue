import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  create(token, classId, formData) {
    return axios().post("/notify/" + classId, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  delete(token, classId, notifyId) {
    return axios().delete(
      "/notify/" + classId + "/" + notifyId,
      headerAuth(token)
    );
  },
  getListMember(token, notifyId) {
    return axios().get("/notify/listMember/" + notifyId, headerAuth(token));
  },
  update(token, formData, notifyId) {
    return axios().post("/notify/" + notifyId + "?_method=PUT", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
      }
    });
  },

  createReply(token, notifyId, content) {
    return axios().post(
      "notify/" + notifyId + "/reply",
      { content: content },
      headerAuth(token)
    );
  },
  updateReply(token, content, classId, replyId) {
    return axios().put(
      "/notify/" + classId + "/reply/" + replyId,
      { content: content },
      headerAuth(token)
    );
  },
  deleteReply(token, classId, replyId) {
    return axios().delete(
      "/notify/" + classId + "/reply/" + replyId,
      headerAuth(token)
    );
  }
};
