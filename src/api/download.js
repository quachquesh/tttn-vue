import axios from "@/api";

// function headerAuth(token) {
//   return {
//     headers: { Authorization: "Bearer " + token }
//   };
// }

export default {
  getFile(token, filePath) {
    return axios().get("/download?filePath=" + filePath, {
      responseType: "blob",
      headers: { Authorization: "Bearer " + token }
    });
  }
};
