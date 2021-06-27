import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "vue-nprogress";
import store from "../store";

import Home from "../views/Home.vue";

Vue.use(VueRouter);
Vue.use(NProgress);

const nprogress = new NProgress();
nprogress.configure({
  showSpinner: false,
  speed: 300
});

const checkLogin = (to, from, next) => {
  // Lần đầu load trang
  if (store.getters.getUserId == null) {
    store
      .dispatch("checkLogin")
      .then(() => {
        next();
      })
      .catch(() => {
        next({ name: "Login" });
      });
  } else {
    // Chuyển router không load trang
    if (store.getters.getIsLogin == true) {
      next();
    } else {
      next({ name: "Login" });
    }
  }
};

const checkAdmin = (to, from, next) => {
  // Nếu reload trang
  if (store.getters.getUserId == null) {
    store
      .dispatch("checkLogin")
      .then(res => {
        if (res.role == "admin") {
          next();
        } else {
          next("/");
        }
      })
      .catch(() => {
        next({ name: "Login" });
      });
  } else {
    // Chuyển router không load trang
    if (store.getters.getUserRole == "admin") {
      next();
    } else if (store.getters.getIsLogin == false) {
      next({ name: "Login" });
    } else {
      next("/");
    }
  }
};

const checkRole = (to, from, next) => {
  // Nếu reload trang
  if (store.getters.getUserId == null) {
    store
      .dispatch("checkLogin")
      .then(res => {
        if (res.role) {
          next();
        } else {
          next({ name: "Home" });
        }
      })
      .catch(() => {
        next({ name: "Login" });
      });
  } else {
    // Chuyển router không load trang
    if (store.getters.getUserRole) {
      next();
    } else if (store.getters.getIsLogin == false) {
      next({ name: "Login" });
    } else {
      next({ name: "Home" });
    }
  }
};

function loadView(view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}`);
}

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      transition: "slide-right",
      title: "Danh sách môn học"
    },
    beforeEnter: checkLogin,
    children: [
      {
        path: "",
        name: "Home",
        components: {
          default: loadView("ListSubject.vue"),
          ListClassSubject: loadView("ListClassSubject.vue")
        },
        meta: {
          transition: "slide-left",
          title: "Trang chủ"
        }
      },
      {
        path: "/ticket-manager",
        name: "TicketManager",
        component: loadView("TicketManager.vue"),
        meta: {
          transition: "slide-left",
          title: "Quản lý Yêu cầu"
        }
      },
      {
        path: "/subject-manager",
        name: "SubjectManager",
        component: loadView("SubjectManager.vue"),
        beforeEnter: checkRole,
        meta: {
          transition: "slide-left",
          title: "Quản lý môn học"
        }
      },
      {
        path: "/class-subject-manager",
        name: "ClassSubjectManager",
        component: loadView("ClassSubjectManager.vue"),
        beforeEnter: checkRole,
        meta: {
          transition: "slide-left",
          title: "Quản lý lớp học"
        }
      }
    ]
  },

  {
    path: "/dang-nhap",
    name: "Login",
    meta: {
      transition: "slide-left",
      title: "Đăng nhập"
    },
    component: loadView("Login.vue")
  },
  {
    path: "/mh/:subjectId",
    name: "ListClassSubject",
    meta: {
      transition: "slide-left",
      title: "Danh sách lớp học"
    },
    component: loadView("ListClassSubject.vue"),
    props: true,
    beforeEnter: checkLogin
  },
  {
    path: "/c/:roomId",
    component: loadView("ClassSubject.vue"),
    meta: {
      transition: "slide-down",
      title: "Lớp học"
    },
    beforeEnter: checkLogin,
    props: true,
    children: [
      {
        path: "",
        name: "ClassSubject",
        component: loadView("class_subject/News.vue"),
        meta: {
          transition: "slide-down",
          title: "Bảng tin"
        },
        props: true
      },
      {
        path: "question",
        name: "Question",
        component: loadView("class_subject/Question.vue"),
        meta: {
          transition: "slide-down",
          title: "Thảo luận"
        },
        props: true
      },
      {
        path: "exercise",
        name: "Exercise",
        component: loadView("class_subject/Exercise.vue"),
        meta: {
          transition: "slide-down",
          title: "Bài tập"
        },
        props: true
      },
      {
        path: "group",
        component: loadView("class_subject/Group.vue"),
        meta: {
          transition: "slide-down",
          title: "Nhóm"
        },
        props: true,
        children: [
          {
            path: "",
            name: "Group",
            component: loadView("class_subject/group_manager/MyGroup.vue"),
            meta: {
              transition: "slide-down",
              title: "Nhóm"
            },
            props: true
          },
          {
            path: "list-group",
            name: "ListGroups",
            component: loadView("class_subject/group_manager/ListGroups.vue"),
            meta: {
              transition: "slide-down",
              title: "Danh sách nhóm"
            },
            props: true
          },
          {
            path: "group-member",
            name: "GroupMembers",
            component: loadView("class_subject/group_manager/GroupMembers.vue"),
            meta: {
              transition: "slide-down",
              title: "Thành viên nhóm"
            },
            props: true
          },
          {
            path: "approves",
            name: "Approves",
            component: loadView("class_subject/group_manager/Approves.vue"),
            meta: {
              transition: "slide-down",
              title: "Phê duyệt"
            },
            props: true
          },
          {
            path: "settings",
            name: "Settings",
            component: loadView("class_subject/group_manager/Settings.vue"),
            meta: {
              transition: "slide-down",
              title: "Cài đặt"
            },
            props: true
          }
        ]
      },
      {
        path: "members",
        name: "Members",
        component: loadView("class_subject/Members.vue"),
        meta: {
          transition: "slide-down",
          title: "Thành viên"
        },
        props: true
      }
    ]
  },
  {
    path: "/account",
    name: "UserManager",
    meta: {
      transition: "slide-left",
      title: "Tạo sinh viên mới"
    },
    component: loadView("UserManager.vue"),
    beforeEnter: checkAdmin,
    children: [
      {
        path: "/student",
        name: "CreateStudent",
        meta: {
          transition: "slide-left",
          title: "Tạo sinh viên mới"
        },
        component: loadView("user_manager/CreateStudent.vue")
      },
      {
        path: "/student-import",
        name: "ImportStudent",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách sinh viên mới"
        },
        component: loadView("user_manager/ImportStudent.vue")
      },
      {
        path: "/student-management",
        name: "StudentManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý sinh viên"
        },
        component: loadView("user_manager/Students.vue")
      },
      {
        path: "/lecturer",
        name: "CreateLecturer",
        meta: {
          transition: "slide-left",
          title: "Tạo giảng viên mới"
        },
        component: loadView("user_manager/CreateLecturer.vue")
      },
      {
        path: "/lecturer-import",
        name: "ImportLecturer",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách giảng viên mới"
        },
        component: loadView("user_manager/ImportLecturer.vue")
      },
      {
        path: "/lecturer-management",
        name: "LecturerManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý giảng viên"
        },
        component: loadView("user_manager/Lecturers.vue")
      }
    ]
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  nprogress
});

router.beforeEach((to, from, next) => {
  if (to.name != "Login" && !localStorage.getItem("token_user"))
    next({ name: "Login" });
  else if (to.name == "Login" && localStorage.getItem("token_user"))
    next({ name: "Home" });
  else {
    nprogress.start();
    nprogress.set(0.1);
    nprogress.configure({ parent: "#app-body" });
    next();
  }
});

export default router;
