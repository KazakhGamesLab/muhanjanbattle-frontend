<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html{
  min-width: 100%;
  min-height: 100%;
}
body{
  min-width: 99%;
  min-height: 98vh;
}

html, body {
    margin: 0 !important;
    padding: 0 !important;
}

#app {
  width: 100%;
  height: 98vh;
  margin: 0 auto;
}
</style>