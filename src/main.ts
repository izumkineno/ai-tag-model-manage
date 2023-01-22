import { createApp } from 'vue'
import App from './App.vue'
import app from './appMonkey.vue'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

// 油猴打包
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const target = document.querySelector('body > gradio-app').shadowRoot.querySelector('#app') as HTMLElement
// createApp(app)
//   .use(createPinia())
//   .mount(target)
// 油猴测试
// createApp(app)
//   .use(createPinia())
//   .mount('#app')
// 普通
createApp(App)
  .use(createPinia())
  .mount('#app')
