const routes = [
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/SettingsView.vue"),
  },
  {
    path: "/study-progress",
    name: "study-progress",
    component: () => import("@/views/StudyProgress.vue"),
  },
  {
    path: "/home/:id",
    name: "ItemDetail",
    component: () => import("@/views/TestView.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: { requireAuth: false },
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/TestView.vue"),
  },
  {
    path: "/users",
    name: "users",
    children: [
      {
        path: "personalpage",
        name: "personalpage",
        component: () => import("@/views/users/PersonalpageView.vue"),
      },
    ],
  },
  {
    path: "/questionbank",
    name: "questionbank",
    children: [
      {
        path: "mybank",
        name: "mybank",
        component: () => import("@/views/questionbank/MybankView.vue"),
      },
      {
        path: "square",
        name: "square",
        component: () => import("@/views/questionbank/SquareView.vue"),
      },
      {
        // path: "practice",
        path: "practice/:id", // 添加动态段来匹配id参数
        name: "practice",
        component: () => import("@/views/questionbank/PracticeView.vue"),
        //component : () => console.log('Practice ID:', this.params.id),
        props:true,
      },
    ],
  },
  {
    path: "/file",
    name: "file",
    children: [
      {
        path: "myfile",
        name: "myfile",
        component: () => import("@/views/file/MyfileView.vue"),
      },
      {
        path: "upload",
        name: "upload",
        component: () => import("@/views/file/UploadView.vue"),
      },
      {
        path: "myfile/share",
        name: "share",
        component: () => import("@/views/WriteView.vue"),
      },
    ],
  },
];

export default routes;
