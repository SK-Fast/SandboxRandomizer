<template>
  <div>
    <div class="justify-content-center align-items-center w-100 hvh-100" id="loading-ui" style="display: flex">
      <div class="text-center container">

        <div class="d-flex justify-content-center">
          <div class="spinner-border text-primary mb-3" id="loader" role="status" style="width: 3rem; height: 3rem;display: none">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <h3><b>Sandbox site randomizer</b></h3>
        <p>find another lego website to join</p>
        <button class="btn btn-primary mt-2" @click="startRandom()">Start!</button>
      </div>
    </div>

    <div class="w-100 hvh-100" id="main-ui" style="opacity: 0;display: none">

      <div class="position-absolute contents-gradient-black">
      </div>

      <div class="p-4 position-absolute text-white d-flex flex-column">
        <div class="flex-grow-1">
          <div class="spinner-border text-primary mb-3" id="loaderSite" role="status" style="display: none">
            <span class="visually-hidden">Loading...</span>
          </div>

          <div class="d-flex align-items-center">
            <img src="" id="siteIcon" width="30">
          <div class="bg-light rounded ms-3" style="width: 200px;height: 3px"></div>
          </div>
          <h1 class="mt-2"><b>{{siteName}}</b></h1>
          <p class="text-muted">By: {{sitePublisher}}</p>
          <p class="mt-5" style="width: 200px">{{siteDescription}}</p>
        </div>

        <div class="d-flex flex-column">
          <button class="btn btn-light" @click="randomSite()">give me new one</button>
          <a class="btn btn-primary mt-2" v-bind:href="siteUrl">give me the site</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import configs from './config.js'

let loadingUi;
let loader;
let siteIcon;
let mainUi;
let vueThis;
let data;
let loaderSite;

export default {
  async mounted() {
    vueThis = this
    loadingUi = document.querySelector('#loading-ui')
    loader = document.querySelector('#loader')
    siteIcon = document.querySelector('#siteIcon')
    mainUi = document.querySelector('#main-ui')
    loaderSite = document.querySelector('#loaderSite')
  },
  data() {
    return {siteName: '', sitePublisher: '', siteDescription: '', siteUrl: ''}
  },
  methods: {
    startRandom: async () => {
      loader.style.display = 'block'

      const response = await fetch(configs().apiUrl + '/listing')
      data = await response.json()

      console.log(data)

      loadingUi.style.opacity = 0

      setTimeout(() => {
        loadingUi.style.display = 'none'

        setTimeout(() => {
          mainUi.style.display = 'block'
          mainUi.style.opacity = 1
        }, 500)
      }, 500)

      vueThis.randomSite()
    },

    randomSite: async() => {

      loaderSite.style.display = 'block'

      async function getSiteMetaData(siteLink) {
        const responseMetadata = await fetch(configs().apiUrl + '/getMeta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: siteLink
          })
        })

        const metaData = await responseMetadata.json()
        return metaData
      }

       async function getSiteScreenShot(siteLink) {
        const responseSiteBg = await fetch(configs().apiUrl + '/screenshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: siteLink
          })
        })
        const dataSiteBg = await responseSiteBg.text()
        return dataSiteBg
      }

      async function randomSite() {
        // randomize item in data array
        const randomIndex = Math.floor(Math.random() * data.length)
        const item = data[randomIndex]

        console.log(item)

        try {
          console.log('trying')

          const metaData = await getSiteMetaData(item.sitelink)
          const screenShot = await getSiteScreenShot(item.sitelink)

          console.log('finished fetch')

          document.body.style.backgroundImage = 'url(data:image/png;base64,' + screenShot + ')'

          if (metaData['icon']) {
            siteIcon.src = metaData['icon']
          } 

          const previewVideos = []

          vueThis.siteName = item.name
          vueThis.sitePublisher = item.siteowner

          if (metaData['description']) {
            vueThis.siteDescription = metaData['description']
          } else {
            vueThis.siteDescription = 'No description available'
          }

          vueThis.siteUrl = item.sitelink


      loaderSite.style.display = 'none'

        } catch(err) {
          console.log(err)
          //randomSite()
        }

      }
      randomSite()

    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.1.2/css/bootstrap.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
    transition: background-image 1s cubic-bezier(0.22, 1, 0.36, 1);
    background-repeat: no-repeat;
    background-size: cover;

}

#loading-ui {
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

#main-ui {
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.wvh-100 {
  width: 100vh;
}

.hvh-100 {
  height: 100vh;
}

.contents-gradient-black {
  width: 75%;
  height: 100vh;

  background: rgb(0,0,0);
  background: -moz-linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(176,176,176,0) 43%, rgba(255,255,255,0) 100%);
  background: -webkit-linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(176,176,176,0) 43%, rgba(255,255,255,0) 100%);
  background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(176,176,176,0) 43%, rgba(255,255,255,0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#ffffff",GradientType=1);
}
</style>
