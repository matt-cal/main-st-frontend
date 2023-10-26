<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import TagComponent from "./TagComponent.vue";

const props = defineProps(["post", "username"]);
let itemTags = ref<Array<string>>([]);
let newTag = ref("");

const updateTags = async () => {
  if (props.post !== undefined) {
    itemTags.value = await fetchy(`/api/posts/${props.post._id}/tags`, "GET");
  } else if (props.username !== undefined) {
    itemTags.value = await fetchy(`/api/users/${props.username}/tags`, "GET");
  }
};

const tagItem = async () => {
  const tagExists = await fetchy(`/api/tags/${newTag.value}`, "GET");
  if (!tagExists) {
    // create tag if it doesn't exist already
    await fetchy(`/api/tags`, "POST", { body: { name: newTag.value } });
  }
  // add tag to item
  if (props.post !== undefined) {
    await fetchy(`/api/posts/${props.post._id}/${newTag.value}`, "PATCH");
  } else if (props.username !== undefined) {
    await fetchy(`/api/users/${newTag.value}`, "PATCH");
  }
  await updateTags();
  newTag.value = "";
};

onBeforeMount(async () => {
  await updateTags();
});
</script>

<template>
  <div class="out">
    <div class="form-contain">
      <form class="tag-form" @submit.prevent="tagItem()">
        <input v-model="newTag" placeholder="Add Tag" required />
        <button class="tag-submit btn-small pure-button-primary pure-button" type="submit">Add Tag</button>
      </form>
    </div>
    <div class="main">
      <TagComponent v-for="tagName in itemTags" :key="tagName" :tagName="tagName" :post="props.post" :username="props.username" :editing="true" @updateTags="updateTags" />
    </div>
  </div>
</template>

<style scoped>
button {
  background-color: #9f4142;
  color: white;
}

.out {
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.form-contain {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

form {
  background-color: white;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.tag-form {
  margin: 12px 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tag-submit,
.tag-form input {
  width: 150px;
}
</style>
