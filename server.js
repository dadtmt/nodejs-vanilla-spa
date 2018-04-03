const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const app = express()
const usersSeed = require('./public/pirates.json')
let db

// permet de servir les ressources statiques du dossier public
app.use(express.static('public'))
app.use(bodyParser.json())

const insertUser = u => {
  const { firstName, lastName, bio, image, slug } = u
  return db.get('INSERT INTO users(slug, firstName, lastName, bio, image) VALUES(?, ?, ?, ?, ?)', slug, firstName, lastName, bio, image)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
}

const dbPromise = Promise.resolve()
.then(() => sqlite.open('./database.sqlite', { Promise }))
.then(_db => {
  db = _db
  return db.migrate({ force: 'last' })
})
.then(() => Promise.map(usersSeed, u => insertUser(u)))

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>NodeJS server</title>
    <link rel="stylesheet" href="/bootstrap.min.css" />
  </head>
  <body>
    <div id="main">

    </div>
    <script src="/page.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`


//routing cotè Serveur

//routes de l'api REST qui répondent par du

//CREATE
app.post('/pirates', (req, res) => {
  return insertUser(req.body)
  .then(record => res.json(record))
})

//READ
app.get('/pirates', (req, res) => {
  db.all('SELECT * from users')
  .then(records => res.json(records))
})

//READ
app.get('/wilders', (req, res) => {
  console.log("route wilders")
  const wilders = [
    {
      firstName: 'Aurélie',
      game: 'Monkey Island'
    },
    {
      firstName: 'Max',
      game: 'Halo'
    }
  ]
  res.json(wilders)
})

// route par défaut qui renvoit le code html/css/js complet de l'application
app.get('*', (req, res) => {
  // to test log du path
  res.send(html)
  res.end()
})

app.listen(8000)
