<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["username"]);
const favorites = ref([]);

onBeforeMount(async () => {
  favorites.value = (await fetchy(`/api/favorites`, "GET", { query: { owner: props.username } })).map((f: any) => f.target);
});
</script>

<template>
  <div class="contain1">
    <h3>Favorites:</h3>
    <div v-for="user in favorites" :key="user">
      <RouterLink v-if="user === currentUsername" class="user" :to="{ name: 'Profile' }">{{ user }}</RouterLink>
      <RouterLink v-else class="user" :to="{ name: 'OtherProfile', params: { username: user } }">{{ user }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.contain1 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user {
  color: #1c5753;
  font-weight: bold;
}
</style>
