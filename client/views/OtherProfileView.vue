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
    <div class="contain1">
      <h1>{{ currentRoute.params.username }}</h1>
      <FavoriteComponent :username="currentRoute.params.username" />
    </div>
    <div class="outer">
      <div class="favorites">
        <FavoriteListComponent :username="currentRoute.params.username" />
      </div>
      <FollowComponent :username="currentRoute.params.username" />
    </div>
    <TagListComponent :username="currentRoute.params.username" />
    <PostListComponent :username="currentRoute.params.username" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.contain1 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.outer {
  display: flex;
  justify-content: center;
  gap: 177px;
}

.favorites {
  display: flex;
  justify-content: center;
}

.flex {
  display: flex;
}

.center {
  justify-content: center;
}
</style>
