import "@/assets/styles/main.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import { createApp } from "vue";
import App from "./App.vue";
import {createPinia} from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import gsap from "gsap";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia=createPinia();
app.use(gsap);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
