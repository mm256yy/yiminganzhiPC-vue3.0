import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './lib/flexible.js'
// 公共样式
import './assets/reset.css'
import './assets/main.css'

const app = createApp(App)
console.log(app, 'bbq')

app.use(router)
app.mount('#app')
