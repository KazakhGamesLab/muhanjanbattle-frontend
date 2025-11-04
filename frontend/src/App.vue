<template>
  <div id="app">
    <nav style="padding: 10px; background: #eee; margin-bottom: 20px;">
      <router-link to="/" style="margin-right: 15px;">🎮 Игра</router-link>
      <router-link to="/editor">✏️ Редактор</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>