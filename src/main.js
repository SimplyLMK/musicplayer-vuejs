import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { projectAuth } from './firebase/config'
import './assets/main.css'
import { AVPlugin } from 'vue-audio-visual'
import * as d3 from "d3"


//allow time for firebase to establish connection with the code
let app;

projectAuth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.use(AVPlugin)
    app.use(d3)
    app.use(router)
    
    app.mount('#app')
  }
})

