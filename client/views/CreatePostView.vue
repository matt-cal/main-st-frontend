<script setup lang="ts">
import { ref } from "vue";
import CreatePostForm from "../components/Post/CreatePostForm.vue";

const submitted = ref(false);

const submit = async () => {
  submitted.value = true;
};
</script>

<template>
  <div v-if="!submitted" class="create">
    <h1>Create a Post:</h1>
    <div class="form-container">
      <CreatePostForm @submitted="submit" />
    </div>
  </div>
  <div v-if="submitted" class="loading">
    <h1>Loading...</h1>
  </div>
</template>

<style scoped>
.create {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 800px;
}

.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
