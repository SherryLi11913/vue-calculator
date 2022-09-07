import { createRouter, createWebHistory } from 'vue-router'
import CalculatorView from '../views/Calculator.vue';

const routes = [
  {
    path: '/',
    name: 'calculator',
    component: CalculatorView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
