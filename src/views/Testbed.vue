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
        name="Fruit"
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
        name="Category"
        :options="multiSelectOptions"
        v-model="multiSelectValue"
      />
      <AppSelectMulti
        name="Category"
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
      <AppButton
        v-for="([design, color, text, icon], index) of buttons"
        :key="index"
        to="/"
        @click="alert"
        :design="design"
        :color="color"
        :text="text"
        :icon="icon"
      />
    </AppFlex>
  </AppSection>

  <!-- tabs component -->
  <AppSection>
    <AppHeading>Tabs</AppHeading>
    <AppTabs
      name="Tab group"
      :tabs="[
        { id: 'apple', text: 'Apple', icon: 'asterisk' },
        { id: 'banana', text: 'Banana', icon: 'cogs' },
        { id: 'cherry', text: 'Cherry', icon: 'home' },
        { id: 'durian', text: 'Durian', icon: 'puzzle-piece' },
        { id: 'elderberry', text: 'Elderberry', icon: 'tools' },
      ]"
      default="apple"
    >
      <template #apple>I'm a little apple</template>
      <template #banana>I'm a little banana</template>
      <template #cherry>I'm a little cherry</template>
      <template #durian>I'm a little durian</template>
      <template #elderberry>I'm a little elderberry</template>
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
    const buttons = [];
    for (const design of ["normal", "rounded", "small"])
      for (const color of ["primary", "secondary"])
        for (const [text, icon] of [
          ["Text", ""],
          ["Text", "download"],
          ["", "download"],
        ])
          buttons.push([design, color, text, icon]);

    return {
      buttons,
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
    alert() {
      window.alert("alert");
    },
  },
});
</script>
