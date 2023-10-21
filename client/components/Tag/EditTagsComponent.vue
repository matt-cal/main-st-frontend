<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import TagComponent from "./TagComponent.vue";

const props = defineProps(["post", "username"]);
let itemTags = ref<Array<string>>([]);
let newTag = ref("");

const updateTags = async () => {
  if (props.post !== undefined) {
    itemTags.value = await fetchy(`api/posts/${props.post._id}/tags`, "GET");
  } else if (props.username !== undefined) {
    itemTags.value = await fetchy(`api/users/${props.username}/tags`, "GET");
  }
};

const tagItem = async () => {
  const tagExists = await fetchy(`api/tags/${newTag.value}`, "GET");
  if (!tagExists) {
    // create tag if it doesn't exist already
    await fetchy(`api/tags`, "POST", { body: { name: newTag.value } });
  }
  // add tag to item
  if (props.post !== undefined) {
    await fetchy(`api/posts/${props.post._id}/${newTag.value}`, "PATCH");
  } else if (props.username !== undefined) {
    await fetchy(`api/users/${newTag.value}`, "PATCH");
  }
  await updateTags();
  newTag.value = "";
};

onBeforeMount(async () => {
  await updateTags();
});
</script>

<template>
  <TagComponent v-for="tagName in itemTags" :key="tagName" :tagName="tagName" :post="props.post" :username="props.username" :editing="true" @updateTags="updateTags" />
  <form @submit.prevent="tagItem()">
    <textarea v-model="newTag" placeholder="Add Tag" required></textarea>
    <button class="btn-small pure-button-primary pure-button" type="submit">Add Tag</button>
  </form>
</template>
