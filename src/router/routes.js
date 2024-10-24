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
        path: "upload",
        name: "upload",
        component: () => import("@/views/questionbank/UploadView.vue"),
      },
    ],
  },
];

export default routes;
