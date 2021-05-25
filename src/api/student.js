import axios from "@/api";

export default {
  register(token, data) {
    return axios().post(`/student`, data, {
      headers: { Authorization: "Bearer " + token }
    });
  },
  createListStudent(token, tableHeader, dataTable) {
    return axios().post(
      "/student/create-list",
      { tableHeader: tableHeader, dataTable: dataTable },
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
  },
  getAllStudent(token) {
    return axios().get("/student", {
      headers: { Authorization: "Bearer " + token }
    });
  },
  lockAccount(token, studentId) {
    return axios().patch(
      "/student/lock/" + studentId,
      {},
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
  },
  unlockAccount(token, studentId) {
    return axios().patch(
      "/student/unlock/" + studentId,
      {},
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
  },
  editUser(token, studentId, dataEdit) {
    return axios().put("/student/" + studentId, dataEdit, {
      headers: { Authorization: "Bearer " + token }
    });
  }
};
