<template>
  <footer>
    <div class="social">
      <AppLink to="https://substack.com/" v-tooltip="'Newsletter'">
        <AppIcon icon="envelope-open-text" />
      </AppLink>
      <AppLink to="https://github.com/monarch-initiative" v-tooltip="'GitHub'">
        <AppIcon icon="github" />
      </AppLink>
      <AppLink to="https://twitter.com/MonarchInit" v-tooltip="'Twitter'">
        <AppIcon icon="twitter" />
      </AppLink>
      <AppLink to="https://medium.com/@MonarchInit" v-tooltip="'Blog'">
        <AppIcon icon="blog" />
      </AppLink>
    </div>
    <div class="license">
      <span>Monarch Intiative {{ new Date().getFullYear() }}</span>
      <span>&nbsp; · &nbsp;</span>
      <AppLink to="/terms" class="license">BSD-3</AppLink>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
$wrap: 500px;

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: $theme-dark;
  color: $white;
  font-size: 0.9rem;
  z-index: 1;
}

a {
  color: $white;
  transition: opacity $fast;

  &:hover {
    opacity: 0.5;
  }
}

.social {
  display: flex;
  font-size: 1.1rem;
  gap: 10px;
}

.social a {
  padding: 5px;
}

.license {
  text-align: center;
  line-height: $spacing;
}

@media (max-width: $wrap) {
  footer {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
