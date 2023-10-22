<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["username"]);
const following = ref(false);
const numFollowers = ref(0);
const numFollowing = ref(0);

const updateFollow = async () => {
  following.value = await fetchy(`/api/following/${props.username}`, "GET");
  numFollowers.value = (await fetchy(`/api/users/${props.username}/followers`, "GET")).length;
  numFollowing.value = (await fetchy(`/api/friends/${props.username}`, "GET")).length;
};

const follow = async () => {
  try {
    await fetchy(`/api/friends/${props.username}`, "POST");
    following.value = true;
    numFollowers.value += 1;
  } catch {
    return;
  }
};

const unfollow = async () => {
  try {
    await fetchy(`/api/friends/${props.username}`, "DELETE");
    following.value = false;
    numFollowers.value -= 1;
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await updateFollow();
});
</script>

<template>
  <button v-if="following" class="active" @click="unfollow">unfollow</button>
  <button v-else @click="follow">follow</button>
  <p>Followers: {{ numFollowers }}</p>
  <p>Following: {{ numFollowing }}</p>
</template>

<style scoped>
.active {
  background-color: gold;
}
</style>
