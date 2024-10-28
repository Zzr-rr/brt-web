import { createRouter, createWebHistory } from "vue-router";
import routes from "@/router/routes";
// import authApi from "@/api/auth";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
// router.beforeEach(async (to, from, next) => {
//   if (to.meta?.requireAuth == false) {
//     next();
//   } else {
//     try {
//       const res = await authApi.verify();
//       console.log(res);
//       if (res?.code == 200) {
//         next();
//       } else {
//         next({ path: "/login" });
//       }
//     } catch (error) {
//       console.log("Route Error", error);
//       next({ path: "/login" });
//     }
//   }
// });

export default router;
