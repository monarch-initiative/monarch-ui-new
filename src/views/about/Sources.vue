<template>
  <AppSection>
    <AppHeading>Sources</AppHeading>

    <!-- filters -->
    <AppFlex>
      <AppCheckbox v-model="showDatasets" text="Datasets" icon="database" />
      <AppCheckbox
        v-model="showOntologies"
        text="Ontologies"
        icon="puzzle-piece"
      />
    </AppFlex>

    <!-- list of all sources -->
    <AppFlex direction="col">
      <AppAccordion
        v-for="(source, index) in filteredSources"
        :key="index"
        :text="source.name || source.id || ''"
        :icon="source.type === 'dataset' ? 'database' : 'puzzle-piece'"
      >
        <!-- row of details and links -->
        <AppFlex>
          <AppButton
            v-if="source.link"
            design="small"
            icon="home"
            text="Home"
            :to="source.link"
            v-tooltip="'Homepage or repository for this source'"
          />
          <AppButton
            v-if="source.license"
            design="small"
            icon="balance-scale"
            text="License"
            :to="source.license"
            v-tooltip="'Link to licensing information for this source'"
          />
          <AppButton
            v-if="source.rdf"
            design="small"
            icon="download"
            text="RDF"
            :to="source.rdf"
            v-tooltip="'Download Resource Description Framework file'"
          />
          <AppButton
            v-if="source.date"
            design="small"
            :active="false"
            icon="calendar-alt"
            :text="source.date"
            v-tooltip="'Date when this source was ingested into Monarch'"
          />
        </AppFlex>

        <!-- row of picture, description, and other summary info -->
        <img
          v-if="getSrc(source.image)"
          class="image"
          :src="getSrc(source.image)"
          :alt="source.name"
        />
        <p v-if="source.description" v-html="source.description" />
        <AppMarkdown v-if="source.usage" :source="source.usage" component="p" />

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
      </AppAccordion>
    </AppFlex>
  </AppSection>

  <!-- all downloads -->
  <AppSection>
    <p>
      A listing of all data that Monarch archives for use in its knowledge graph
      and tools:
    </p>
    <AppButton
      icon="download"
      text="All Downloads"
      to="https://archive.monarchinitiative.org/latest/"
    />
  </AppSection>

  <!-- notes -->
  <AppSection>
    <AppHeading>Note about licensing</AppHeading>
    <p>
      Each of these sources has its own license. We have described this
      licensing challenge extensively on
      <AppLink to="https://reusabledata.org/">reusabledata.org</AppLink> and our
      <AppLink to="https://doi.org/10.1371/journal.pone.0213090"
        >2018 PlosOne publication</AppLink
      >. Many of the specific data resources we use in Monarch have been
      evaluated according to our reusabledata.org rubric; see the
      <AppLink to="https://reusabledata.org/#our-sources-data"
        >corpus of evaluations here</AppLink
      >.
    </p>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sources from "./sources.yaml";
import AppCheckbox from "@/components/AppCheckbox.vue";
import AppAccordion from "@/components/AppAccordion.vue";
import { getDatasets } from "@/api/datasets";
import { getOntologies } from "@/api/ontologies";
import { Source } from "@/types/sources";

// sources page
export default defineComponent({
  components: {
    AppCheckbox,
    AppAccordion,
  },
  data() {
    return {
      // sources data
      sources: sources as Array<Source>,
      // whether to show dataset sources
      showDatasets: true,
      // whether to show ontology sources
      showOntologies: true,
    };
  },
  methods: {
    // get source img src
    getSrc(image = "") {
      try {
        if (image.startsWith("http")) return image;
        else return require(`@/assets/sources/${image}`);
      } catch (error) {
        return false;
      }
    },
    // get filename from full path
    getFilename(path = "") {
      return path.split("/").pop();
    },
  },
  computed: {
    filteredSources(): Array<Source> {
      return this.sources.filter(
        (source: Source) =>
          (source.type === "dataset" && this.showDatasets) ||
          (source.type === "ontology" && this.showOntologies)
      );
    },
  },
  async mounted() {
    // get dynamic source info
    const datasets = await getDatasets();
    const ontologies = await getOntologies();
    const dynamic = [...datasets, ...ontologies];

    // merge dynamic source info into static source info
    for (const source of this.sources) {
      // find match between static and dynamic by id
      const match = dynamic.find((d: Source) => source.id === d.id);

      // merge props
      if (match) Object.assign(source, match);
    }

    // sort sources alphabetically by name or id
    this.sources.sort((a: Source, b: Source) => {
      if (
        (a?.name || a?.id || "").toLowerCase() <
        (b?.name || b?.id || "").toLowerCase()
      )
        return -1;
      else return 1;
    });
  },
});
</script>

<style lang="scss" scoped>
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
