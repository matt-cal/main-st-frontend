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
  <div class="counts">
    <h3>Followers: {{ numFollowers }}</h3>
    <h3>Following: {{ numFollowing }}</h3>
  </div>
</template>

<style scoped>
.active {
  background-color: #1c5753;
  color: white;
}

button {
  border: none;
  cursor: pointer;
  padding: 0.25em;
  border: 0.5px solid;
  border-radius: 4px;
  height: 32px;
  width: 75px;
}

.counts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
</style>
