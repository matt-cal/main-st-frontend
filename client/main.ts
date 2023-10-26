import "@/assets/main.css";
import "primeicons/primeicons.css";
import "purecss";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import Button from "primevue/button";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import { createApp } from "vue";
import "vuesax/dist/vuesax.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.component("ButtonComponent", Button);
app.component("DialogComponent", Dialog);

app.mount("#app");
