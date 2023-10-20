<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import TagComponent from "./TagComponent.vue";

const props = defineProps(["post"]);
let postTags = ref<Array<string>>([]);
let newTag = ref("");

const updateTags = async () => {
  postTags.value = await fetchy(`api/posts/${props.post._id}/tags`, "GET");
};

const tagPost = async () => {
  const tagExists = await fetchy(`api/tags/${newTag.value}`, "GET");
  if (!tagExists) {
    // create tag if it doesn't exist already
    await fetchy(`api/tags`, "POST", { body: { name: newTag.value } });
  }
  await fetchy(`api/posts/${props.post._id}/${newTag.value}`, "PATCH");
  await updateTags();
  newTag.value = "";
};

onBeforeMount(async () => {
  await updateTags();
});
</script>

<template>
  <TagComponent v-for="tagName in postTags" :key="tagName" :tagName="tagName" :post="props.post" :editing="true" @updateTags="updateTags" />
  <form @submit.prevent="tagPost()">
    <textarea v-model="newTag" placeholder="Add Tag" required></textarea>
    <button class="btn-small pure-button-primary pure-button" type="submit">Add Tag</button>
  </form>
</template>
