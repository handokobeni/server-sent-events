const express = require('express')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let globalVersion = 0
let companies = {
  sebarulang: {subscribers: 0},
  arsanusa: {subscribers: 0},
  astra: {subscribers: 0}
}

app.get('/', (req, res) => res.render('channel'))

app.get('/subscribe/:companyId', (req, res) => {
  console.log(`Subscribe to: ${req.params.companyId}`)
  companies[req.params.companyId].subscribers++
  globalVersion++
  res.status(200).json({message: `Subscribed to company ${req.params.companyId}`})
})

app.get('/sse', (req, res) => {
  let localVersion = 0
  res.set("Content-Type", "text/event-stream")
  res.set("Connection", "keep-alive")
  res.set("Cache-Control", "no-cache")
  res.set("Access-Control-Allow-Origin", "*")

  setInterval(() => {
    if (localVersion < globalVersion) {
      res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
      localVersion = globalVersion
    }
  }, 100)

  console.log('client connected to sse')
})

app.listen(port, () => console.log(`Server running on port ${port}`))