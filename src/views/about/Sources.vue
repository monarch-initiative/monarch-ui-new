<template>
  <AppSection>
    <h1>Sources</h1>

    <AppButton
      icon="download"
      text="All Downloads"
      to="https://archive.monarchinitiative.org/latest/"
    />

    <!-- list of all sources -->
    <AppAccordion v-for="(source, index) in sources" :key="index">
      <!-- title of accordion button -->
      <template #title>
        {{ source.name || "" }}
        <AppIcon
          v-if="source.type"
          class="icon"
          :icon="source.type === 'dataset' ? 'database' : 'puzzle-piece'"
          v-tooltip="toStartCase(source.type)"
        />
      </template>

      <!-- content when accordion expanded -->
      <template #content>
        <!-- row of details and links -->
        <div class="details">
          <AppDetail
            v-if="source.link"
            icon="home"
            text="Home"
            :to="source.link"
            v-tooltip="'Homepage or repository for this source'"
          />
          <AppDetail
            v-if="source.license"
            icon="balance-scale"
            text="License"
            :to="source.license"
            v-tooltip="'Link to licensing information for this source'"
          />
          <AppDetail
            v-if="source.rdf"
            icon="download"
            text="RDF"
            :to="source.rdf"
            v-tooltip="'Download Resource Description Framework file'"
          />
          <AppDetail
            v-if="source.date"
            icon="calendar-alt"
            :text="source.date"
            v-tooltip="'Date when this source was ingested into Monarch'"
          />
        </div>

        <!-- row of picture, description, and other summary info -->
        <img
          v-if="getSrc(source.image)"
          class="image"
          :src="getSrc(source.image)"
          :alt="source.name"
        />
        <p v-if="source.description">
          {{ source.description }}
        </p>
        <AppMarkdown v-if="source.use" :source="source.use" component="p" />

        <!-- row of file download links -->
        <p v-if="source.files?.length">
          <strong>Ingested Files:</strong>
        </p>
        <div class="files" v-if="source.files?.length">
          <AppLink
            v-for="(file, index) in source.files"
            :key="index"
            :to="file"
            class="truncate"
          >
            {{ getFilename(file) }}
          </AppLink>
        </div>
      </template>
    </AppAccordion>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { startCase } from "lodash";
import sources from "./sources.yaml";

// expected shape of source
interface Source {
  // static (manually written out in sources.yaml)
  name?: string;
  type?: string;
  link?: string;
  license?: string;
  image?: string;
  description?: string;
  usage?: string;
  vocabulary?: string;
  iri?: string;
  reusable?: string;

  // dynamic (retrieved from biolink api)
  date: string;
  rdf: string;
  files: Array<string>;
}

// sources page
export default defineComponent({
  data() {
    return {
      // sources data
      sources,
    };
  },
  methods: {
    // get source img src with fallback if not found
    getSrc(image: string) {
      try {
        return require(`@/assets/sources/${image}`);
      } catch (error) {
        return false;
      }
    },
    // get filename from full path
    getFilename(path: string) {
      return path.split("/").pop();
    },
    // expose toStartCase
    toStartCase(string: string) {
      return startCase(string);
    },
  },
  mounted() {
    this.sources = this.sources
      // merge dynamic source info into static source info
      .map(
        (source: Source): Source => ({
          ...source,
          // temporary dummy dynamic info
          date: "2021-10-13",
          rdf: "https://monarchinitiative.org/",
          files: Array(10).fill("https://monarchinitiative.org/test-file.txt"),
        })
      )
      // sort alphabetically by name
      .sort((a: Source, b: Source) => {
        if ((a?.name || "") < (b?.name || "")) return -1;
        else return 1;
      });
  },
});
</script>

<style lang="scss" scoped>
.content {
  & > * {
    margin: 20px 0;
    @include trim-v-margins;
  }
}

.icon {
  margin-left: 10px;
  color: $gray;
}

.details {
  text-align: left;
}

.image {
  max-width: min(100%, 200px);
  max-height: 100px;
  margin: 10px;
}

.files {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  text-align: left;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}
</style>
