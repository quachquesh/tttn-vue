import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "vue-nprogress";

import Home from "../views/Home.vue";

Vue.use(VueRouter);
Vue.use(NProgress);

const nprogress = new NProgress();
nprogress.configure({
  showSpinner: false,
  speed: 300
});

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      transition: "slide-right",
      title: "Danh sách môn học"
    },
    children: [
      {
        path: "",
        name: "Home",
        components: {
          default: () =>
            import(
              /* webpackChunkName: "ListSubject" */ "../views/ListSubject.vue"
            ),
          ListClassRoom: () =>
            import(
              /* webpackChunkName: "ListClassRoom" */ "../views/ListClassRoom.vue"
            )
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
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue")
  },
  {
    path: "/mh/:subjectId",
    name: "ListClassRoom",
    meta: {
      transition: "slide-left",
      title: "Danh sách lớp học"
    },
    component: () =>
      import(
        /* webpackChunkName: "ListClassRoom" */ "../views/ListClassRoom.vue"
      )
  },
  {
    path: "/c/:roomId",
    component: () =>
      import(/* webpackChunkName: "ClassRoom" */ "../views/ClassRoom.vue"),
    meta: {
      transition: "slide-down",
      title: "Lớp học"
    },
    props: true,
    children: [
      {
        path: "",
        name: "ClassRoom",
        component: () =>
          import(
            /* webpackChunkName: "ClassRoom" */ "../views/classroom/News.vue"
          ),
        meta: {
          transition: "slide-down",
          title: "Lớp học"
        },
        props: true
      },
      {
        path: "exercise",
        name: "Exercise",
        component: () =>
          import(
            /* webpackChunkName: "Exercise" */ "../views/classroom/Exercise.vue"
          ),
        meta: {
          transition: "slide-down",
          title: "Lớp học"
        },
        props: true
      },
      {
        path: "groups",
        name: "Groups",
        component: () =>
          import(
            /* webpackChunkName: "Groups" */ "../views/classroom/Groups.vue"
          ),
        meta: {
          transition: "slide-down",
          title: "Lớp học"
        },
        props: true
      },
      {
        path: "members",
        name: "Members",
        component: () =>
          import(
            /* webpackChunkName: "Members" */ "../views/classroom/Members.vue"
          ),
        meta: {
          transition: "slide-down",
          title: "Lớp học"
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
    component: () =>
      import(/* webpackChunkName: "CreateUser" */ "../views/CreateUser.vue"),
    children: [
      {
        path: "/student",
        name: "CreateStudent",
        meta: {
          transition: "slide-left",
          title: "Tạo sinh viên mới"
        },
        component: () =>
          import(
            /* webpackChunkName: "CreateStudent" */ "../views/create_user/CreateStudent.vue"
          )
      },
      {
        path: "/student-import",
        name: "ImportStudent",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách sinh viên mới"
        },
        component: () =>
          import(
            /* webpackChunkName: "ImportStudent" */ "../views/create_user/ImportStudent.vue"
          )
      },
      {
        path: "/student-management",
        name: "StudentManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý sinh viên"
        },
        component: () =>
          import(
            /* webpackChunkName: "StudentManagement" */ "../views/create_user/Students.vue"
          )
      },
      {
        path: "/lecturer",
        name: "CreateLecturer",
        meta: {
          transition: "slide-left",
          title: "Tạo giảng viên mới"
        },
        component: () =>
          import(
            /* webpackChunkName: "CreateLecturer" */ "../views/create_user/CreateLecturer.vue"
          )
      },
      {
        path: "/lecturer-import",
        name: "ImportLecturer",
        meta: {
          transition: "slide-right",
          title: "Tạo danh sách giảng viên mới"
        },
        component: () =>
          import(
            /* webpackChunkName: "ImportLecturer" */ "../views/create_user/ImportLecturer.vue"
          )
      },
      {
        path: "/lecturer-management",
        name: "LecturerManagement",
        meta: {
          transition: "slide-right",
          title: "Quản lý giảng viên"
        },
        component: () =>
          import(
            /* webpackChunkName: "LecturerManagement" */ "../views/create_user/Lecturers.vue"
          )
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
