import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const target = document.querySelector('body > gradio-app').shadowRoot.querySelector('#app') as HTMLElement
createApp(App)
  .use(createPinia())
  .mount(target)

// createApp(App)
//   .use(createPinia())
//   .mount('#app')
