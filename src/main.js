import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import PesaDashboard from "./pesa-dashboard";
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import VueCookies from 'vue3-cookies'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import mitt from 'mitt';
const emitter = mitt();

const axiosInstance = axios.create({
  withCredentials: true,
})
const appInstance = createApp(App);
appInstance.use(VueCookies, {
  expireTimes: "30d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None"
});
const options = {
  // You can set your default options here
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
};
appInstance.config.globalProperties.emitter = emitter;
appInstance.use(Toast, options);
appInstance.config.globalProperties.$axios = { ...axiosInstance }
appInstance.use(store);
appInstance.use(router);
appInstance.use(PesaDashboard);
appInstance.mount("#app");
