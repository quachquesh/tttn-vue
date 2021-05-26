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
  }
};
