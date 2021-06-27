import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  getMyGroup(token, classId) {
    return axios().get(
      "/class-subject/" + classId + "/group",
      headerAuth(token)
    );
  },
  show(token, classId, groupId) {
    return axios().get(
      "/class-subject/" + classId + "/groups/" + groupId,
      headerAuth(token)
    );
  },
  get(token, classId) {
    return axios().get(
      "/class-subject/" + classId + "/groups",
      headerAuth(token)
    );
  },
  create(token, classId, type, data) {
    return axios().post(
      "/class-subject/" + classId + "/groups/" + type,
      data,
      headerAuth(token)
    );
  },
  update(token, classId, groupId, data) {
    return axios().put(
      "/class-subject/" + classId + "/group/" + groupId,
      data,
      headerAuth(token)
    );
  },
  delete(token, classId, groupId) {
    return axios().delete(
      "/class-subject/" + classId + "/group/" + groupId,
      headerAuth(token)
    );
  },
  addNewMember(token, classId, groupId, listMembers) {
    return axios().post(
      "/class-subject/" + classId + "/group/" + groupId,
      { listMembers: listMembers },
      headerAuth(token)
    );
  },
  // Yêu cầu
  createTicket(token, classId, type, data) {
    // data: { reason: Lý do, group_going: id group gửi ticket, member_target: id member bị kick khỏi nhóm }
    return axios().post(
      "/class-subject/" + classId + "/ticket-groups/" + type,
      data,
      headerAuth(token)
    );
  },
  getTickets(token, classId) {
    return axios().get(
      "/class-subject/" + classId + "/ticket-groups",
      headerAuth(token)
    );
  },
  updateTicket(token, classId, ticketId, data) {
    // data: { status: 1: duyệt, 2: hủy }
    return axios().put(
      "/class-subject/" + classId + "/ticket-groups/" + ticketId,
      data,
      headerAuth(token)
    );
  },
  destroyTicket(token, classId, ticketId) {
    return axios().delete(
      "/class-subject/" + classId + "/ticket-groups/" + ticketId,
      headerAuth(token)
    );
  },
  // Thông báo
  createNotify(token, classId, groupId, data) {
    return axios().post(
      "/class-subject/" + classId + "/group/" + groupId + "/notify",
      data,
      headerAuth(token)
    );
  },
  updateNotify(token, classId, groupId, notifyId, formData) {
    return axios().post(
      "/class-subject/" +
        classId +
        "/group/" +
        groupId +
        "/notify/" +
        notifyId +
        "?_method=PUT",
      formData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  deleteNotify(token, classId, groupId, notifyId) {
    return axios().delete(
      "/class-subject/" + classId + "/group/" + groupId + "/notify/" + notifyId,
      headerAuth(token)
    );
  },
  // reply
  createReply(token, classId, groupId, notifyId, content) {
    return axios().post(
      "/class-subject/" +
        classId +
        "/group/" +
        groupId +
        "/notify/" +
        notifyId +
        "/reply",
      { content: content },
      headerAuth(token)
    );
  },
  updateReply(token, classId, groupId, notifyId, replyId, content) {
    return axios().put(
      "/class-subject/" +
        classId +
        "/group/" +
        groupId +
        "/notify/" +
        notifyId +
        "/reply/" +
        replyId,
      { content: content },
      headerAuth(token)
    );
  },
  deleteReply(token, classId, groupId, notifyId, replyId) {
    return axios().delete(
      "/class-subject/" +
        classId +
        "/group/" +
        groupId +
        "/notify/" +
        notifyId +
        "/reply/" +
        replyId,
      headerAuth(token)
    );
  }
};
