<!--
  about landing page
-->

<template>
  <!-- brief overview -->
  <AppSection>
    <AppHeading>About</AppHeading>
    <p>
      The Monarch Initiative is an extensive, comprehensive knowledge graph and
      ecosystem of tools made for the benefit of clinicians, researchers, and
      scientists. The knowledge graph consists of XX genes, diseases,
      phenotypes, and other entities, imported from over XX sources. Monarch
      connects phenotypes to genotypes across species and bridges basic and
      applied research with semantics-based analysis.
    </p>
  </AppSection>

  <!-- main links to sub pages -->
  <AppSection>
    <AppFlex gap="big">
      <AppTile
        to="/overview"
        icon="cogs"
        title="Overview"
        subtitle="How all the pieces of Monarch fit together"
      />
      <AppTile
        to="https://github.com/biolink/biolink-api"
        icon="code"
        title="API"
        subtitle="The API behind this website, BioLink"
      />
      <AppTile
        to="/sources"
        icon="database"
        title="Sources"
        subtitle="Datasets, ontologies, and downloads"
      />
      <AppTile
        to="/cite"
        icon="feather-alt"
        title="Cite"
        subtitle="How to cite and attribute Monarch"
      />
      <AppTile
        to="/team"
        icon="users"
        title="Team"
        subtitle="The people behind Monarch"
      />
      <AppTile
        to="/publications"
        icon="newspaper"
        title="Publications"
        subtitle="Monarch-related published works"
      />
      <AppTile
        to="/terms"
        icon="balance-scale"
        title="Terms of Use"
        subtitle="Disclaimers and agreements"
      />
    </AppFlex>
  </AppSection>

  <!-- mission statement -->
  <AppSection>
    <AppHeading>Our Vision</AppHeading>
    <ol>
      <li>
        Connect cross-species gene, genotype, variant, disease, and phenotype
        data
      </li>
      <li>Provide a portal for exploration of phenotype-based similarity</li>
      <li>
        Facilitate identification of animal models of human disease through
        phenotypic similarity
      </li>
      <li>Enable quantitative comparison of cross-species phenotypes</li>
      <li>Develop embeddable widgets for data exploration</li>
      <li>Influence genotype and phenotype reporting standards</li>
      <li>Improve ontologies to better curate genotype-phenotype data</li>
    </ol>
  </AppSection>
</template>
