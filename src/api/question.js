import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  get(token, classId) {
    return axios().get(
      "/class-subject/" + classId + "/question",
      headerAuth(token)
    );
  },
  create(token, classId, formData) {
    return axios().post("/class-subject/" + classId + "/question", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  update(token, classId, questionId, formData) {
    return axios().post(
      "/class-subject/" + classId + "/question/" + questionId + "?_method=PUT",
      formData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  delete(token, classId, questionId) {
    return axios().delete(
      "/class-subject/" + classId + "/question/" + questionId,
      headerAuth(token)
    );
  },

  createReply(token, classId, questionId, content) {
    return axios().post(
      "/class-subject/" + classId + "/question/" + questionId + "/reply",
      { content: content },
      headerAuth(token)
    );
  },
  updateReply(token, classId, questionId, replyId, content) {
    return axios().put(
      "/class-subject/" +
        classId +
        "/question/" +
        questionId +
        "/reply/" +
        replyId,
      { content: content },
      headerAuth(token)
    );
  },
  deleteReply(token, classId, questionId, replyId) {
    return axios().delete(
      "/class-subject/" +
        classId +
        "/question/" +
        questionId +
        "/reply/" +
        replyId,
      headerAuth(token)
    );
  }
};
