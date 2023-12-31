<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import EditTagsComponent from "../Tag/EditTagsComponent.vue";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <div class="outer">
    <form @submit.prevent="editPost(content)">
      <p class="author">{{ props.post.author }}</p>
      <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
      <div class="base">
        <menu>
          <li><button class="submit btn-small pure-button-primary pure-button" type="submit">Save</button></li>
          <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
        </menu>
        <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </div>
    </form>
    <EditTagsComponent :post="props.post" />
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

button.submit {
  background-color: #1c5753;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
  padding: 4px;
}

p {
  margin: 0em;
}

.outer {
  height: 580px;
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
