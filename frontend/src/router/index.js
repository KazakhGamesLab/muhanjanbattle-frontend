import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import EditorView from '../views/EditorView.vue'

const routes = [
  { path: '/', component: GameView },
  { path: '/editor', component: EditorView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router