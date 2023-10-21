<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
const props = defineProps(["tagName", "editing", "post", "username"]);
const emit = defineEmits(["updateTags"]);

const removeTag = async () => {
  if (props.post !== undefined) {
    await fetchy(`api/posts/${props.post._id}/${props.tagName}`, "DELETE");
  } else if (props.username !== undefined) {
    await fetchy(`api/users/${props.tagName}`, "DELETE");
  }
  emit("updateTags");
};
</script>

<template>
  <div class="base">
    <p>{{ props.tagName }}</p>
    <button v-if="props.editing" @click="removeTag">x</button>
  </div>
</template>

<style scoped>
.base {
  margin: 4px;
  border: solid;
}

button {
  border: none;
  margin: 4px;
  cursor: pointer;
}
</style>
