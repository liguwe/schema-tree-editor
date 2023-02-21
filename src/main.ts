import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 引入 Antd
import App from './App.vue'
import router from './router'

import './assets/main.css'


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';


const app = createApp(App)

// app.config.productionTip = false;

app.use(Antd);

app.use(createPinia())
app.use(router)

app.mount('#app')
