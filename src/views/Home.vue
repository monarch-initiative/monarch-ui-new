<template>
  <AppSection design="fill">
    <h2>Explore</h2>
    <AppInput placeholder="Search for something" />
  </AppSection>
  <AppSection>
    <h2 v-heading>What is Monarch?</h2>
    <AppPlaceholder />
    <AppButton to="/about" text="Learn more" icon="arrow-right" />
  </AppSection>
  <AppSection>
    <h2 v-heading>How to use Monarch</h2>
    <AppGallery>
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
    </AppGallery>
  </AppSection>
  <AppSection>
    <h2 v-heading>Who's using Monarch</h2>
    <AppGallery>
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
      <AppPlaceholder />
    </AppGallery>
  </AppSection>
</template>
