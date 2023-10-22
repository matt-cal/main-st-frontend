<script setup lang="ts">
import router from "@/router";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import FavoriteComponent from "../components/Favorite/FavoriteComponent.vue";
import FavoriteListComponent from "../components/Favorite/FavoriteListComponent.vue";
import FollowComponent from "../components/Follow/FollowComponent.vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
import TagListComponent from "../components/Tag/TagListComponent.vue";
import { useUserStore } from "../stores/user";

const { currentUsername } = storeToRefs(useUserStore());
const currentRoute = useRoute();

onBeforeMount(async () => {
  if (currentRoute.params.username === currentUsername.value) {
    void router.push({ name: "Profile" });
  }
});
</script>

<template>
  <main>
    <h1>{{ currentRoute.params.username }}</h1>
    <FavoriteListComponent :username="currentRoute.params.username" />
    <FavoriteComponent :username="currentRoute.params.username" />
    <FollowComponent :username="currentRoute.params.username" />
    <TagListComponent :username="currentRoute.params.username" />
    <PostListComponent :username="currentRoute.params.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.flex {
  display: flex;
}

.center {
  justify-content: center;
}
</style>
