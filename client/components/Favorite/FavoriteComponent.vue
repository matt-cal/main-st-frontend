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
  <button v-if="favorited" class="active" @click="unfavorite"><img src="../../assets/images/favorite-filled.png" /></button>
  <button v-else @click="favorite"><img src="../../assets/images/favorite-outline.png" /></button>
</template>

<style scoped>
.active {
  /* background-color: gold; */
}

button {
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

img {
  height: 32px;
  width: 32px;
}
</style>
