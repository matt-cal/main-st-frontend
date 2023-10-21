<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FavoriteListComponent from "../components/Favorite/FavoriteListComponent.vue";
import EditTagsComponent from "../components/Tag/EditTagsComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>{{ currentUsername }}</h1>
    <FavoriteListComponent :username="currentUsername" />
    <div class="flex center">
      <EditTagsComponent :username="currentUsername" />
    </div>
    <PostListComponent :own="true" />
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
