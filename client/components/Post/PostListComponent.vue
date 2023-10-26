<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
const props = defineProps(["own", "username"]);

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults.filter((p: any) => p.author !== "DELETED_USER");
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  if (props.own) {
    await getPosts(currentUsername.value);
  } else if (props.username) {
    await getPosts(props.username);
  } else {
    await getPosts();
  }
  loaded.value = true;
});
</script>

<template>
  <div class="search-out">
    <div class="search-in">
      <h2 v-if="searchAuthor">Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm v-if="!props.own && !props.username" @getPostsByAuthor="getPosts" />
    </div>
  </div>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <hr color="#9f4142" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <div v-else class="loading">
    <h1>Loading...</h1>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em 0;
  width: 800px;
}

hr {
  margin-top: 24px;
}

.posts {
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.search-out {
  margin: 0 auto;
  /* max-width: 60em; */
  width: 800px;
}
</style>
