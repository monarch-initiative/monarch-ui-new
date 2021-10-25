<template>
  <!-- 
    higher-order component (hoc) to test heading auto-levels/links. use data
    attributes to indicate expected.
  -->
  <AppSection>
    <AppHeading data-tag="h1" data-link="abc-def-gih">ABC-def_gih</AppHeading>
  </AppSection>
  <AppSection>
    <AppHeading data-tag="h2" data-link="123-alphabet-street">
      123 Alphabet Street
    </AppHeading>
    <AppHeading data-tag="h3" data-link="aeo">áéó</AppHeading>
  </AppSection>
</template>
