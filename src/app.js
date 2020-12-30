require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const AuthService = require('./services/AuthService')
const RegisterUser = require('./routes/RegisterUser')
const LoginUser = require('./routes/LoginUser')
const Drives = require('./routes/Drives')

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/register', RegisterUser)
app.use('/api/login', LoginUser)
app.use('/api/drives', AuthService.authenticateUser, Drives)
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { message: 'server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.get('/', (req, res) => res.send(`Hello, world! I'm a cAPItalist`))

module.exports = app