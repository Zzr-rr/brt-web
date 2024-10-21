import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component:()=> import("@/views/HomeView.vue"),
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
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/users",
      name: "users",
      children: [
        {
          path: "personalpage", // 去掉开头的 "/"
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
          path: "mybank", // 去掉开头的 "/"
          name: "mybank",
          component: () => import("@/views/questionbank/MybankView.vue"),
        },
        {
          path: "square", // 去掉开头的 "/"
          name: "square",
          component: () => import("@/views/questionbank/SquareView.vue"),
        },
        {
          path: "upload", // 去掉开头的 "/"
          name: "upload",
          component: () => import("@/views/questionbank/UploadView.vue"),
        },
      ],
    },
  ],
});

export default router;
