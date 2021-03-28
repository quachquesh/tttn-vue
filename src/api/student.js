import axios from "@/api";

export default {
  register(token, data) {
    return axios().post(`/student`, data, {
      headers: { Authorization: "Bearer " + token }
    });
  },
  login(mssv, password) {
    return axios().post("/student/login", {
      mssv: mssv,
      password: password
    });
  },
  logout(token) {
    return axios().get("/student/logout", {
      headers: { Authorization: "Bearer " + token }
    });
  },
  userDetails(token) {
    return axios().get("/student/details", {
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
      "/student/lock",
      { id: studentId },
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
  },
  unlockAccount(token, studentId) {
    return axios().patch(
      "/student/unlock",
      { id: studentId },
      {
        headers: { Authorization: "Bearer " + token }
      }
    );
  }
};
