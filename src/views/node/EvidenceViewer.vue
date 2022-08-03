<!--
  node page associations section, viewer for supporting evidence of an 
  association 
-->

<template>
  <AppSection>
    <AppHeading icon="flask">Evidence</AppHeading>

    <AppFlex direction="col">
      <span>... for the selected association:</span>

      <AppFlex gap="small">
        <span class="truncate">{{ node.name }}</span>
        <AppIcon
          class="arrow"
          :icon="
            selectedAssociation.relation.inverse
              ? 'arrow-left-long'
              : 'arrow-right-long'
          "
        />
        <AppLink :to="selectedAssociation.relation.iri" :no-icon="true">{{
          selectedAssociation.relation.name
        }}</AppLink>
        <AppIcon
          class="arrow"
          :icon="
            selectedAssociation.relation.inverse
              ? 'arrow-left-long'
              : 'arrow-right-long'
          "
        />
        <AppLink
          :to="`/${selectedAssociation.object.category}/${selectedAssociation.object.id}`"
          >{{ selectedAssociation.object.name }}</AppLink
        >
      </AppFlex>
    </AppFlex>

    <!-- status -->
    <AppStatus v-if="isLoading" code="loading">Loading evidence</AppStatus>
    <AppStatus v-else-if="isError" code="error"
      >Error loading evidence</AppStatus
    >

    <!-- evidence tabs -->
    <AppTabs
      v-else
      v-model="tab"
      :tabs="tabs"
      name="Evidence viewing mode"
      :url="false"
    />

    <!-- summary mode -->
    <template v-if="tab === 'summary' && evidence.summary">
      <AppDetails>
        <AppDetail
          :title="`Evidence Codes`"
          :count="evidence.summary?.codes.length"
          icon="flask"
        >
          <AppLink
            v-for="(code, index) in evidence.summary?.codes"
            :key="index"
            :to="code.link"
            >{{ code.name }}</AppLink
          >
        </AppDetail>

        <AppDetail
          :title="`Sources`"
          :count="evidence.summary?.sources.length"
          icon="database"
        >
          <AppLink
            v-for="(source, index) in evidence.summary?.sources"
            :key="index"
            :to="source"
            v-html="breakUrl(source)"
          />
        </AppDetail>

        <AppDetail
          :title="`Publications`"
          :count="evidence.summary?.publications.length"
          icon="book"
        >
          <AppFlex gap="small" h-align="left">
            <AppLink
              v-for="(publication, index) in evidence.summary?.publications"
              :key="index"
              :to="publication.link"
              >{{ publication.name }}</AppLink
            >
          </AppFlex>
        </AppDetail>
      </AppDetails>
    </template>

    <!-- table mode -->
    <template v-if="tab === 'table' && evidence.table?.length">
      <AppTable
        :cols="cols"
        :rows="evidence.table || []"
        :start="0"
        :total="evidence.table?.length || 0"
        :show-controls="false"
        @download="download"
      >
        <!-- "subject" -->
        <template #subject="{ cell }">
          <AppLink class="truncate" :to="`/${cell.category}/${cell.id}`">{{
            cell.name
          }}</AppLink>
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
        <template #object="{ cell, row }">
          <AppBreadcrumbsLink
            class="truncate"
            :to="`/${cell.category}/${cell.id}`"
            :breadcrumb="{ subject: row.subject, relation: row.relation }"
            >{{ cell.name }}</AppBreadcrumbsLink
          >
        </template>

        <!-- evidence codes -->
        <template #codes="{ cell }">
          <AppFlex direction="col" gap="small" h-align="left">
            <AppLink
              v-for="(code, index) in cell"
              :key="index"
              :to="code.link"
              :no-icon="true"
              >{{ code.name }}</AppLink
            >
          </AppFlex>
        </template>

        <!-- publications -->
        <template #publications="{ cell }">
          <AppFlex direction="col" gap="small" h-align="left">
            <AppLink
              v-for="(publication, index) in cell.slice(0, 1)"
              :key="index"
              :to="publication.link"
              :no-icon="true"
              >{{ publication.name }}</AppLink
            >
            <template v-if="cell.length > 1">
              <tooltip :interactive="true" :append-to="appendToBody">
                <span>and {{ cell.length - 1 }} more...</span>
                <template #content>
                  <AppFlex h-align="left" gap="tiny">
                    <AppLink
                      v-for="(publication, index) in cell.slice(1)"
                      :key="index"
                      :to="publication.link"
                      >{{ publication.name }}</AppLink
                    >
                  </AppFlex>
                </template>
              </tooltip>
            </template>
          </AppFlex>
        </template>

        <!-- sources -->
        <template #sources="{ cell }">
          <AppLink
            v-for="(code, index) in cell"
            :key="index"
            :to="code.link"
            :no-icon="true"
            >{{ code.name }}</AppLink
          >
        </template>

        <!-- references -->
        <template #references="{ cell }">
          <AppLink
            v-for="(code, index) in cell"
            :key="index"
            :to="code.link"
            :no-icon="true"
            >{{ code.name }}</AppLink
          >
        </template>
      </AppTable>
    </template>
  </AppSection>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
