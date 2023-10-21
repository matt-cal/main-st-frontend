<script setup lang="ts">
import Dialog from "primevue/dialog";
import { ref } from "vue";
let visible = ref(false);
</script>

<template>
  <ButtonComponent class="button" label="See All..." @click="visible = true" />

  <Dialog v-model:visible="visible" modal header="Tags" :style="{ width: '50vw' }">
    <slot> No Tags </slot>
  </Dialog>
</template>

<style scoped>
.button {
  background-color: rgb(0, 132, 255);
}

.dialog {
  background-color: rgb(0, 132, 255);
  padding: 8px;
}
</style>
