<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["username"]);
const favorited = ref(false);

const updateFavorite = async () => {
  favorited.value = await fetchy(`/api/favorites/${props.username}`, "GET");
  console.log(favorited.value);
};

const favorite = async () => {
  await fetchy(`/api/favorites/${props.username}`, "POST");
  await updateFavorite();
};

const unfavorite = async () => {
  await fetchy(`/api/favorites/${props.username}`, "DELETE");
  await updateFavorite();
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
