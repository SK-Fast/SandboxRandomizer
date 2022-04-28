const express = require('express')
const cors = require('cors')
const axios = require('axios').default
const app = express()
const port = 4000
const getMetaData = require('metadata-scraper')
const printscreen = require('printscreen');
const fs = require('fs')

app.use(express.json());

app.use(cors({
    origin: '*'
}))

app.get('/', (req, res) => {
    res.send('OK')
})

app.post('/getMeta', async (req, res) => {
    try {
        const data = await getMetaData(req.body.url)

        const finalSend = data

        return res.json(finalSend)
    } catch(err) {
        console.error(err)

        res.status(500)
        res.send({error: true})
        return
    }
})

app.post('/screenshot', async (req, res) => {
    try {
        printscreen(req.body.url, {

          /*
           * Optional: Define a suitable viewport size
           */
          viewport: {
            width: 1300,
            height: 800
          },
      
          /*
           * Optional: Define the time between the page being initiated and the printscreen taken
           */
          timeout: 1000,
      
          /*
           * Optional: Define the format of the printscreen taken (pdf|png|jpeg)
           */
          format: 'png',
      
          /*
           * Optional: Define the quality of the printscreen taken (0-100)
           */
          quality: 70,
        }, (err, data) => {        
        
            const imgRead = fs.readFileSync(data.file)
    
            const encodedImg = imgRead.toString('base64')
    
            res.send(encodedImg)
    
            fs.unlinkSync(data.file)
    
        })
        
    } catch(err) {
        console.error(err)
    
        res.status(500)
        res.send({error: true})
        return
    }
})

process.on('unhandledRejection', (result, error) => {
    console.log(error)
 })

 process.on('uncaughtException', (result, error) => {
    console.log(error)
 })

app.get('/listing', async (req, res) => {
    let response;

    try {
        response = await axios.get('https://api.sandboxcentral.com/api/listing/get')
        const data = response.data

        res.send(data)

        return
    } catch(err) {
        res.status(500)
        res.send(err)
        return
    }
})
    
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})