<script setup lang="ts">
import LikeComponent from "@/components/Like/LikeComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { RouterLink } from "vue-router";
import { fetchy } from "../../utils/fetchy";
import TagListComponent from "../Tag/TagListComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
let postTags = ref<Array<string>>([]);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

onBeforeMount(async () => {
  postTags.value = await fetchy(`/api/posts/${props.post._id}/tags`, "GET");
});
</script>

<template>
  <div class="top-post">
    <RouterLink class="author" :to="{ name: 'OtherProfile', params: { username: props.post.author } }">{{ props.post.author }}</RouterLink>
    <menu v-if="props.post.author == currentUsername">
      <li><button class="edit btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
  </div>
  <div class="img-container">
    <img v-bind:src="props.post.mediaLink" />
  </div>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <LikeComponent :post="props.post._id" />
    <TagListComponent :post="props.post" />
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.edit {
  background-color: #1c5753;
  color: white;
}

a {
  color: black;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-post {
  display: flex;
  justify-content: space-between;
}

.img-container {
  height: 480px;
  width: 800px;
  border: 0.5px solid lightgray;
  border-radius: 8px;
  margin-bottom: 8px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.base article:only-child {
  margin-left: auto;
}
</style>
