<!--
  text annotator tab on explore page

  input free/long text and finds references to nodes in monarch knowledge graph
-->

<template>
  <!-- description -->
  <template v-if="$route.name !== 'Home'">
    <p>
      Same as the node search, but searches full text and finds references to
      nodes that are in our knowledge graph.
    </p>

    <hr />
  </template>

  <!-- search box -->
  <AppInput
    v-model="content"
    :multi="true"
    icon="file-lines"
    placeholder="Paste full text"
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
  <AppStatus v-if="content && status" :status="status" />

  <!-- filename -->
  <strong v-if="annotations.length"
    >Annotations for {{ filename || "pasted text" }}</strong
  >

  <!-- results -->
  <p v-if="annotations.length">
    <tippy
      v-for="({ text, tokens }, annotationIndex) in annotations"
      :key="annotationIndex"
      :interactive="true"
      :append-to="appendToBody"
    >
      <span :tabindex="tokens.length ? 0 : -1">{{ text }}</span>
      <template v-if="!!tokens.length" #content>
        <div class="table">
          <template v-for="(token, tokenIndex) in tokens" :key="tokenIndex">
            <AppIcon :icon="`category-${kebabCase(token.category)}`" />
            <AppLink :to="`/${kebabCase(token.category)}/${token.id}`">{{
              token.id
            }}</AppLink>
            <div class="truncate">{{ token.name }}</div>
          </template>
        </div>
      </template>
    </tippy>
  </p>

  <!-- actions -->
  <AppFlex v-if="annotations.length">
    <AppButton text="Download" icon="download" @click="download" />
    <AppButton
      v-tippy="
        'Send any annotations above that are phenotypes to Phenotype Explorer'
      "
      text="Analyze Phenotypes"
      icon="bars-progress"
      @click="analyze"
    />
  </AppFlex>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { kebabCase, uniqBy } from "lodash";
import AppInput from "@/components/AppInput.vue";
import AppUpload from "@/components/AppUpload.vue";
import AppStatus from "@/components/AppStatus.vue";
import example from "./text-annotator.json";
import { annotateText } from "@/api/text-annotator";
import { Status } from "@/components/AppStatus";
import { Result } from "@/api/text-annotator";
import { ApiError } from "@/api";
import { downloadJson } from "@/util/download";
import { setData } from "@/router";
import { useRouter } from "vue-router";
import { appendToBody } from "@/global/tippy";

// route info
const router = useRouter();

// text content
const content = useLocalStorage("annotations-content", "");
// file name of uploaded file (if applicable)
const filename = useLocalStorage("annotations-filename", "");
// annotation results
const annotations = ref<Result>([]);
// status of query
const status = ref<Status | null>(null);

// get text content and filename from upload button
function onUpload(data = "", file = "") {
  content.value = data;
  annotate(file);
}

// example full text
function doExample() {
  content.value = example.content;
  annotate();
}

// run annotation
async function annotate(file = "") {
  // reset filename depending on search method
  filename.value = file;

  // loading...
  status.value = { code: "loading", text: "Computing annotations" };
  annotations.value = [];

  try {
    // get results from api
    annotations.value = await annotateText(content.value);

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    if (content.value.trim()) status.value = error as ApiError;
    else status.value = null;
  }
}

// download annotations
function download() {
  downloadJson(
    annotations.value.filter(({ tokens }) => tokens.length),
    "annotations"
  );
}

// send phenotype annotations to phenotype explorer to analyze
function analyze() {
  // gather annotations that are phenotypes
  const phenotypes = [];
  for (const { tokens } of annotations.value)
    for (const { id, name } of tokens)
      if (id.startsWith("HP:")) phenotypes.push({ id, name });

  // de-duplicate, and send them to phenotype explorer component via router
  setData(uniqBy(phenotypes, "id"));
  router.push({ hash: "#phenotype-explorer" });
}

// run annotations on mount if content loaded from storage
onMounted(() => {
  if (content.value) annotate(filename.value || "");
});
</script>

<style lang="scss" scoped>
p {
  white-space: pre-line;
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
