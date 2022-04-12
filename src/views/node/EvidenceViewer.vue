<!--
  node page associations section, viewer for supporting evidence of an 
  association 
-->

<template>
  <strong ref="section">
    Evidence for
    <span v-tippy="selectedAssociation">selected association</span>
  </strong>
  <!-- status -->
  <AppStatus v-if="status" :status="status" />

  <!-- evidence tabs -->
  <AppTabs
    v-else
    name="Evidence viewing mode"
    :history="false"
    :tabs="[
      {
        id: 'summary',
        text: 'Summary',
        icon: 'clipboard',
        tooltip: 'High-level overview of evidence',
      },
      {
        id: 'table',
        text: 'Table',
        icon: 'table',
        tooltip: 'All evidence data, in tabular form',
      },
    ]"
  >
    <!-- summary mode -->
    <template v-if="summary" #summary>
      <AppDetails>
        <AppDetail
          :title="`Evidence Codes`"
          :count="summary?.codes.length"
          icon="flask"
        >
          <AppLink
            v-for="(code, index) in summary?.codes"
            :key="index"
            :to="code.link"
            >{{ code.name }}</AppLink
          >
        </AppDetail>

        <AppDetail
          :title="`Sources`"
          :count="summary?.sources.length"
          icon="database"
        >
          <AppLink
            v-for="(source, index) in summary?.sources"
            :key="index"
            :to="source"
            v-html="breakUrl(source)"
          />
        </AppDetail>

        <AppDetail
          :title="`Publications`"
          :count="summary?.publications.length"
          icon="book"
        >
          <AppFlex gap="small" h-align="left">
            <AppLink
              v-for="(publication, index) in summary?.publications"
              :key="index"
              :to="publication.link"
              >{{ publication.name }}</AppLink
            >
          </AppFlex>
        </AppDetail>
      </AppDetails>
    </template>

    <!-- table mode -->
    <template v-if="table?.length" #table>
      <AppTable
        :cols="cols"
        :rows="table || []"
        :start="0"
        :total="table?.length || 0"
      >
        <!-- "subject" -->
        <template #subject="{ cell }">
          <span class="truncate">
            {{ cell.name }}
          </span>
        </template>

        <!-- relation -->
        <template #relation="{ cell }">
          <AppIcon
            class="arrow"
            :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
          />
          <AppLink class="truncate" :to="cell.iri" :no-icon="true">{{
            startCase(cell.name)
          }}</AppLink>
          <AppIcon
            class="arrow"
            :icon="cell.inverse ? 'arrow-left-long' : 'arrow-right-long'"
          />
        </template>

        <!-- "object" -->
        <template #object="{ cell }">
          <AppLink class="truncate" :to="`/${cell.category}/${cell.id}`">{{
            cell.name
          }}</AppLink>
        </template>
      </AppTable>
    </template>
  </AppTabs>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { startCase } from "lodash";
import AppTabs from "@/components/AppTabs.vue";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";
import AppTable from "@/components/AppTable.vue";
import AppStatus from "@/components/AppStatus.vue";
import { Status } from "@/components/AppStatus";
import { scrollToElement } from "@/router";
import { getEvidence, Result } from "@/api/association-evidence";
import { ApiError } from "@/api";
import { breakUrl } from "@/util/string";

interface Props {
  // selected association id
  selectedAssociation: string;
}

const props = defineProps<Props>();

// evidence data
const summary = ref<Result["summary"]>();
const table = ref<Result["table"]>();
// status of query
const status = ref<Status | null>(null);
// section element reference
const section = ref<HTMLElement>();

// table columns
const cols = [
  {
    id: "subject",
    key: "subject",
    heading: "Subject",
    width: "1fr",
  },
  {
    id: "relation",
    key: "relation",
    heading: "Relation",
    width: "1fr",
  },
  {
    id: "object",
    key: "object",
    heading: "Object",
    width: "1fr",
  },
];

// get evidence data
async function getData() {
  try {
    // scroll to section
    scrollToElement(section.value);

    // loading...
    status.value = { code: "loading", text: "Loading evidence data" };

    // get evidence data
    const response = await getEvidence(props.selectedAssociation);
    summary.value = response.summary;
    table.value = response.table;

    // clear status
    status.value = null;
  } catch (error) {
    // error...
    status.value = error as ApiError;
  }
}

onMounted(getData);
watch(() => props.selectedAssociation, getData);
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
</style>
