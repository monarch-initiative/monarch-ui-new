<template>
  <footer>
    <div class="social">
      <a
        href=""
        v-tooltip="
          'Subscribe to our newsletter for occassional detailed updates'
        "
      >
        <FontAwesomeIcon icon="envelope-open-text" />
      </a>
      <a href="" v-tooltip="'Star and follow us on GitHub for new releases'">
        <FontAwesomeIcon :icon="['fab', 'github']" />
      </a>
      <a href="" v-tooltip="'Read our blog on Medium'">
        <FontAwesomeIcon icon="blog" />
      </a>
      <a href="" v-tooltip="'Follow us on Twitter for updates and musings'">
        <FontAwesomeIcon :icon="['fab', 'twitter']" />
      </a>
    </div>
    <div class="license">
      <span>Monarch Intiative {{ new Date().getFullYear() }}</span>
      <span>&nbsp; · &nbsp;</span>
      <a href="" class="license">BSD-3 License</a>
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
}

a {
  color: $white;
  transition: opacity $fast;
}

.social {
  display: flex;
}

.social a {
  padding: 10px;
}

.social:hover a {
  opacity: 0.2;
}

.social:hover a:hover {
  opacity: 1;
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
