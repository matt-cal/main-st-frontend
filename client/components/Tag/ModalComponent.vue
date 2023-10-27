<script setup lang="ts">
import { ref } from "vue";
let visible = ref(false);
</script>

<template>
  <ButtonComponent class="button" label="See All..." @click="visible = true" />

  <DialogComponent class="myd" v-model:visible="visible" modal header="Tags" :style="{ width: '50vw' }">
    <div class="tags">
      <slot> No Tags </slot>
    </div>
  </DialogComponent>
</template>

<style scoped>
.button {
  margin: 4px;
  padding: 0.25em;
  border: 0.5px solid;
  border-radius: 4px;
  background-color: #9f4142;
  color: white;
  height: 32px;
}

.myd :deep(.p-dialog .p-dialog-header) {
  background: rgb(0, 132, 255);
  padding: 8px;
  color: red;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

Dialog {
  background-color: blue;
}
</style>

<style>
div.p-dialog-header {
  padding: 8px;
}

div.p-dialog-content {
  padding: 8px;
}
</style>
