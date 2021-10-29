<template>
  <input />
</template>

<style lang="scss" scoped>
input {
  width: 100%;
  min-height: 40px;
  padding: 0 10px;
  border: solid 2px $off-black;
  border-radius: 3px;
  outline: none;
  transition: box-shadow $fast;
}

input:hover,
input:focus {
  box-shadow: 0 0 0 3px $theme;
}
</style>
