<template>
  <AppButton
    class="button"
    :data-drag="drag"
    text="Upload"
    icon="upload"
    v-tippy="'Choose or drag & drop a file'"
    @click="onClick"
    @dragenter="drag = true"
    @dragleave="drag = false"
    @dragover.prevent
    @drop.prevent.stop="onDrop"
  />

  <input
    ref="input"
    aria-label="invisible input"
    @change="onChange"
    type="file"
    accept="text/plain"
    :style="{ display: 'none' }"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// upload button
export default defineComponent({
  emits: ["upload"],
  data() {
    return {
      drag: false,
    };
  },
  methods: {
    // upload file
    async upload(target: HTMLInputElement | DataTransfer | null) {
      // get file name and contents from event
      const file = (target?.files || [])[0];
      const content = (await file.text()) || "";
      const filename = file?.name || "";

      // signal upload to parent
      this.$emit("upload", content, filename);

      // reset file input
      if (content) (this.$refs.input as HTMLInputElement).value = "";
    },
    // on file input change
    onChange(event: Event) {
      this.upload(event.target as HTMLInputElement);
    },
    // on button click, click hidden file input
    onClick() {
      (this.$refs.input as HTMLInputElement)?.click();
    },
    // on button file drop
    onDrop(event: DragEvent) {
      this.drag = false;
      this.upload(event.dataTransfer);
    },
  },
});
</script>

<style lang="scss" scoped>
.button[data-drag="true"] {
  outline: dashed 2px $black;
  box-shadow: none !important;
}

// prevent button children from messing with drag state
.button > :deep(*) {
  pointer-events: none;
}
</style>