import { startCase } from "lodash";
import AppTabs from "@/components/AppTabs.vue";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";
import AppTable from "@/components/AppTable.vue";
import AppStatus from "@/components/AppStatus.vue";
import AppBreadcrumbsLink from "@/components/AppBreadcrumbsLink.vue";
import { Node } from "@/api/node-lookup";
import { scrollToElement } from "@/router";
import { getAssociationEvidence } from "@/api/association-evidence";
import { breakUrl } from "@/util/string";
import { appendToBody } from "@/global/tooltip";
import { waitFor } from "@/util/dom";
import { Association } from "@/api/node-associations";
import { useQuery } from "@/util/composables";
import { snackbar } from "@/components/TheSnackbar";
import { downloadJson } from "@/util/download";

interface Props {
  /** current node */
  node: Node;
  /** selected association id */
  selectedAssociation: Association;
}

const props = defineProps<Props>();

/** mode tabs */
const tabs = [
  {
    id: "summary",
    text: "Summary",
    icon: "clipboard",
    tooltip: "High-level overview of evidence",
  },
  {
    id: "table",
    text: "Table",
    icon: "table",
    tooltip: "All evidence data, in tabular form",
  },
];
const tab = ref(tabs[0].id);

/** table columns */
const cols = [
  {
    id: "subject",
    key: "subject",
    heading: "Subject",
  },
  {
    id: "relation",
    key: "relation",
    heading: "Relation",
  },
  {
    id: "object",
    key: "object",
    heading: "Object",
  },
  {
    id: "codes",
    key: "codes",
    heading: "Evidence Codes",
    width: "max-content",
  },
  {
    id: "publications",
    key: "publications",
    heading: "Publications",
    width: "max-content",
  },
  {
    id: "sources",
    key: "sources",
    heading: "Sources",
  },
  {
    id: "references",
    key: "references",
    heading: "References",
  },
];

/** get evidence data */
const {
  query: getEvidence,
  data: evidence,
  isLoading,
  isError,
} = useQuery(
  async function () {
    /** scroll to evidence section */
    waitFor("#evidence", scrollToElement);

    /** get evidence data */
    const response = await getAssociationEvidence(
      props.selectedAssociation?.id
    );

    return response;
  },

  /** default value */
  { summary: { codes: [], publications: [], sources: [] }, table: [] }
);

/** download table data */
async function download() {
  /** warn user */
  snackbar(
    `Downloading data for ${evidence.value.table.length} table entries.`
  );

  downloadJson(evidence.value.table);
}

onMounted(getEvidence);
watch(() => props.selectedAssociation, getEvidence);
</script>

<style lang="scss" scoped>
.arrow {
  color: $gray;
}
</style>
