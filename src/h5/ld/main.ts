import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../lib/flexible.js'
import { setupStore } from '@/store'
// 公共样式
import '../assets/reset.css'
import '../assets/main.css'

const app = createApp(App)

app.use(router)
setupStore(app)
app.mount('#app')
