import "@/assets/main.css";
import "purecss";
import "primeicons/primeicons.css";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "vuesax/dist/vuesax.css";
import App from "./App.vue";
import router from "./router";
import Button from "primevue/button";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.component("ButtonComponent", Button);

app.mount("#app");
