<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const props = defineProps(["post", "username"]);
const emit = defineEmits(["updateTags"]);

const newTag = ref("");
const tags = ref<string[]>([]);

const addTag = async () => {
  const i = tags.value.indexOf(newTag.value);
  if (i === -1) {
    // newTag not in tags already
    tags.value.push(newTag.value);
    emit("updateTags", tags.value);
  }
  newTag.value = "";
};

const removeTag = async (tag: string) => {
  const i = tags.value.indexOf(tag);
  tags.value.splice(i, 1);
  emit("updateTags", tags.value);
};

onBeforeMount(() => {});
</script>

<template>
  <form @submit.prevent="addTag()">
    <textarea v-model="newTag" placeholder="Add Tag" required></textarea>
    <button class="btn-small pure-button-primary pure-button" type="submit">Add Tag</button>
  </form>
  <div v-for="tag in tags" :key="tag" class="base">
    <p>{{ tag }}</p>
    <button @click="removeTag(tag)">x</button>
  </div>
</template>
