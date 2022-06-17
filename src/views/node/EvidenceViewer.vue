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
    <AppStatus v-if="status" :status="status" />

    <!-- evidence tabs -->
    <AppTabs
      v-else
      name="Evidence viewing mode"
      :url="false"
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
          :show-controls="false"
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
          <template #object="{ cell }">
            <AppLink class="truncate" :to="`/${cell.category}/${cell.id}`">{{
              cell.name
            }}</AppLink>
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
                <tippy :interactive="true" :append-to="appendToBody">
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
                </tippy>
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
    </AppTabs>
  </AppSection>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { startCase } from "lodash";
import AppTabs from "@/components/AppTabs.vue";
import AppDetails from "@/components/AppDetails.vue";
import AppDetail from "@/components/AppDetail.vue";
import AppTable from "@/components/AppTable.vue";
import AppStatus from "@/components/AppStatus.vue";
import { Result as NodeResult } from "@/api/node-lookup";
import { Status } from "@/components/AppStatus";
import { scrollToElement } from "@/router";
import { getEvidence, Result } from "@/api/association-evidence";
import { ApiError } from "@/api";
import { breakUrl } from "@/util/string";
import { appendToBody } from "@/global/tippy";
import { waitFor } from "@/util/dom";
import { Association } from "@/api/node-associations";

interface Props {
  /** current node */
  node: NodeResult;
  /** selected association id */
  selectedAssociation: Association;
}

const props = defineProps<Props>();

/** evidence data */
const summary = ref<Result["summary"]>();
const table = ref<Result["table"]>();
/** status of query */
const status = ref<Status | null>(null);

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
async function getData() {
  try {
    /** scroll to evidence section */
    waitFor("#evidence", scrollToElement);

    /** loading... */
    status.value = { code: "loading", text: "Loading evidence data" };

    /** get evidence data */
    const response = await getEvidence(props.selectedAssociation?.id);
    summary.value = response.summary;
    table.value = response.table;

    /** clear status */
    status.value = null;
  } catch (error) {
    /** error... */
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
