<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
-->
<template>
  <AppSection>
    <AppHeading>Testbed</AppHeading>
  </AppSection>

  <!-- single select component -->
  <AppSection>
    <AppHeading>Single Select</AppHeading>

    <AppFlex direction="col">
      <span>{{ singleSelectValue }}</span>
      <AppSelectSingle
        name="Single select test"
        :options="singleSelectOptions"
        v-model="singleSelectValue"
      />
    </AppFlex>
  </AppSection>

  <!-- multi select component -->
  <AppSection>
    <AppHeading>Multi Select</AppHeading>

    <AppFlex direction="col">
      <span>{{ multiSelectValue }}</span>
      <AppSelectMulti
        name="Multi select test"
        :options="multiSelectOptions"
        v-model="multiSelectValue"
      />
      <AppSelectMulti
        name="Multi select test"
        :options="multiSelectOptions"
        v-model="multiSelectValue"
        v-slot="props"
      >
        <AppButton icon="filter" v-bind="props" design="small" />
      </AppSelectMulti>
    </AppFlex>
  </AppSection>

  <!-- button component -->
  <AppSection>
    <AppHeading>Button</AppHeading>
    <AppFlex>
      <AppButton to="/" design="primary" text="primary" />
      <AppButton to="/" design="primary" text="primary" icon="download" />
      <AppButton to="/" design="primary" icon="download" />
    </AppFlex>
    <AppFlex>
      <AppButton @click="alert('test')" design="secondary" text="secondary" />
      <AppButton
        @click="alert('test')"
        design="secondary"
        text="secondary"
        icon="download"
      />
      <AppButton @click="alert('test')" design="secondary" icon="download" />
    </AppFlex>
    <AppFlex>
      <AppButton to="/" design="small" text="small" />
      <AppButton to="/" design="small" text="small" icon="download" />
      <AppButton to="/" design="small" icon="download" />
    </AppFlex>
    <AppFlex>
      <AppButton to="/" design="circle" text="circle" />
      <AppButton to="/" design="circle" text="circle" icon="download" />
      <AppButton to="/" design="circle" icon="download" />
    </AppFlex>
  </AppSection>

  <!-- tabs component -->
  <AppSection>
    <AppHeading>Tabs</AppHeading>
    <AppTabs
      :tabs="[
        { id: 'apple', text: 'Apple', icon: 'info-circle' },
        { id: 'pear', text: 'Pear', icon: 'info-circle' },
      ]"
      default="apple"
    >
      <template #apple>I'm a little apple</template>
      <template #pear>I'm a little pear</template>
    </AppTabs>
  </AppSection>

  <!-- status component -->
  <AppSection>
    <AppHeading>Status</AppHeading>
    <AppGallery>
      <AppStatus :status="{ code: 'loading', text: 'Loading some results' }" />
      <AppStatus :status="{ code: 'success', text: 'Action was a success' }" />
      <AppStatus :status="{ code: 'warning', text: 'Be careful' }" />
      <AppStatus :status="{ code: 'error', text: 'There was an error' }" />
      <AppStatus :status="{ code: 'paused', text: 'Action is paused' }" />
      <AppStatus :status="{ code: 'unknown', text: 'Unexpected result' }" />
      <AppStatus :status="{ code: 'success' }">
        <strong>Atribtrary content using slot</strong>
      </AppStatus>
    </AppGallery>
  </AppSection>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppStatus from "@/components/AppStatus.vue";
import AppTabs from "@/components/AppTabs.vue";
import AppSelectSingle from "@/components/AppSelectSingle.vue";
import AppSelectMulti from "@/components/AppSelectMulti.vue";

export default defineComponent({
  components: {
    AppStatus,
    AppTabs,
    AppSelectSingle,
    AppSelectMulti,
  },
  data() {
    return {
      singleSelectOptions: [
        "apple",
        "banana",
        "cherry",
        "durian",
        "elderberry",
        "fig",
        "grape",
        "honeydew",
      ],
      singleSelectValue: "durian",
      multiSelectOptions: [
        { value: "fruits", count: 0 },
        { value: "vegetables", count: 7 },
        { value: "colors", count: 42 },
        { value: "animals", count: 999 },
        { value: "cars" },
        { value: "schools" },
        { value: "appliances" },
      ],
      multiSelectValue: [{ value: "vegetables" }],
    };
  },
  methods: {
    alert(message = "") {
      window.alert(message);
    },
  },
});
</script>
