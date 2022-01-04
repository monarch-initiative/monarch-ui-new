<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
-->
<template>
  <!-- buttons -->
  <AppSection>
    <AppFlex>
      <AppButton design="primary" text="primary" />
      <AppButton design="primary" text="primary" icon="fab twitter" />
      <AppButton design="primary" icon="fab twitter" />
    </AppFlex>
    <AppFlex>
      <AppButton design="secondary" text="secondary" />
      <AppButton design="secondary" text="secondary" icon="fab twitter" />
      <AppButton design="secondary" icon="fab twitter" />
    </AppFlex>
    <AppFlex>
      <AppButton design="small" text="small" />
      <AppButton design="small" text="small" icon="fab twitter" />
      <AppButton design="small" icon="fab twitter" />
    </AppFlex>
    <AppFlex>
      <AppButton design="circle" text="circle" />
      <AppButton design="circle" text="circle" icon="fab twitter" />
      <AppButton design="circle" icon="fab twitter" />
    </AppFlex>
  </AppSection>

  <!-- status component -->
  <AppSection>
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

export default defineComponent({
  components: {
    AppStatus,
  },
});
</script>
