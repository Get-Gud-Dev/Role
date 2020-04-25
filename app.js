const server = require('./server')

const express = require('express')

const app = express()

const http = require('http').createServer(app)

module.exports.io = require('socket.io')(http)

let servePath = 'pub'
app.use(express.static(servePath))

app.get('/', (req, res) => {

})

http.listen(8067, () => console.log("Listening on port 8067."))
