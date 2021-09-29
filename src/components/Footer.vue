<template>
  <footer>
    <div class="social">
      <a
        href=""
        aria-label="Subscribe to our newsletter for occassional detailed updates"
      >
        <FontAwesomeIcon icon="envelope-open-text" />
      </a>
      <a href="" aria-label="Star and follow us on GitHub for new releases">
        <FontAwesomeIcon :icon="['fab', 'github']" />
      </a>
      <a href="" aria-label="Read our blog on Medium">
        <FontAwesomeIcon icon="blog" />
      </a>
      <a href="" aria-label="Follow us on Twitter for updates and musings">
        <FontAwesomeIcon :icon="['fab', 'twitter']" />
      </a>
    </div>
    <a href="" class="license">BSD-3 License 2021 </a>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: $theme-dark;
  color: $white;
}

a {
  color: $white;
  padding: 10px;
  transition: opacity $fast;
}

.social,
.license {
  display: flex;
}

.social:hover a {
  opacity: 0.2;
}

.social:hover a:hover {
  opacity: 1;
}
</style>
