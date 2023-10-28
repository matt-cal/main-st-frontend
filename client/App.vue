<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    void router.push({ name: "Home" });
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav id="NavBar">
      <div class="title">
        <!-- <img src="@/assets/images/logo.svg" /> -->
        <RouterLink :to="{ name: 'Home' }">
          <h1 id="nav-title">Main St</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'CreatePost' }" :class="{ underline: currentRouteName == 'CreatePost' }" style="margin-right: 12px"> New Post </RouterLink>
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }" style="margin-right: 12px"> Settings </RouterLink>
          <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }" style="margin-right: 12px"> Profile </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: #9f4142;
  color: antiquewhite;
  display: flex;
  align-items: center;
}

#NavBar {
  position: fixed;
  left: 0;
  top: 0; /* top left corner should start at topmost spot */
  width: 100vw; /* take up the full browser width */
  z-index: 200;
  box-shadow: 0 4px 2px -2px rgb(151, 151, 151);
}

h1 {
  font-size: 2em;
  margin: 0;
}

.toast {
  margin-top: 73.4px;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: antiquewhite;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
  font-weight: 500;
}

.underline {
  text-decoration: underline;
}
</style>
