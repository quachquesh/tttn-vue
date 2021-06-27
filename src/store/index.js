import Vue from "vue";
import Vuex from "vuex";

import User from "./modules/user";
import Student from "./modules/student";
import Navbar from "./modules/navbar";
import Subject from "./modules/subject";
import ClassSubject from "./modules/classSubject";
import ClassSubjectDetails from "./modules/classSubjectDetails";
import Ticket from "./modules/ticket";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    USER: User,
    STUDENT: Student,
    NAVBAR: Navbar,
    SUBJECT: Subject,
    CLASSSUBJECT: ClassSubject,
    CLASSSUBJECTDETAILS: ClassSubjectDetails,
    TICKET: Ticket
  }
});
