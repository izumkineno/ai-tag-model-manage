import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const target = document.querySelector('body > gradio-app').shadowRoot.getElementById('toprow') as HTMLElement
const container = document.createElement('div')
container.id = 'app'
target.insertBefore(container, target.nextElementSibling)
createApp(App)
  .use(createPinia())
  .mount(container)

// createApp(App)
//   .use(createPinia())
//   .mount('#toprow')
