import axios from "@/api";

function headerAuth(token) {
  return {
    headers: { Authorization: "Bearer " + token }
  };
}

export default {
  get(token) {
    return axios().get("ticket", headerAuth(token));
  },
  create(token, data) {
    // { lecturer_take, content, listFiles, title }
    return axios().post("ticket", data, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  reply(token, ticketId, data) {
    // { content, listFiles }
    return axios().post("ticket/" + ticketId, data, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data"
      }
    });
  },
  update(token, ticketId) {
    return axios().put("ticket/" + ticketId, {}, headerAuth(token));
  },
  show(token, ticketId) {
    return axios().get("ticket/" + ticketId, headerAuth(token));
  }
};
