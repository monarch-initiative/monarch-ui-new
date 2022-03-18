<template>
  <!-- search box -->
  <AppInput
    :multi="true"
    icon="file-lines"
    placeholder="Paste full text"
    v-model="content"
    @change="annotate()"
  />

  <!-- other options -->
  <AppFlex>
    <span>or</span>
    <AppUpload @upload="onUpload" />
    <span>or</span>
    <AppButton text="try an example" design="small" @click="doExample()" />
  </AppFlex>

  <hr />

  <!-- status -->
  <AppStatus v-if="content && status" ref="status" :status="status" />

  <!-- filename -->
  <strong v-if="annotations.length"
    >Annotations for {{ filename || "pasted text" }}</strong
  >

  <!-- results -->
  <p v-if="annotations.length">
    <tippy
      v-for="({ text, tokens }, index) in annotations"
      :key="index"
      :interactive="true"
      theme="light"
    >
      <span :data-has="!!tokens.length" :tabindex="tokens.length ? 0 : -1">{{
        text
      }}</span>
      <template v-if="tokens.length" #content>
        <div class="table">
          <template v-for="(token, index) in tokens" :key="index">
            <AppIcon
              :icon="`category-${kebabCase(token.category)}`"
              :circle="true"
              fallback="category-unknown"
            />
            <AppLink :to="token.id">{{ token.id }}</AppLink>
            <div class="truncate">{{ token.terms }}</div>
          </template>
        </div>
      </template>
    </tippy>
  </p>

  <!-- actions -->
  <AppButton
    v-if="annotations.length"
    text="Download"
    icon="download"
    @click="download"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { kebabCase } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppUpload from "@/components/AppUpload.vue";
import AppStatus from "@/components/AppStatus.vue";
import example from "./text-annotator.json";
import { annotateText } from "@/api/text-annotator";
import { Status } from "@/components/AppStatus";
import { Result } from "@/api/text-annotator";
import { ApiError } from "@/api";
import { downloadJson } from "@/util/download";

export default defineComponent({
  components: {
    AppInput,
    AppUpload,
    AppStatus,
  },
  data() {
    return {
      // text content
      content: "",
      // file name of uploaded file (if applicable)
      filename: "",
      // annotation results
      annotations: [] as Result,
      // status of query
      status: null as Status | null,
    };
  },
  methods: {
    // get text content and filename from upload button
    onUpload(content = "", filename = "") {
      this.content = content;
      this.annotate(filename);
    },
    // example full text
    doExample() {
      this.content = example.content;
      this.annotate();
    },
    // run annotation
    async annotate(filename = "") {
      // reset filename depending on search method
      this.filename = filename;

      // loading...
      this.status = { code: "loading", text: "Loading results" };
      this.annotations = [];

      try {
        // get results from api
        this.annotations = await annotateText(this.content);

        // clear status
        this.status = null;
      } catch (error) {
        // error...
        if (this.content.trim()) this.status = error as ApiError;
        else this.status = null;
      }
    },
    // download annotations
    download() {
      downloadJson(
        this.annotations.filter(({ tokens }) => tokens.length),
        "annotations"
      );
    },
    kebabCase,
  },
  mounted() {
    this.annotate(this.filename || "");
  },
  persist: {
    keys: ["content", "filename"],
    namespace: "text-annotator",
  },
});
</script>

<style lang="scss" scoped>
p {
  white-space: pre-line;
}

span[data-has="false"] {
  color: $dark-gray;
}

span[data-has="true"] {
  text-decoration: underline;
  color: $black;
  cursor: help;
}

.table {
  display: grid;
  grid-template-columns: 20px auto auto;
  align-items: center;
  gap: 5px 10px;
}

.table svg {
  font-size: 1.2rem;
}
</style>
