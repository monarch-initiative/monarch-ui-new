<!--
  dev page for experimenting with design and behavior of components. also a 
  place for seeing all variations at once to check for coherence. not included
  in production build of site.
-->
<template>
  <!-- status component -->
  <AppSection>
    <AppGallery>
      <AppStatus code="loading" text="Loading some results" />
      <AppStatus code="success" text="Action was a success" />
      <AppStatus code="warning" text="Be careful" />
      <AppStatus code="error" text="There was an error" />
      <AppStatus code="paused" text="Action is paused" />
      <AppStatus code="unknown" text="Unexpected result" />
    </AppGallery>
  </AppSection>
</template>
