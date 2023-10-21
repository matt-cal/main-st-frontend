<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import TagComponent from "./TagComponent.vue";
import ModalComponent from "./ModalComponent.vue";

const props = defineProps(["post", "username", "editing"]);
let tags = ref([]);
let firstTags = computed(() => tags.value.slice(0, 3)); // first three tags
// let restTags = computed(() => tags.value.slice(3)); // rest of the tags

const updateTags = async () => {
  if (props.post !== undefined) {
    tags.value = await fetchy(`/api/posts/${props.post._id}/tags`, "GET");
  } else if (props.username !== undefined) {
    tags.value = await fetchy(`/api/users/${props.username}/tags`, "GET");
  }
};

onBeforeMount(async () => {
  await updateTags();
});
</script>

<template>
  <section>
    <div class="main">
      <TagComponent v-for="tagName in firstTags" :key="tagName" :tagName="tagName" :post="props.post" :username="props.username" :editing="props.editing" @updateTags="updateTags" />
      <ModalComponent v-if="tags.length - firstTags.length !== 0">
        <TagComponent v-for="tagName in tags" :key="tagName" :tagName="tagName" :post="props.post" :username="props.username" :editing="props.editing"></TagComponent>
      </ModalComponent>
    </div>
  </section>
</template>

<style scoped>
.main {
  display: flex;
  gap: 4px;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
