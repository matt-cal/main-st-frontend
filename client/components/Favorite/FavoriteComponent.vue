<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["username"]);
const favorited = ref(false);

const updateFavorite = async () => {
  favorited.value = await fetchy(`/api/favorites/${props.username}`, "GET");
};

const favorite = async () => {
  try {
    await fetchy(`/api/favorites/${props.username}`, "POST");
    favorited.value = true;
  } catch {
    return;
  }
};

const unfavorite = async () => {
  try {
    await fetchy(`/api/favorites/${props.username}`, "DELETE");
    favorited.value = false;
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await updateFavorite();
});
</script>

<template>
  <button v-if="favorited" class="active" @click="unfavorite">unfavorite</button>
  <button v-else @click="favorite">favorite</button>
</template>

<style scoped>
.active {
  background-color: gold;
}
</style>
