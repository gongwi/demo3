import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import VCharts from "v-charts";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false;

Vue.use(VCharts);
Vue.use(VueAxios, axios);
new Vue({
  render: h => h(App)
}).$mount("#app");
