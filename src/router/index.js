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
  if (store.getters.getUserId === null) {
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
    if (store.getters.getIsLogin === true) {
      next();
    } else {
      next({ name: "Login" });
    }
  }
};

const checkAdmin = (to, from, next) => {
  // Nếu reload trang
  if (store.getters.getUserId === null) {
    store
      .dispatch("checkLogin")
      .then(res => {
        if (res.role === "admin") {
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
    if (store.getters.getUserRole === "admin") {
      next();
    } else if (store.getters.getIsLogin === false) {
      next({ name: "Login" });
    } else {
      next("/");
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
          ListClassRoom: loadView("ListClassRoom.vue")
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
    name: "ListClassRoom",
    meta: {
      transition: "slide-left",
      title: "Danh sách lớp học"
    },
    component: loadView("ListClassRoom.vue"),
    props: true,
    beforeEnter: checkLogin
  },
  {
    path: "/c/:roomId",
    component: loadView("ClassRoom.vue"),
    meta: {
      transition: "slide-down",
      title: "Lớp học"
    },
    beforeEnter: checkLogin,
    props: true,
    children: [
      {
        path: "",
        name: "ClassRoom",
        component: loadView("classroom/News.vue"),
        meta: {
          transition: "slide-down",
          title: "Bảng tin"
        },
        props: true
      },
      {
        path: "question",
        name: "Question",
        component: loadView("classroom/Question.vue"),
        meta: {
          transition: "slide-down",
          title: "Thảo luận"
        },
        props: true
      },
      {
        path: "exercise",
        name: "Exercise",
        component: loadView("classroom/Exercise.vue"),
        meta: {
          transition: "slide-down",
          title: "Bài tập"
        },
        props: true
      },
      {
        path: "groups",
        name: "Groups",
        component: loadView("classroom/Groups.vue"),
        meta: {
          transition: "slide-down",
          title: "Nhóm"
        },
        props: true
      },
      {
        path: "members",
        name: "Members",
        component: loadView("classroom/Members.vue"),
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
    name: "CreateUser",
    meta: {
      transition: "slide-left",
      title: "Tạo sinh viên mới"
    },
    component: loadView("CreateUser.vue"),
    beforeEnter: checkAdmin,
    children: [
      {
        path: "/student",
        name: "CreateStudent",
        meta: {
          transition: "slide-left",
          title: "Tạo sinh viên mới"
        },
        component: loadView("create_user/CreateStudent.vue")
      },
      {
        path: "/student-import",
        name: "ImportStudent",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách sinh viên mới"
        },
        component: loadView("create_user/ImportStudent.vue")
      },
      {
        path: "/student-management",
        name: "StudentManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý sinh viên"
        },
        component: loadView("create_user/Students.vue")
      },
      {
        path: "/lecturer",
        name: "CreateLecturer",
        meta: {
          transition: "slide-left",
          title: "Tạo giảng viên mới"
        },
        component: loadView("create_user/CreateLecturer.vue")
      },
      {
        path: "/lecturer-import",
        name: "ImportLecturer",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách giảng viên mới"
        },
        component: loadView("create_user/ImportLecturer.vue")
      },
      {
        path: "/lecturer-management",
        name: "LecturerManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý giảng viên"
        },
        component: loadView("create_user/Lecturers.vue")
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
  if (to.name !== "Login" && !localStorage.getItem("token_user"))
    next({ name: "Login" });
  else if (to.name === "Login" && localStorage.getItem("token_user"))
    next({ name: "Home" });
  else {
    nprogress.start();
    nprogress.set(0.1);
    nprogress.configure({ parent: "#app-body" });
    next();
  }
});

export default router;
