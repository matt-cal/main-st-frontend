<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post", "type"]);
const emit = defineEmits(["likePost"]);
let likeCount = ref(0);
let dislikeCount = ref(0);
let userLiked = ref(false);
let userDisliked = ref(false);

async function getLikeCount() {
  let likes;
  let dislikes;
  try {
    likes = await fetchy(`/api/post/${props.post}/likes`, "GET", { query: { type: "like" } });
    dislikes = await fetchy(`/api/post/${props.post}/likes`, "GET", { query: { type: "dislike" } });
  } catch (_) {
    return;
  }
  likeCount.value = likes.length;
  dislikeCount.value = dislikes.length;
}

async function updateLikeStatus() {
  const liked: boolean = await fetchy(`/api/user/liked/${props.post}`, "GET", { query: { type: "like" } });
  const disliked: boolean = await fetchy(`/api/user/liked/${props.post}`, "GET", { query: { type: "dislike" } });
  userLiked.value = liked;
  userDisliked.value = disliked;
}

async function likePost(type: string) {
  console.log(userLiked, userDisliked);
  if ((type === "like" && userLiked.value) || (type === "dislike" && userDisliked.value)) {
    await fetchy(`/api/likes/${props.post}`, "DELETE", { query: { type } });
  } else if (userLiked.value || userDisliked.value) {
    await fetchy(`/api/likes/${props.post}`, "PATCH", { query: { type } });
  } else {
    await fetchy(`/api/likes/${props.post}`, "POST", { query: { type } });
  }
  userLiked.value = type === "like" && !userLiked.value;
  userDisliked.value = type === "dislike" && !userDisliked.value;
  await getLikeCount();
}

onBeforeMount(async () => {
  await getLikeCount();
  await updateLikeStatus();
});
</script>

<template>
  <menu>
    <p>{{ likeCount }}</p>
    <button class="btn-small pure-button like" @click="likePost('like')"><img class="like" src="../../assets/images/like.png" /></button>
    <button class="btn-small pure-button dislike" @click="likePost('dislike')"><img class="dislike" src="../../assets/images/dislike.png" /></button>
    <p>{{ dislikeCount }}</p>
  </menu>
</template>

<style scoped>
button {
  width: 30px;
  height: 30px;
  padding: 0;
}

img {
  width: 30px;
  height: 30px;
  padding: 0px;
}

menu {
  display: flex;
  align-items: center;
}
</style>
