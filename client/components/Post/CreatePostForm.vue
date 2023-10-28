<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const mediaLink = ref("");
const emit = defineEmits(["refreshPosts", "submitted"]);
const newTag = ref("");
const tags = ref<string[]>([]);

const createPost = async (content: string, mediaLink: string) => {
  emit("submitted");
  try {
    const res = await fetchy("/api/posts", "POST", {
      body: { content, mediaLink },
    });
    const post = res.post;
    for (const tag of tags.value) {
      const tagExists = await fetchy(`/api/tags/${tag}`, "GET");
      if (!tagExists) {
        // create tag if it doesn't exist already
        await fetchy(`/api/tags`, "POST", { body: { name: tag } });
      }
      await fetchy(`/api/posts/${post._id}/${tag}`, "PATCH");
    }
    tags.value = [];
  } catch (_) {
    return;
  }
  emptyForm();
  void router.push({ name: "Home" });
};

const addTag = async () => {
  const i = tags.value.indexOf(newTag.value);
  if (i === -1) {
    // newTag not in tags already
    tags.value.push(newTag.value);
  }
  newTag.value = "";
};

const removeTag = async (tag: string) => {
  const i = tags.value.indexOf(tag);
  tags.value.splice(i, 1);
};

const emptyForm = () => {
  content.value = "";
  mediaLink.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content, mediaLink)">
    <label for="content">Post Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <label for="mediaLink">Image:</label>
    <input id="mediaLink" v-model="mediaLink" placeholder="Add image link" required />
    <form class="tag-form" @submit.prevent="addTag()">
      <input v-model="newTag" placeholder="Add Tag" required />
      <button class="tag-submit btn-small pure-button-primary pure-button" type="submit">Add Tag</button>
    </form>
    <div class="main">
      <div v-for="tag in tags" :key="tag" class="base">
        <p>{{ tag }}</p>
        <button @click="removeTag(tag)">x</button>
      </div>
    </div>
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
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

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

button {
  background-color: #1c5753;
  color: white;
}

.tag-submit,
.tag-form input {
  width: 150px;
}

.main {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.base {
  margin-right: 4px;
  padding: 0.25em;
  border: 0.5px solid;
  border-radius: 4px;
  background-color: #1c5753;
  color: white;
  display: flex;
  gap: 4px;
  align-items: center;
}

.base button {
  border: none;
  margin: 4px;
  cursor: pointer;
}
</style>
