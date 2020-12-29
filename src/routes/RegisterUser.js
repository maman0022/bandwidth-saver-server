const express = require('express')
const bcrypt = require('bcryptjs')
const DatabaseService = require('../services/DatabaseService')

const RegisterUser = express.Router()

RegisterUser
  .route('/')
  .post(async (req, res, next) => {
    try {
      const requiredFields = { 'First Name': 'fname', 'Last Name': 'lname', 'Email': 'email', 'Password': 'password' }
      for (const field in requiredFields) {
        if (!req.body[requiredFields[field]]) {
          return res.status(400).json({ message: `${field} is required` })
        }
      }
      const { fname: first_name, lname: last_name, email, password } = req.body
      const isPwGood = (password.length >= 6 && password.length <= 72)
      if (!isPwGood) {
        return res.status(400).json({ message: 'Password must be between 6 and 72 characters' })
      }
      const user = await DatabaseService.getUser(req.app.get('db'), email)
      if (user) {
        return res.status(400).json({ message: 'User already exists' })
      }
      const pw = await bcrypt.hash(password, 10)
      const userData = {
        first_name,
        last_name,
        email,
        pw
      }
      await DatabaseService.addUser(req.app.get('db'), userData)
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  })

module.exports = RegisterUser