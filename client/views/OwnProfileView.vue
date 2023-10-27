<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import FavoriteListComponent from "../components/Favorite/FavoriteListComponent.vue";
import EditTagsComponent from "../components/Tag/EditTagsComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const numFollowers = ref(0);
const numFollowing = ref(0);

onBeforeMount(async () => {
  numFollowers.value = (await fetchy(`/api/users/${currentUsername}/followers`, "GET")).length;
  numFollowing.value = (await fetchy(`/api/friends/${currentUsername}`, "GET")).length;
});
</script>

<template>
  <main>
    <h1>{{ currentUsername }}</h1>

    <div class="outer">
      <div class="favorites">
        <FavoriteListComponent :username="currentUsername" />
      </div>
      <div class="counts">
        <h3>Followers: {{ numFollowers }}</h3>
        <h3>Following: {{ numFollowing }}</h3>
      </div>
    </div>

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

.outer {
  display: flex;
  justify-content: space-evenly;
}

.counts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
