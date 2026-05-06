import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'
import { createHead } from '@unhead/vue/client'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(naive)
app.use(head)
app.mount('#app')
