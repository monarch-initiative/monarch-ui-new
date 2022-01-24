<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
-->
<template>
  <AppSection>
    <AppHeading>Testbed</AppHeading>
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
      <AppButton to="/" design="secondary" text="secondary" />
      <AppButton to="/" design="secondary" text="secondary" icon="download" />
      <AppButton to="/" design="secondary" icon="download" />
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

export default defineComponent({
  components: {
    AppStatus,
    AppTabs,
  },
});
</script>
